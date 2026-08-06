package com.dmerc12.api.security;

import com.dmerc12.api.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * Service for handling JSON Web Token (JWT) operations.
 * <p>This service provides methods for:
 * <ul>
 *     <li>Generating access and refresh tokens from an {@link Authentication} object</li>
 *     <li>Validating tokens and extracting claims (username, expiration, token type)</li>
 *     <li>Setting and clearing secure HTTP-only cookies for token storage</li>
 * </ul>
 * <p>The implementation uses the JJWT library and is configured with properties from {@link JwtProperties}.
 * <p><b>Security Note:</b> The secret key must be at least 256 bits (32 bytes) and should be
 * stored securely (e.g., environment variables). In production, ensure {@code secure} is {@code true}
 * for cookies and use HTTPS.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    private static final String TOKEN_TYPE_ACCESS = "access";
    private static final String TOKEN_TYPE_REFRESH = "refresh";

    /**
     * Generates a short-lived access token for the authenticated user.
     *
     * @param authentication the Spring Security authentication object containing user details
     * @return a signed JWT access token
     */
    public String generateAccessToken(Authentication authentication) {
        log.debug("Generating access token for user: {}", authentication.getName());
        return generateToken(authentication, jwtProperties.getExpiration(), TOKEN_TYPE_ACCESS);
    }

    /**
     * Generates a long-lived refresh token for the authenticated user.
     * <p>The refresh token is used to obtain new access tokens without re-authenticating.
     * Expiry is set to 7 times the access token expiration (configurable via {@link JwtProperties#getExpiration()}).
     *
     * @param authentication the Spring Security authentication object containing user details
     * @return a signed JWT refresh token
     */
    public String generateRefreshToken(Authentication authentication) {
        log.debug("Generating refresh token for user: {}", authentication.getName());
        long refreshExpiry = jwtProperties.getExpiration() * 7L;
        return generateToken(authentication, refreshExpiry, TOKEN_TYPE_REFRESH);
    }

    /**
     * Core token generation method.
     *
     * @param authentication the authentication object
     * @param expiryMs token lifetime in milliseconds
     * @param tokenType either {@code "access"} or {@code "refresh"}
     * @return the generated JWT
     */
    private String generateToken(Authentication authentication, long expiryMs, String tokenType) {
        String username = authentication.getName();
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);
        String token = Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("type", tokenType)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
        log.debug("Generated {} token for user: {}, expires: {}", tokenType, username, expiry);
        return token;
    }

    /**
     * Validates a JWT token.
     * <p>Checks the signature and expiration; does not check blacklist.
     *
     * @param token the JWT string
     * @return {@code true} if the token is well-formed, has a valid signature, and is not expired
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            log.debug("Token validated successfully");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extracts the username (subject) from the token.
     *
     * @param token the JWT string
     * @return the username stored in the subject claim
     */
    public String extractUsername(String token) {
        try {
            String username = getClaims(token).getSubject();
            log.debug("Extracted username: {}", username);
            return username;
        } catch (JwtException e) {
            log.warn("Failed to extract username: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Extracts the expiration date from the token.
     *
     * @param token the JWT string
     * @return the expiration {@link Date}
     */
    public Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    /**
     * Checks whether the token has expired.
     *
     * @param token the JWT string
     * @return {@code true} if the token's expiration is before the current time
     */
    public boolean isTokenExpired(String token) {
        try {
            boolean expired = extractExpiration(token).before(new Date());
            if (expired) {
                log.debug("Token is expired");
            }
            return expired;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Token expired check failed: {}", e.getMessage());
            return true;
        }
    }

    /**
     * Extracts the token type claim ({@code "access"} or {@code "refresh"}).
     *
     * @param token the JWT string
     * @return the token type
     */
    public String extractTokenType(String token) {
        try {
            String type = getClaims(token).get("type", String.class);
            log.debug("Extracted token type: {}", type);
            return type;
        } catch (JwtException e) {
            log.warn("Failed to extract token type: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Retrieves all claims from the token.
     *
     * @param token the JWT string
     * @return the {@link Claims} object
     * @throws JwtException if the token is invalid
     */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Creates the signing key from the configured secret.
     * <p>The secret is expected to be Base64-encoded.
     *
     * @return the {@link SecretKey} used for HMAC-SHA signing
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = java.util.Base64.getDecoder().decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ==================== Cookie Management ====================

    /**
     * Sets the access token in an HTTP-only, secure cookie.
     *
     * @param response the HTTP response
     * @param token the access token string
     */
    public void setAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtProperties.getExpiration() / 1000));
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
        log.debug("Access token cookie set");
    }

    /**
     * Sets the refresh token in an HTTP-only, secure cookie.
     * <p>Expiry is 7 times the access token expiration.
     *
     * @param response the HTTP response
     * @param token the refresh token string
     */
    public void setRefreshTokenCookie(HttpServletResponse response, String token) {
        long refreshExpiry = jwtProperties.getExpiration() * 7L;
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) (refreshExpiry / 1000));
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
        log.debug("Refresh token cookie set");
    }

    /**
     * Clears both access and refresh cookies by setting their max age to 0.
     *
     * @param response the HTTP response
     */
    public void clearCookies(HttpServletResponse response) {
        Cookie accessCookie = new Cookie("access_token", null);
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        response.addCookie(accessCookie);
        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        response.addCookie(refreshCookie);
        log.debug("Cookies cleared");
    }
}
