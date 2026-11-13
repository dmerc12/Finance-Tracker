package com.dmerc12.api.unit.service;

import com.dmerc12.api.config.RateLimitProperties;
import com.dmerc12.api.exception.RateLimitExceededException;
import com.dmerc12.api.service.RateLimitService;
import com.dmerc12.api.service.impl.RateLimitServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.actuate.audit.AuditEventRepository;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for {@link RateLimitService}.
 *
 * <p>Verifies per-email and per-IP bucket consumption, rate-limit breaches, key isolation,
 * and the {@code reset} escape hatch used by integration tests.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Rate Limit Service Unit Tests")
public class RateLimitServiceTests {

    @Mock
    private AuditEventRepository auditEventRepository;

    private RateLimitService service;

    @BeforeEach
    public void setup() {
        RateLimitProperties properties = new RateLimitProperties();
        properties.getLogin().setEmailCapacity(3);
        properties.getLogin().setEmailWindowSeconds(60);
        properties.getLogin().setIpCapacity(5);
        properties.getLogin().setIpWindowSeconds(60);
        properties.getRegister().setIpCapacity(2);
        properties.getRegister().setIpWindowSeconds(60);
        service = new RateLimitServiceImpl(properties, auditEventRepository);
    }

    @Nested
    @DisplayName("checkLogin()")
    class CheckLoginTests {

        @Nested
        @DisplayName("Email checks")
        class EmailChecks {
            @Test
            @DisplayName("Allows requests up to the per-email capacity")
            public void allowsUpToPerEmailCapacity() {
                for (int i = 0; i < 3; i++) {
                    assertThatCode(() -> service.checkLogin("user@example.com", "1.1.1.1"))
                            .doesNotThrowAnyException();
                }
            }

            @Test
            @DisplayName("Rejects the request after the per-email capacity is exhausted")
            public void rejectsAfterPerEmailCapacity() {
                for (int i = 0; i < 3; i++) {
                    service.checkLogin("user@example.com", "1.1.1.1");
                }
                assertThatThrownBy(() -> service.checkLogin("user@example.com", "1.1.1.1"))
                        .isInstanceOf(RateLimitExceededException.class)
                        .hasMessageContaining("login attempts for this email");
                verify(auditEventRepository).add(argThat(event -> "RATE_LIMIT_EXCEEDED".equals(event.getType())
                        && "user@example.com".equals(event.getPrincipal())
                        && "email".equals(event.getData().get("limitType"))));
            }

            @Test
            @DisplayName("Retry-After is a positive number of seconds")
            public void retryAfterIsPositive() {
                for (int i = 0; i < 3; i++) {
                    service.checkLogin("user@example.com", "1.1.1.1");
                }
                assertThatThrownBy(() -> service.checkLogin("user@example.com", "1.1.1.1"))
                        .isInstanceOfSatisfying(RateLimitExceededException.class,
                                ex -> assertThat(ex.getRetryAfterSeconds()).isPositive());
            }

            @Test
            @DisplayName("Different emails have independent buckets")
            public void differentEmailsAreIndependent() {
                for (int i = 0; i < 3; i++) {
                    service.checkLogin("user-a@example.com", "1.1.1.1");
                }
                assertThatCode(() -> service.checkLogin("user-b@example.com", "1.1.1.1"))
                        .doesNotThrowAnyException();
            }

            @Test
            @DisplayName("Email keys are normalized to lowercase and trimmed")
            public void emailKeysAreNormalized() {
                service.checkLogin("User@Example.com", "1.1.1.1");
                service.checkLogin("user@example.com", "1.1.1.1");
                service.checkLogin("USER@EXAMPLE.COM", "1.1.1.1");
                assertThatThrownBy(() -> service.checkLogin("  user@example.com  ", "1.1.1.1"))
                        .isInstanceOf(RateLimitExceededException.class);
            }

