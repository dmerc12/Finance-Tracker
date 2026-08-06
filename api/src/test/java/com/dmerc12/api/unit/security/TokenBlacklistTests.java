package com.dmerc12.api.unit.security;

import com.dmerc12.api.security.TokenBlacklist;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link TokenBlacklist}.
 * <p>Verifies that tokens can be blacklisted, checked, and that expired entries are cleaned.
 */
@DisplayName("Token Blacklist Unit Tests")
public class TokenBlacklistTests {

    private TokenBlacklist blacklist;

    @BeforeEach
    public void setup() {
        blacklist = new TokenBlacklist();
    }

    @Test
    @DisplayName("Blacklist token and check")
    public void blacklistAndCheck() {
        String token = "test.token";
        Date expiry = new Date(System.currentTimeMillis() + 60000);
        blacklist.blacklistToken(token, expiry);
        assertThat(blacklist.isBlacklisted(token)).isTrue();
    }

    @Test
    @DisplayName("Expired token is removed and not blacklisted")
    public void expiredTokenRemoved() {
        String token = "expired.token";
        Date expiry = new Date(System.currentTimeMillis() - 1000);
        blacklist.blacklistToken(token, expiry);
        assertThat(blacklist.isBlacklisted(token)).isFalse();
        assertThat(blacklist.isBlacklisted(token)).isFalse();
    }

    @Test
    @DisplayName("Unknown token not blacklisted")
    public void unknownToken() {
        assertThat(blacklist.isBlacklisted("unknown")).isFalse();
    }

    @Test
    @DisplayName("cleanupExpired removes expired tokens and keeps valid ones")
    public void cleanupExpired() {
        String expiredToken = "expired";
        String validToken = "valid";
        Date past = new Date(System.currentTimeMillis() - 10000);
        Date future = new Date(System.currentTimeMillis() + 600000);
        blacklist.blacklistToken(expiredToken, past);
        blacklist.blacklistToken(validToken, future);
        blacklist.cleanupExpired();
        assertThat(blacklist.isBlacklisted(expiredToken)).isFalse();
        assertThat(blacklist.isBlacklisted(validToken)).isTrue();
    }

    @Test
    @DisplayName("cleanupExpired does nothing when no expired tokens")
    public void cleanupExpiredNoExpiredTokens() {
        String validToken = "valid";
        Date future = new Date(System.currentTimeMillis() + 600000);
        blacklist.blacklistToken(validToken, future);
        blacklist.cleanupExpired();
        assertThat(blacklist.isBlacklisted(validToken)).isTrue();
    }

    @Test
    @DisplayName("cleanupExpired handles empty blacklist")
    public void cleanupExpiredEmpty() {
        blacklist.cleanupExpired();
    }
}
