package com.dmerc12.api.unit.exception;

import com.dmerc12.api.exception.DuplicateResourceException;
import com.dmerc12.api.exception.GlobalExceptionHandler;
import com.dmerc12.api.exception.PasswordMismatchException;
import com.dmerc12.api.exception.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link GlobalExceptionHandler}.
 * <p>Verifies that each exception handler returns the correct HTTP status and structured
 * error response body for the corresponding exception type.
 * <p><b>Test scenarios:</b>
 * <ul>
 *     <li>Generic unhandled exceptions → 500 Internal Server Error</li>
 *     <li>Duplicate resource → 409 Conflict</li>
 *     <li>Password mismatch → 400 Bad Request</li>
 *     <li>Validation errors (method argument not valid) → 400 Bad Request with field errors</li>
 * </ul>
 *
 * @see GlobalExceptionHandler
 * @see DuplicateResourceException
 * @see PasswordMismatchException
 * @see MethodArgumentNotValidException
 */
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
@DisplayName("Global Exception Handler Unit Tests")
public class GlobalExceptionHandlerTests {

    @InjectMocks
    private GlobalExceptionHandler handler;

    @Nested
    @DisplayName("handleAllExceptions() Tests")
    class HandleAllExceptionsTests {
        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Returns 500 with structured error response")
        public void handleAllExceptionsMethodReturns500StructuredErrorResponse() {
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

    @Nested
    @DisplayName("handleDuplicateResourceException() Tests")
    class HandleDuplicateResourceExceptionTests {
        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Handles duplicate resource exception thrown")
        public void handlesDuplicateResourceExceptionThrown() {
            DuplicateResourceException ex = new DuplicateResourceException("Email already exists");
            ResponseEntity<Object> response = handler.handleDuplicateResourceException(ex);
            assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            assertEquals(409, body.get("status"));
            assertEquals("Duplicate Resource", body.get("error"));
            assertEquals(ex.getMessage(), body.get("message"));
        }
    }

    @Nested
    @DisplayName("handlePasswordMismatchException() Tests")
    class HandlePasswordMismatchExceptionTests {
        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Handles password mismatch exception thrown")
        public void handlesPasswordMismatchExceptionThrown() {
            PasswordMismatchException ex = new PasswordMismatchException("Passwords do not match");
            ResponseEntity<Object> response = handler.handlePasswordMismatchException(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            assertEquals(400, body.get("status"));
            assertEquals("Password Mismatch", body.get("error"));
            assertEquals("Passwords do not match", body.get("message"));
        }
    }

    @Nested
    @DisplayName("handleValidationExceptions() Test")
    class HandleValidationExceptionTests {
        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Handles validation errors")
        public void handlesValidationErrors() {
            String errorMessage1 = "Email is required";
            String errorMessage2 = "Password is required";
            FieldError fieldError1 = new FieldError("registerRequest", "email", errorMessage1);
            FieldError fieldError2 = new FieldError("registerRequest", "password", errorMessage2);
            BindingResult bindingResult = mock(BindingResult.class);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            when(ex.getBindingResult()).thenReturn(bindingResult);
            ResponseEntity<Object> response = handler.handleValidationExceptions(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            assertEquals(400, body.get("status"));
            assertEquals("Validation Failed", body.get("error"));
            assertEquals("Invalid request payload", body.get("message"));
            assertTrue(body.containsKey("fieldErrors"));
            Map<String, String> fieldErrors = (Map<String, String>) body.get("fieldErrors");
            assertEquals(2, fieldErrors.size());
            assertEquals(errorMessage1, fieldErrors.get("email"));
            assertEquals(errorMessage2, fieldErrors.get("password"));
        }

        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Handles duplicate field errors - merge function invoked")
        public void handlesDuplicateFieldErrorsMergingFunctionInvoked() {
            String errorMessage1 = "Email is required";
            String errorMessage2 = "Email must be valid";
            FieldError fieldError1 = new FieldError("registerRequest", "email", errorMessage1);
            FieldError fieldError2 = new FieldError("registerRequest", "email", errorMessage2);
            BindingResult bindingResult = mock(BindingResult.class);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            when(ex.getBindingResult()).thenReturn(bindingResult);
            ResponseEntity<Object> response = handler.handleValidationExceptions(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            Map<String, String> fieldErrors = (Map<String, String>) body.get("fieldErrors");
            assertEquals(1, fieldErrors.size());
            assertEquals(errorMessage1, fieldErrors.get("email"));
        }

        @Test
        @SuppressWarnings({"unchecked", "ConstantConditions"})
        @DisplayName("Filters out field errors with null message")
        public void filtersOutFieldErrorsWithNullMessage() {
            String errorMessage1 = "Email is required";
            FieldError fieldError1 = new FieldError("registerRequest", "email", errorMessage1);
            FieldError fieldError2 = new FieldError("registerRequest", "password", null);
            BindingResult bindingResult = mock(BindingResult.class);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            when(ex.getBindingResult()).thenReturn(bindingResult);
            ResponseEntity<Object> response = handler.handleValidationExceptions(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            Map<String, String> fieldErrors = (Map<String, String>) body.get("fieldErrors");
            assertEquals(1, fieldErrors.size());
            assertEquals(errorMessage1, fieldErrors.get("email"));
            assertFalse(fieldErrors.containsKey("password"));
        }
    }

    @Nested
    @DisplayName("handleResourceNotFoundException() Tests")
    class HandleResourceNotFoundExceptionTests {
        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Handles resource not found exception thrown")
        public void handlesResourceNotFoundExceptionThrown() {
            ResourceNotFoundException ex = new ResourceNotFoundException("Resource not found!");
            ResponseEntity<Object> response = handler.handleResourceNotFoundException(ex);
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            assertNotNull(body);
            assertEquals(404, body.get("status"));
            assertEquals("Resource Not Found", body.get("error"));
            assertEquals("Resource not found!", body.get("message"));
        }
    }
}
