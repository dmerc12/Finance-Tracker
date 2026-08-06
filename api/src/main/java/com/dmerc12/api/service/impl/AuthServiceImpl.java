package com.dmerc12.api.service.impl;

import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtService;
import com.dmerc12.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * Implementation of {@link AuthService}.
 * <p>Handles token refresh logic using the injected {@link JwtService} and {@link CustomUserDetailsService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    /**
     * {@inheritDoc}
     */
    @Override
    public String refreshAccessToken(String refreshToken) {
        if (refreshToken == null || !jwtService.validateToken(refreshToken)) {
            log.warn("Invalid or expired refresh token");
            throw new InvalidTokenException("Invalid or expired refresh token");
        }
        if (!"refresh".equals(jwtService.extractTokenType(refreshToken))) {
            log.warn("Invalid token type for refresh: {}", jwtService.extractTokenType(refreshToken));
            throw new InvalidTokenException("Invalid token type");
        }
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String newAccessToken = jwtService.generateAccessToken(auth);
        log.info("Access token refreshed for user: {}", username);
        return newAccessToken;
    }
}
