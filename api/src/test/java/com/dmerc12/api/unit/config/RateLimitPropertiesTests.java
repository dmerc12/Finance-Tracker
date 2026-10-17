package com.dmerc12.api.unit.config;

import com.dmerc12.api.config.RateLimitProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link RateLimitProperties}.
 */
@DisplayName("Rate Limit Properties Tests")
public class RateLimitPropertiesTests {

    @Nested
    @DisplayName("defaults")
    class DefaultsTests {

        @Test
        @DisplayName("Login defaults are 5 per email / 15 min and 20 per IP / 15 min")
        public void loginDefaults() {
            RateLimitProperties props = new RateLimitProperties();
            assertThat(props.getLogin().getEmailCapacity()).isEqualTo(5);
            assertThat(props.getLogin().getEmailWindowSeconds()).isEqualTo(900L);
            assertThat(props.getLogin().getIpCapacity()).isEqualTo(20);
            assertThat(props.getLogin().getIpWindowSeconds()).isEqualTo(900L);
        }

        @Test
        @DisplayName("Register defaults are 5 per IP / hour")
        public void registerDefaults() {
            RateLimitProperties props = new RateLimitProperties();
            assertThat(props.getRegister().getIpCapacity()).isEqualTo(5);
            assertThat(props.getRegister().getIpWindowSeconds()).isEqualTo(3600L);
        }
    }
}
