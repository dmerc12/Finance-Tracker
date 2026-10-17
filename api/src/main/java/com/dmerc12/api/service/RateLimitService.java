package com.dmerc12.api.service;

import com.dmerc12.api.exception.RateLimitExceededException;

/**
 * Enforces per-key rate limits on authentication endpoints.
 *
 * <p>Uses Bucket4j in-memory buckets, one per key.
 * Login is limited both per email address (the primary brute-force defense) and per client IP
 * (a secondary catch for distributed attacks against many accounts from one origin).
 * Registration is limited per client IP only.
 *
 * <p>When a limit is exceeded, throws {@link RateLimitExceededException} with a {@code RetryAfter} hint.
 * The exception is caught by {@code GlobalExceptionHandler} and translated to a 429 response.
 *
 * <p><b>Storage trade-off.</b>
 * Buckets are held in {@code ConcurrentHashMap} instances that grow as new keys are seen and are never evicted.
 * For the current single-instance deployment with short-lived sessions this is acceptable;
 * for production at scale, swap in a Caffeine-backed cache with {@code maximumSize} + {@code expireAfterAccess},
 * or a distributed store (Redis) if the app runs behind a load balancer.
 * Flagged as a follow-up.
 *
 * <p><b>Client IP resolution.</b>
 * Prefers the first entry of {@code X-Forwarded-For} when present, otherwise {@code getRemoteAddr()}.
 * Only trust and header when the app sits behind a proxy that sets it -
 * see {@code AuthController.extractClientIp}.
 */
public interface RateLimitService {

    /**
     * Checks both the per-email and per-IP login rate limits, consuming one token from each.
     * Throws on the first limit that is exceeded.
     *
     * @param email the email address from the login request
     * @param ipAddress the client's IP address
     * @throws RateLimitExceededException if either limit is exhausted
     */
    void checkLogin(String email, String ipAddress);

    /**
     * Checks the per-IP registration rate limit, consuming one token.
     *
     * @param ipAddress the client's IP address
     * @throws RateLimitExceededException if the limit is exhausted
     */
    void checkRegister(String ipAddress);

    /**
     * Clears every bucket.
     *
     * <p>Intended for test isolation: the service is a singleton,
     * so state leaks between test methods unless it is reset.
     * Not used in production request flows.
     */
    void reset();
}
