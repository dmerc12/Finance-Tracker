package com.dmerc12.api.service;

import com.dmerc12.api.dto.LoginRequest;
import com.dmerc12.api.dto.LoginResponse;
import com.dmerc12.api.dto.RefreshedTokensDTO;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;

/**
 * Service for authentication-related operations (token refresh, login, etc.).
 * <p>This interface defines the contract for handling authentication business logic
 * that is not directly related to user management (e.g., generating new access tokens).
 */
public interface AuthService {

    /**
     * Refreshes an expired access token using a valid refresh token, and rotates
     * the refresh token in the same operation.
     * Rotates the refresh token.
     *
     * <p>On success, both the new access token and new refresh token are
     * written to the HTTP response as an HTTP-only cookie via
     * {@link JwtService#setAccessTokenCookie} and {@link JwtService#setRefreshTokenCookie}.
     * The same values are returned so the controller can surface them in the
     * response body for non-cookie clients.
     *
     * @param refreshToken the current JWT refresh token (from header or cookie)
     * @param response the HTTP response on which the rotated cookies are set
     * @return the newly generated {@link RefreshedTokensDTO}
     * @throws InvalidTokenException if the token is null, invalid, expired, or not a refresh token
     */
    RefreshedTokensDTO refreshTokens(String refreshToken, HttpServletResponse response);

    /**
     * Authenticates a user with email and password.
     *
     * @param request the login request containing email and password
     * @param response the HTTP response on which to set the access and refresh-token cookies and user details
     * @return a {@link LoginResponse} containing the access token and user details
     * @throws BadCredentialsException if credentials are invalid
     */
    LoginResponse login(LoginRequest request, HttpServletResponse response);
}
