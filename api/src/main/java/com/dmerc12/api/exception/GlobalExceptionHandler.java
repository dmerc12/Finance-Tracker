package com.dmerc12.api.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

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

    // TODO: Add specific exception handlers here as the application grows:
    // - handleResourceNotFoundException(ResourceNotFoundException ex)
    // - handleValidationException(MethodArgumentNotValidException ex)
    // - handleAuthenticationException(AuthenticationException ex)
    // - handleAccessDeniedException(AccessDeniedException ex)
    // These should return appropriate HTTP status codes (404, 400, 401, 403)
}
