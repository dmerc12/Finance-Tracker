package com.dmerc12.api.exception;

/**
 * Exception thrown when a JWT token is invalid, expired, or of the wrong type.
 * <p>Mapped to HTTP 401 Unauthorized by {@link GlobalExceptionHandler}.
 */
public class InvalidTokenException extends RuntimeException {

    /**
     * Constructs a new exception with the specified detail message.
     *
     * @param message the detail message
     */
    public InvalidTokenException(String message) {
        super(message);
    }
}
