package com.dmerc12.api.service;

import com.dmerc12.api.exception.InvalidTokenException;

/**
 * Service for authentication-related operations (token refresh, login, etc.).
 * <p>This interface defines the contract for handling authentication business logic
 * that is not directly related to user management (e.g., generating new access tokens).
 */
public interface AuthService {

    /**
     * Refreshes an expired access token using a valid refresh token.
     *
     * @param refreshToken the JWT refresh token (from header or cookie)
     * @return a new access token
     * @throws InvalidTokenException if the token is null, invalid, expired, or not a refresh token
     */
    String refreshAccessToken(String refreshToken);
}
