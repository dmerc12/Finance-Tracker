package com.dmerc12.api.security;

import com.dmerc12.api.config.SecurityConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

/**
 * Filter that intercepts every request to validate JWT tokens.
 * <p>It extracts the token from either the {@code Authorization} header (Bearer scheme)
 * or from the {@code access_token} cookie. If the token is valid, not blacklisted, and is an access token,
 * it loads the user details and sets the authentication in the {@link SecurityContextHolder}.
 * <p>This filter is registered in {@link SecurityConfig} and executed before
 * {@link UsernamePasswordAuthenticationFilter}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final TokenBlacklist tokenBlacklist;

    /**
     * Core filtering method.
     *
     * @param request the HTTP request
     * @param response the HTTP response
     * @param filterChain the filter chain
     * @throws ServletException if an error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null) {
            log.debug("Token extracted: {}", token.substring(0, Math.min(token.length(), 10)) + "...");
            if (jwtService.validateToken(token) && !tokenBlacklist.isBlacklisted(token)) {
                String username = jwtService.extractUsername(token);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Only access tokens are used for authentication; refresh tokens are ignored.
                    if ("access".equals(jwtService.extractTokenType(token))) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        log.debug("Authentication set for user: {}", username);
                    } else {
                        log.debug("Refresh token ignored for authentication");
                    }
                } else if (username == null) {
                    log.warn("Failed to extract username from token");
                }
            } else {
                log.warn("Token invalid or blacklisted");
            }
        }
        filterChain.doFilter(request, response);
    }

    /**
     * Extracts the JWT from the request.
     * <p>First checks the {@code Authorization} header (Bearer), then falls back to the {@code access_token} cookie.
     *
     * @param request the HTTP request
     * @return the token string, or {@code null} if none is found
     */
    private String extractToken(HttpServletRequest request) {
        // 1. Try from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        // 2. Try from Cookie
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(c -> "access_token".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }
}
