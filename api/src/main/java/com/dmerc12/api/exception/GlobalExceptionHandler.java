package com.dmerc12.api.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler for the Finance Tracker API.
 * <p>This class centralizes exception handling across all controllers using Spring's {@link ControllerAdvice}.
 * It provides consistent error responses to clients and ensures that all exceptions are properly logged for
 * monitoring and debugging.
 * <p>By centralizing exception handling, this class:
 * <ul>
 *     <li>Prevents sensitive error details from being exposed to clients</li>
 *     <li>Ensures consistent error response format across all endpoints</li>
 *     <li>Provides a single location for logging all unhandled exceptions</li>
 *     <li>Allows for easy addition of specific handlers as the application grows</li>
 * </ul>
 *
 * @see ControllerAdvice
 * @see ExceptionHandler
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Logger instance for recording exception details.
     * <p>All unhandled exceptions are logged at ERROR level with their full stack trace for debugging and
     * monitoring purposes.
     */
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles all unhandled exceptions that are not caught by more specific exception handlers.
     * <p>This method catches any {@link Exception} not already handled elsewhere, logs the error with
     * full stack trace, and returns a generic error response to the client.
     * The response includes:
     * <ul>
     *     <li>Timestamp of the error</li>
     *     <li>HTTP status code (500 Internal Server Error)</li>
     *     <li>Error type</li>
     *     <li>Generic user-friendly error message</li>
     * </ul>
     * <p><b>Security Note:</b>
     * The generic error message prevents leaking internal implementation details that could be exploited by attackers.
     * More specific error messages should be added for known exception types.
     *
     * @param ex the unhandled exception that was thrown
     * @return a {@link ResponseEntity} containing a structured error response with
     * HTTP status 500 (Internal Server Error)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex) {
        log.error("Unhandled exception occurred", ex);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "An unexpected error occurred");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles {@link DuplicateResourceException} when a resource already exists.
     * <p>Returns a 409 Conflict response with the exception message.
     *
     * @param ex the thrown exception
     * @return a {@link ResponseEntity} with status 409 and a structured error body
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicateResourceException(DuplicateResourceException ex) {
        log.error("Duplicate resource exception occurred", ex);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.CONFLICT.value());
        body.put("error", "Duplicate Resource");
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    /**
     * Handles {@link PasswordMismatchException} when password and confirmation do not match.
     * <p>Returns a 400 Bad Request response with the exception message.
     *
     * @param ex the thrown exception
     * @return a {@link ResponseEntity} with status 400 and a structured error body
     */
    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<Object> handlePasswordMismatchException(PasswordMismatchException ex) {
        log.error("Password mismatch exception occurred", ex);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Password Mismatch");
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles validation errors from {@code @Valid} request bodies.
     * <p>Returns a 400 Bad Request response with a map of field-specific error messages.
     *
     * @param ex the thrown exception containing the binding results
     * @return a {@link ResponseEntity} with status 400 and a structured error body including field errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.error("Validation exception occurred", ex);
        Map<String, String> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .filter(fe -> fe.getDefaultMessage() != null)
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (existing, replacement) -> existing
                ));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation Failed");
        body.put("message", "Invalid request payload");
        body.put("fieldErrors", fieldErrors);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles {@link ResourceNotFoundException} when a resource is not found.
     * <p>Returns a 404 Not Found response with the exception message.
     *
     * @param ex the thrown exception
     * @return a {@link ResponseEntity} with status 400 and a structured error body
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("Resource not found exception occurred", ex);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Resource Not Found");
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // TODO: Add specific exception handlers here as the application grows:
    // - handleAuthenticationException(AuthenticationException ex)
    // - handleAccessDeniedException(AccessDeniedException ex)
    // These should return appropriate HTTP status codes (404, 400, 401, 403)
}
