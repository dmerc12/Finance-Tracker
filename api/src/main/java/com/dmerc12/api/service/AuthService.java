package com.dmerc12.api.service;

import com.dmerc12.api.dto.LoginRequest;
import com.dmerc12.api.dto.LoginResponse;
import com.dmerc12.api.exception.InvalidTokenException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;

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

    /**
     * Authenticates a user with email and password.
     *
     * @param request the login request containing email and password
     * @return a {@link LoginResponse} containing the access token and user details
     * @throws BadCredentialsException if credentials are invalid
     */
    LoginResponse login(LoginRequest request, HttpServletResponse response);
}
