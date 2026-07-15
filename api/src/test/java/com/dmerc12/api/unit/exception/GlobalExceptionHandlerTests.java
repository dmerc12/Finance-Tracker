package com.dmerc12.api.unit.exception;

import com.dmerc12.api.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
@DisplayName("Global Exception Handler Unit Tests")
public class GlobalExceptionHandlerTests {

    @InjectMocks
    private GlobalExceptionHandler handler;

    @Nested
    @DisplayName("handleAllExceptions() method")
    class HandleAllExceptionsTests {
        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Returns 500 with structured error response")
        public void handleAllExceptionsMethodReturns500StructuredErrorResponse() throws Exception {
            RuntimeException ex = new RuntimeException("Test error");
            ResponseEntity<Object> response = handler.handleAllExceptions(ex);
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertNotNull(response.getBody());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertTrue(body.containsKey("timestamp"));
            assertEquals(500, body.get("status"));
            assertEquals("Internal Server Error", body.get("error"));
            assertEquals("An unexpected error occurred", body.get("message"));
        }

        @Test
        @DisplayName("handleAllExceptions handles null message gracefully")
        public void handleAllExceptionsMethodWithNullMessage() {
            Exception ex = new Exception();
            ResponseEntity<Object> response = handler.handleAllExceptions(ex);
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertNotNull(response.getBody());
        }
    }
}
