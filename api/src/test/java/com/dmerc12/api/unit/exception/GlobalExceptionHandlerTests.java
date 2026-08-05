package com.dmerc12.api.unit.exception;

import com.dmerc12.api.dto.ResponseDTO;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

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
        @DisplayName("Returns 500 with structured error response")
        public void handleAllExceptionsMethodReturns500StructuredErrorResponse() {
            RuntimeException ex = new RuntimeException("Test error");
            ResponseEntity<ResponseDTO<Object>> response = handler.handleAllExceptions(ex);
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertNotNull(response.getBody());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getTimestamp());
            assertEquals(500, body.getStatus());
            assertEquals("Internal Server Error", body.getError());
            assertEquals("An unexpected error occurred", body.getMessage());
            assertNull(body.getData());
            assertNull(body.getFieldErrors());
        }

        @Test
        @DisplayName("handleAllExceptions handles null message gracefully")
        public void handleAllExceptionsMethodWithNullMessage() {
            Exception ex = new Exception();
            ResponseEntity<ResponseDTO<Object>> response = handler.handleAllExceptions(ex);
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertNotNull(response.getBody());
        }
    }

    @Nested
    @DisplayName("handleDuplicateResourceException() Tests")
    class HandleDuplicateResourceExceptionTests {
        @Test
        @DisplayName("Handles duplicate resource exception thrown")
        public void handlesDuplicateResourceExceptionThrown() {
            DuplicateResourceException ex = new DuplicateResourceException("Email already exists");
            ResponseEntity<ResponseDTO<Object>> response = handler.handleDuplicateResourceException(ex);
            assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getTimestamp());
            assertEquals(409, body.getStatus());
            assertEquals("Duplicate Resource", body.getError());
            assertEquals(ex.getMessage(), body.getMessage());
            assertNull(body.getData());
            assertNull(body.getFieldErrors());
        }
    }

    @Nested
    @DisplayName("handlePasswordMismatchException() Tests")
    class HandlePasswordMismatchExceptionTests {
        @Test
        @DisplayName("Handles password mismatch exception thrown")
        public void handlesPasswordMismatchExceptionThrown() {
            PasswordMismatchException ex = new PasswordMismatchException("Passwords do not match");
            ResponseEntity<ResponseDTO<Object>> response = handler.handlePasswordMismatchException(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getTimestamp());
            assertEquals(400, body.getStatus());
            assertEquals("Password Mismatch", body.getError());
            assertEquals("Passwords do not match", body.getMessage());
            assertNull(body.getData());
            assertNull(body.getFieldErrors());
        }
    }

    @Nested
    @DisplayName("handleValidationExceptions() Test")
    class HandleValidationExceptionTests {
        @Test
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
            ResponseEntity<ResponseDTO<Object>> response = handler.handleValidationExceptions(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getTimestamp());
            assertEquals(400, body.getStatus());
            assertEquals("Validation Failed", body.getError());
            assertEquals("Invalid request payload", body.getMessage());
            assertNotNull(body.getFieldErrors());
            assertEquals(2, body.getFieldErrors().size());
            assertEquals(errorMessage1, body.getFieldErrors().get("email"));
            assertEquals(errorMessage2, body.getFieldErrors().get("password"));
            assertNull(body.getData());
        }

        @Test
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
            ResponseEntity<ResponseDTO<Object>> response = handler.handleValidationExceptions(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getFieldErrors());
            assertEquals(1, body.getFieldErrors().size());
            assertEquals(errorMessage1, body.getFieldErrors().get("email"));
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Filters out field errors with null message")
        public void filtersOutFieldErrorsWithNullMessage() {
            String errorMessage1 = "Email is required";
            FieldError fieldError1 = new FieldError("registerRequest", "email", errorMessage1);
            FieldError fieldError2 = new FieldError("registerRequest", "password", null);
            BindingResult bindingResult = mock(BindingResult.class);
            when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError1, fieldError2));
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            when(ex.getBindingResult()).thenReturn(bindingResult);
            ResponseEntity<ResponseDTO<Object>> response = handler.handleValidationExceptions(ex);
            assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getFieldErrors());
            assertEquals(1, body.getFieldErrors().size());
            assertEquals(errorMessage1, body.getFieldErrors().get("email"));
            assertFalse(body.getFieldErrors().containsKey("password"));
        }
    }

    @Nested
    @DisplayName("handleResourceNotFoundException() Tests")
    class HandleResourceNotFoundExceptionTests {
        @Test
        @DisplayName("Handles resource not found exception thrown")
        public void handlesResourceNotFoundExceptionThrown() {
            ResourceNotFoundException ex = new ResourceNotFoundException("Resource not found!");
            ResponseEntity<ResponseDTO<Object>> response = handler.handleResourceNotFoundException(ex);
            assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getTimestamp());
            assertEquals(404, body.getStatus());
            assertEquals("Resource Not Found", body.getError());
            assertEquals("Resource not found!", body.getMessage());
            assertNull(body.getData());
            assertNull(body.getFieldErrors());
        }
    }

    @Nested
    @DisplayName("handleAccessDeniedException() Tests")
    class HandleAccessDeniedExceptionTests {
        @Test
        @DisplayName("Returns 403 Forbidden with error details")
        public void handlesAccessDeniedExceptionThrown() {
            String errorMessage = "Access is denied";
            AccessDeniedException ex = new AccessDeniedException(errorMessage);
            ResponseEntity<ResponseDTO<Object>> response = handler.handleAccessDeniedException(ex);
            assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
            ResponseDTO<Object> body = response.getBody();
            assertNotNull(body);
            assertNotNull(body.getTimestamp());
            assertEquals(403, body.getStatus());
            assertEquals("Forbidden", body.getError());
            assertEquals(errorMessage, body.getMessage());
            assertNull(body.getData());
            assertNull(body.getFieldErrors());
        }
    }
}
