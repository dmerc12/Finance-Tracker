package com.dmerc12.api.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory blacklist for invalidated JWT tokens.
 * <p>Tokens are added to the blacklist (e.g., on logout) and are rejected by the {@link JwtAuthenticationFilter}.
 * Expired entries are automatically cleaned up.
 * <p>For production, consider using a distributed cache like Redis.
 */
@Slf4j
@Component
public class TokenBlacklist {

    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    /**
     * Adds a token to the blacklist with its expiration date.
     *
     * @param token the JWT string
     * @param expiry the expiration date of the token
     */
    public void blacklistToken(String token, Date expiry) {
        blacklist.put(token, expiry);
        log.debug("Token blacklisted: {}", token.substring(0, Math.min(token.length(), 10)) + "...");
    }

    /**
     * Checks if a token is blacklisted.
     * <p>If the entry exists but its expiry is in the past, it is automatically removed
     * and {@code false} is returned.
     *
     * @param token the JWT string
     * @return {@code true} if the token is currently blacklisted
     */
    public boolean isBlacklisted(String token) {
        Date expiry = blacklist.get(token);
        if (expiry == null) return false;
        if (expiry.before(new Date())) {
            blacklist.remove(token);
            log.debug("Expired token removed from blacklist");
            return false;
        }
        log.debug("Token is blacklisted");
        return true;
    }

    /**
     * Scheduled cleanup of expired blacklist entries.
     * Runs daily at midnight.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupExpired() {
        Date now = new Date();
        int initialSize = blacklist.size();
        blacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
        int removed = initialSize - blacklist.size();
        if (removed > 0) {
            log.info("Removed {} expired tokens from blacklist", removed);
        }
    }
}
