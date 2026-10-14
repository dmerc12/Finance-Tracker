package com.dmerc12.api.exception;

import lombok.Getter;

/**
 * Exception thrown when a client exceeds the rate limit for an endpoint.
 *
 * <p>Mapped to HTTP 429 Too Many Requests by {@link GlobalExceptionHandler},
 * including a {@code Retry-After} header indicating the number of seconds the client should wait before retrying.
 *
 * <p><b>Not an {@link AuthException}.</b> Rate limiting is a throttle,
 * not an authentication failure - the same exception type would apply to any
 * endpoint that needs to rate limit its callers.
 */
@Getter
public class RateLimitExceededException extends RuntimeException {
    /**
     *  Returns the number of seconds the client should wait before retrying.
     */
    private final long retryAfterSeconds;

    /**
     * Constructs a new rate limit exception.
     *
     * @param message human-readable message returned to the client
     * @param retryAfterSeconds number of seconds the client should wait before retrying
     */
    public RateLimitExceededException(String message, long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }
}
