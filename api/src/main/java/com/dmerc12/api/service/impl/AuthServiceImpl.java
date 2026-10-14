package com.dmerc12.api.service.impl;

import com.dmerc12.api.dto.LoginRequest;
import com.dmerc12.api.dto.LoginResponse;
import com.dmerc12.api.dto.TokenPair;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.mapper.UserMapper;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtService;
import com.dmerc12.api.security.TokenBlacklist;
import com.dmerc12.api.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Implementation of {@link AuthService}.
 * <p>Handles login and refresh-token rotation using the injected {@link JwtService},
 * {@link CustomUserDetailsService}, and {@link TokenBlacklist}.
 * <p>Refresh-token rotation invalidates the incoming token on each use by adding
 * it to the {@link TokenBlacklist}; a consumed token presented again is rejected
 * with {@link InvalidTokenException}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final TokenBlacklist tokenBlacklist;
    private final CustomUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

    /**
     * {@inheritDoc}
     */
    @Override
    public TokenPair refreshTokens(String refreshToken, HttpServletResponse response) {
        // Validate the token is present and not expired/tampered
        if (refreshToken == null || !jwtService.validateToken(refreshToken)) {
            log.warn("Invalid or expired refresh token");
            throw new InvalidTokenException("Invalid or expired refresh token");
        }
        // Reject access tokens masquerading as refresh tokens
        if (!"refresh".equals(jwtService.extractTokenType(refreshToken))) {
            log.warn("Invalid token type for refresh: {}", jwtService.extractTokenType(refreshToken));
            throw new InvalidTokenException("Invalid token type");
        }
        // Reject tokens already consumed by a prior rotation
        if (tokenBlacklist.isBlacklisted(refreshToken)) {
            log.warn("Rejected reuse of already-consumed refresh token");
            throw new InvalidTokenException("Invalid or expired refresh token");
        }
        // Resolve the principal and issue a fresh pair of tokens
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String newAccessToken = jwtService.generateAccessToken(auth);
        String newRefreshToken = jwtService.generateRefreshToken(auth);
        // Blacklist consumed refresh tokens
        Date refreshExpiry = jwtService.extractExpiration(refreshToken);
        tokenBlacklist.blacklistToken(refreshToken, refreshExpiry);
        // Write rotated tokens back to the browser as an HTTP-only cookies
        jwtService.setAccessTokenCookie(response, newAccessToken);
        jwtService.setRefreshTokenCookie(response, newRefreshToken);
        TokenPair tokens = TokenPair.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
        log.info("Access and refresh tokens refreshed for user: {}", username);
        return tokens;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        log.debug("Login attempt for email: {}", request.getEmail());
        try {
            // Authenticate using Spring Security's AuthenticationManager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            // Load user details from DB to get the full user entity
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> {
                        log.warn("User not found after authentication for email: {}", request.getEmail());
                        return new BadCredentialsException("Invalid email or password");
                    });
            // Generate tokens
            String accessToken = jwtService.generateAccessToken(authentication);
            String refreshToken = jwtService.generateRefreshToken(authentication);
            // Set cookies (secure, httpOnly, etc.)
            jwtService.setAccessTokenCookie(response, accessToken);
            jwtService.setRefreshTokenCookie(response, refreshToken);
            // Build response
            log.info("Login successful for user: {}", user.getEmail());
            return LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .roles(userMapper.toDTO(user).getRoles())
                    .build();
        } catch (BadCredentialsException e) {
            log.warn("Login failed for email: {} - invalid credentials", request.getEmail());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during login for email: {}", request.getEmail(), e);
            throw e;
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void logout(TokenPair tokens, HttpServletResponse response) {
        // Blacklist each token only if it's still valid.
        // An expired token is already dead.
        // Calling extractExpiration on it would throw because the JWT parser rejects expired claims.
        if (tokens.getAccessToken() != null && jwtService.validateToken(tokens.getAccessToken())) {
            Date expiry = jwtService.extractExpiration(tokens.getAccessToken());
            tokenBlacklist.blacklistToken(tokens.getAccessToken(), expiry);
            log.debug("Access token blacklisted on logout");
        }
        if (tokens.getRefreshToken() != null && jwtService.validateToken(tokens.getRefreshToken())) {
            Date expiry = jwtService.extractExpiration(tokens.getRefreshToken());
            tokenBlacklist.blacklistToken(tokens.getRefreshToken(), expiry);
            log.debug("Refresh token blacklisted on logout");
        }
        // Always clear cookies, even if neither token was valid.
        // This makes the endpoint idempotent and safe to call from any auth state.
        jwtService.clearCookies(response);
        log.info("User logged out");
    }
}