            @Test
            @DisplayName("Null email is normalized to empty string and rate limited under that key")
            public void nullEmailNormalizedToEmpty() {
                for (int i = 0; i < 3; i++) {
                    service.checkLogin(null, "1.1.1.1");
                }
                assertThatThrownBy(() -> service.checkLogin(null, "1.1.1.1"))
                        .isInstanceOf(RateLimitExceededException.class)
                        .hasMessageContaining("login attempts for this email");
            }

            @Test
            @DisplayName("short keys (<= 4 chars) are fully masked on breach")
            public void shortKeysAreFullyMasked() {
                for (int i = 0; i < 3; i++) {
                    service.checkLogin("a@b", "1.1.1.1");
                }
                assertThatThrownBy(() -> service.checkLogin("a@b", "1.1.1.1"))
                        .isInstanceOf(RateLimitExceededException.class);
            }
        }

        @Nested
        @DisplayName("IP address checks")
        class IPAddressChecks {

            @Test
            @DisplayName("IP limit is independent of the email limit")
            public void ipLimitIsIndependent() {
                for (int i = 0; i < 5; i++) {
                    service.checkLogin("email-" + i + "@example.com", "9.9.9.9");
                }
                assertThatThrownBy(() -> service.checkLogin("email-5@example.com", "9.9.9.9"))
                        .isInstanceOf(RateLimitExceededException.class)
                        .hasMessageContaining("login attempts for this IP");
            }
        }

        @Test
        @DisplayName("A failing audit write does not prevent the rate limit exception")
        public void auditFailureDoesNotBreakTheLimit() {
            doThrow(new RuntimeException("DB down")).when(auditEventRepository).add(any());
            for (int i = 0; i < 3; i++) {
                service.checkLogin("user@example.com", "1.1.1.1");
            }
            assertThatThrownBy(() -> service.checkLogin("user@example.com", "1.1.1.1"))
                    .isInstanceOf(RateLimitExceededException.class);
        }
    }

    @Nested
    @DisplayName("checkRegister()")
    class CheckRegisterTests {

        @Test
        @DisplayName("Allows requests up to the per-IP capacity")
        public void allowsUpToPerIpCapacity() {
            assertThatCode(() -> service.checkRegister("1.1.1.1")).doesNotThrowAnyException();
            assertThatCode(() -> service.checkRegister("1.1.1.1")).doesNotThrowAnyException();
        }

        @Test
        @DisplayName("Rejects the request after the per-IP capacity is exhausted")
        public void rejectsAfterPerIpCapacity() {
            service.checkRegister("1.1.1.1");
            service.checkRegister("1.1.1.1");
            assertThatThrownBy(() -> service.checkRegister("1.1.1.1"))
                    .isInstanceOf(RateLimitExceededException.class)
                    .hasMessageContaining("register attempts for this IP");
            verify(auditEventRepository).add(argThat(event -> "RATE_LIMIT_EXCEEDED".equals(event.getType())
                    && "anonymous" .equals(event.getPrincipal())
                    && "ip".equals(event.getData().get("limitType"))));
        }

        @Test
        @DisplayName("Registration and login buckets are independent")
        public void independentFromLoginBuckets() {
            service.checkRegister("5.5.5.5");
            service.checkRegister("5.5.5.5");
            assertThatCode(() -> service.checkLogin("user@example.com", "5.5.5.5"))
                    .doesNotThrowAnyException();
        }
    }

    @Nested
    @DisplayName("reset()")
    class ResetTests {

        @Test
        @DisplayName("Clears all buckets so consumption starts fresh")
        public void clearsAllBuckets() {
            for (int i = 0; i < 3; i++) {
                service.checkLogin("user@example.com", "1.1.1.1");
            }
            service.reset();
            assertThatCode(() -> service.checkLogin("user@example.com", "1.1.1.1"))
                    .doesNotThrowAnyException();
        }
    }
}
