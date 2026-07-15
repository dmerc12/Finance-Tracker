package com.dmerc12.api.unit.audit;

import com.dmerc12.api.audit.JpaAuditEventRepository;
import com.dmerc12.api.entity.AuditLog;
import com.dmerc12.api.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@Transactional
@SpringBootTest
@ActiveProfiles("test")
@DisplayName("JPA Audit Event Repository Unit Tests")
public class JpaAuditEventRepositoryTests {

    @Autowired
    private JpaAuditEventRepository repository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @BeforeEach
    void setup() {
        auditLogRepository.deleteAll();
    }

    private AuditEvent createTestAuditEvent() {
        return new AuditEvent("test-principal", "TEST_EVENT", Map.of("key1", "value1", "key2", 123));
    }

    @Nested
    @DisplayName("add() method")
    class AddMethodTests {
        @Test
        @DisplayName("Save audit event successfully")
        public void saveAuditEventSuccessfully() {
            RequestContextHolder.resetRequestAttributes();
            AuditEvent event = createTestAuditEvent();
            repository.add(event);
            auditLogRepository.flush();
            List<AuditLog> logs = auditLogRepository.findAll();
            assertEquals(1, logs.size());
            AuditLog saved = logs.getFirst();
            assertEquals(event.getType(), saved.getEventType());
            assertEquals(event.getPrincipal(), saved.getPrincipal());
            assertEquals(event.getTimestamp(), saved.getTimestamp());
            assertEquals(event.getData(), saved.getData());
            assertNull(saved.getIpAddress());
            assertNull(saved.getUserAgent());
        }

        @Test
        @DisplayName("IP address and User-Agent are captured")
        public void ipAddressAndUserAgentAreCaptured() {
            String ipAddress = "192.168.1.100";
            String userAgent = "Mozilla/5.0 (Test)";
            MockHttpServletRequest request = new MockHttpServletRequest();
            request.setRemoteAddr(ipAddress);
            request.addHeader("User-Agent", userAgent);
            ServletRequestAttributes attributes = new ServletRequestAttributes(request);
            RequestContextHolder.setRequestAttributes(attributes);
            try {
                AuditEvent event = createTestAuditEvent();
                repository.add(event);
                auditLogRepository.flush();
                List<AuditLog> logs = auditLogRepository.findAll();
                assertEquals(1, logs.size());
                assertEquals(ipAddress, logs.getFirst().getIpAddress());
                assertEquals(userAgent, logs.getFirst().getUserAgent());
            } finally {
                RequestContextHolder.resetRequestAttributes();
            }
        }

        @Test
        @DisplayName("No request context")
        public void noRequestContext() {
            RequestContextHolder.resetRequestAttributes();
            AuditEvent event = createTestAuditEvent();
            repository.add(event);
            auditLogRepository.flush();
            List<AuditLog> logs = auditLogRepository.findAll();
            assertEquals(1, logs.size());
            assertNull(logs.getFirst().getIpAddress());
            assertNull(logs.getFirst().getUserAgent());
        }
    }

    @Nested
    @DisplayName("find() method")
    class FindMethodTests {
        @Test
        @DisplayName("Returns empty list")
        public void returnsEmptyList() {
            repository.add(createTestAuditEvent());
            auditLogRepository.flush();
            List<AuditEvent> result = repository.find(null, null, null);
            assertNotNull(result);
            assertEquals(0, result.size());
        }

        @Test
        @DisplayName("Filter parameters are ignored")
        public void filterParametersAreIgnored() {
            repository.add(createTestAuditEvent());
            auditLogRepository.flush();
            List<AuditEvent> result = repository.find("test-principal", Instant.now().minusSeconds(60), "TEST_EVENT");
            assertNotNull(result);
            assertEquals(0, result.size());
        }
    }
}
