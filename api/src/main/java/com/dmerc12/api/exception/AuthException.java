package com.dmerc12.api.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base class for authentication-related exceptions.
 *
 * <p>Each concrete subclass carries the HTTP status and short error code
 * that {@link GlobalExceptionHandler} should emit for it.
 * This lets new authentication failure modes be added by introducing a subclass rather
 * than by editing the global handler.
 *
 * <p><b>Not included in this hierarchy:</b>
 * <ul>
 *     <li>
 *         {@link DuplicateResourceException} - a generic resource concern,
 *         not authentication-specific, even though registration is a common caller.
 *     </li>
 *     <li>{@link ResourceNotFoundException} - likewise generic.</li>
 *     <li>
 *         {@link RateLimitExceededException} - a throttle, not an authentication failure.
 *     </li>
 * </ul>
 *
 * @see GlobalExceptionHandler
 */
@Getter
public abstract class AuthException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    /**
     * Constructs a new authentication exception.
     *
     * @param message human-readable message returned to the client
     * @param status HTTP status to emit
     * @param errorCode short error code for the {@code error} field of the response body
     */
    protected AuthException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}
