package com.dmerc12.api.unit.security;

import com.dmerc12.api.config.JwtProperties;
import com.dmerc12.api.security.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link JwtService}.
 * <p>Verifies token generation, validation, claim extraction, and cookie handling.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("JWT Service Unit Tests")
public class JwtServiceTests {

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JwtService jwtService;

    private final String testSecret = "c2VjcmV0S2V5Rm9ySlNXVGVzdGluZ1NlY3JldEtleUZvckpTV1Rlc3Rpbmc=";

    private final long accessExpiry = 60000;

    @BeforeEach
    public void setup() {
        lenient().when(jwtProperties.getSecret()).thenReturn(testSecret);
        lenient().when(jwtProperties.getExpiration()).thenReturn(accessExpiry);
    }

    @Test
    @DisplayName("Generate access token")
    public void generateAccessToken() {
        when(authentication.getName()).thenReturn("test");
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_USER"))).when(authentication).getAuthorities();
        String token = jwtService.generateAccessToken(authentication);
        assertThat(token).isNotBlank();
        assertThat(jwtService.validateToken(token)).isTrue();
        assertThat(jwtService.extractUsername(token)).isEqualTo("test");
        assertThat(jwtService.extractTokenType(token)).isEqualTo("access");
        assertThat(jwtService.isTokenExpired(token)).isFalse();
    }

    @Test
    @DisplayName("Generate refresh token")
    public void generateRefreshToken() {
        when(authentication.getName()).thenReturn("test");
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_USER"))).when(authentication).getAuthorities();
        String token = jwtService.generateRefreshToken(authentication);
        assertThat(token).isNotBlank();
        assertThat(jwtService.validateToken(token)).isTrue();
        assertThat(jwtService.extractUsername(token)).isEqualTo("test");
        assertThat(jwtService.extractTokenType(token)).isEqualTo("refresh");
        assertThat(jwtService.isTokenExpired(token)).isFalse();
    }

    @Nested
    @DisplayName("Validate token")
    class ValidateTokenTests {
        @Test
        @DisplayName("Invalid token returns false")
        public void invalidTokenReturnsFalse() {
            assertThat(jwtService.validateToken("invalid.token")).isFalse();
        }

        @Test
        @DisplayName("Expired token returns false")
        public void expiredTokenReturnsFalse() {
            String token = Jwts.builder()
                    .subject("test")
                    .issuedAt(new Date(System.currentTimeMillis() - 10000))
                    .expiration(new Date(System.currentTimeMillis() - 5000))
                    .signWith(Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(testSecret)))
                    .compact();
            assertThat(jwtService.validateToken(token)).isFalse();
            assertThat(jwtService.isTokenExpired(token)).isTrue();
        }

        @Test
        @DisplayName("Valid token returns true")
        public void validTokenReturnsTrue() {
            String token = Jwts.builder()
                    .subject("test")
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis() + 5000))
                    .signWith(Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(testSecret)))
                    .compact();
            assertThat(jwtService.validateToken(token)).isTrue();
            assertThat(jwtService.isTokenExpired(token)).isFalse();
        }
    }

    @Test
    @DisplayName("Set access token cookie")
    public void setAccessTokenCookie() {
        MockHttpServletResponse response = new MockHttpServletResponse();
        String token = "test.token";
        jwtService.setAccessTokenCookie(response, token);
        Cookie cookie = response.getCookie("access_token");
        assertThat(cookie).isNotNull();
        assertThat(cookie.getValue()).isEqualTo(token);
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getSecure()).isTrue();
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.getMaxAge()).isEqualTo((int) (accessExpiry / 1000));
        assertThat(cookie.getAttribute("SameSite")).isEqualTo("Strict");
    }

    @Test
    @DisplayName("Set refresh token cookie")
    public void setRefreshTokenCookie() {
        MockHttpServletResponse response = new MockHttpServletResponse();
        String token = "test.refresh.token";
        jwtService.setRefreshTokenCookie(response, token);
        Cookie cookie = response.getCookie("refresh_token");
        assertThat(cookie).isNotNull();
        assertThat(cookie.getValue()).isEqualTo(token);
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getSecure()).isTrue();
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.getMaxAge()).isEqualTo((int) ((accessExpiry * 7) / 1000));
        assertThat(cookie.getAttribute("SameSite")).isEqualTo("Strict");
    }

    @Test
    @DisplayName("Clear cookies")
    public void clearCookies() {
        MockHttpServletResponse response = new MockHttpServletResponse();
        jwtService.clearCookies(response);
        Cookie accessCookie = response.getCookie("access_token");
        assertThat(accessCookie).isNotNull();
        assertThat(accessCookie.getMaxAge()).isZero();
        Cookie refreshCookie = response.getCookie("refresh_token");
        assertThat(refreshCookie).isNotNull();
        assertThat(refreshCookie.getMaxAge()).isZero();
    }

    @Test
    @DisplayName("Extract username from token")
    public void extractUsername() {
        when(authentication.getName()).thenReturn("test");
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_USER"))).when(authentication).getAuthorities();
        String token = jwtService.generateAccessToken(authentication);
        assertThat(jwtService.extractUsername(token)).isEqualTo("test");
    }
}
