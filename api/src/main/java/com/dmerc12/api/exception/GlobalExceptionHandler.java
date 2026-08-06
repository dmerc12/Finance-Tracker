package com.dmerc12.api.exception;

import com.dmerc12.api.dto.ResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler for the Finance Tracker API.
 * <p> Centralizes exception handling and returns consistent error responses wrapped in {@link ResponseDTO}.
 * This class centralizes exception handling across all controllers using Spring's {@link ControllerAdvice}.
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
 * @see ResponseDTO
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
     * Handles all unhandled exceptions.
     *
     * @param ex the thrown exception
     * @return 500 Internal Server Error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDTO<Object>> handleAllExceptions(Exception ex) {
        log.error("Unhandled exception occurred", ex);
        ResponseDTO<Object> response = ResponseDTO.error(
                "An unexpected error occurred",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error"
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handles duplicate resource conflicts.
     *
     * @param ex the thrown exception
     * @return 409 Conflict
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ResponseDTO<Object>> handleDuplicateResourceException(DuplicateResourceException ex) {
        log.error("Duplicate resource exception occurred", ex);
        ResponseDTO<Object> response = ResponseDTO.error(
                ex.getMessage(),
                HttpStatus.CONFLICT.value(),
                "Duplicate Resource"
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Handles password mismatch errors.
     *
     * @param ex the thrown exception
     * @return 400 Bad Request
     */
    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ResponseDTO<Object>> handlePasswordMismatchException(PasswordMismatchException ex) {
        log.error("Password mismatch exception occurred", ex);
        ResponseDTO<Object> response = ResponseDTO.error(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                "Password Mismatch"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles validation errors from {@code @Valid} request bodies.
     *
     * @param ex the thrown exception
     * @return 400 Bad Request with field-specific errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseDTO<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
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
        ResponseDTO<Object> response = ResponseDTO.error(
                "Invalid request payload",
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                fieldErrors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles resource not found errors.
     *
     * @param ex the thrown exception
     * @return 404 Not Found
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseDTO<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.error("Resource not found exception occurred", ex);
        ResponseDTO<Object> response = ResponseDTO.error(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                "Resource Not Found"
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handles access denied errors (403 Forbidden)
     *
     * @param ex the thrown exception
     * @return 403 Forbidden
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseDTO<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        log.error("Access denied exception occurred", ex);
        ResponseDTO<Object> response = ResponseDTO.error(
                ex.getMessage(),
                HttpStatus.FORBIDDEN.value(),
                "Forbidden"
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ResponseDTO<Object>> handleInvalidTokenException(InvalidTokenException ex) {
        log.error("Invalid token: {}", ex.getMessage());
        ResponseDTO<Object> response = ResponseDTO.error(
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED.value(),
                "Invalid Token"
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // TODO: Add specific exception handlers here as the application grows:
    // - handleAuthenticationException(AuthenticationException ex)
    // These should return appropriate HTTP status codes (404, 400, 401, 403)
}
