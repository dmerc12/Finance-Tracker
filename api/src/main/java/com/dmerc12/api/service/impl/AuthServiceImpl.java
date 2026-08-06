package com.dmerc12.api.service.impl;

import com.dmerc12.api.dto.LoginRequest;
import com.dmerc12.api.dto.LoginResponse;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.mapper.UserMapper;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtService;
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

/**
 * Implementation of {@link AuthService}.
 * <p>Handles token refresh logic using the injected {@link JwtService} and {@link CustomUserDetailsService}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;

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
}
