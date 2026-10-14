package com.dmerc12.api.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a password confirmation does not match,
 * or when the old password provided during a password change is incorrect.
 *
 * <p>Mapped to HTTP 400 Bad Request by {@link GlobalExceptionHandler}.
 */
public class PasswordMismatchException extends AuthException {

    /**
     * Constructs a new exception with the specified detail message
     *
     * @param message the detail message
     */
    public PasswordMismatchException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "Password Mismatch");
    }
}
