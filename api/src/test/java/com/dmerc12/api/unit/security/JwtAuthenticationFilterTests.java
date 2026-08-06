package com.dmerc12.api.unit.security;

import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtAuthenticationFilter;
import com.dmerc12.api.security.JwtService;
import com.dmerc12.api.security.TokenBlacklist;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link JwtAuthenticationFilter}.
 * <p>Verifies that the filter correctly extracts, validates, and sets authentication
 * for valid tokens, and ignores invalid, blacklisted, or refresh tokens.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("JWT Authentication Filter Unit Tests")
public class JwtAuthenticationFilterTests {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private TokenBlacklist tokenBlacklist;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @BeforeEach
    public void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Valid access token from header sets authentication")
    public void validAccessTokenFromHeader() throws Exception {
        String token = "valid.token";
        String username = "test";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn(username);
        when(jwtService.extractTokenType(token)).thenReturn("access");
        when(tokenBlacklist.isBlacklisted(token)).thenReturn(false);
        UserDetails userDetails = User.withUsername(username).password("pass").roles("USER").build();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo(username);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Valid token from cookie sets authentication")
    public void validTokenFromCookie() throws Exception {
        String token = "valid.token";
        String username = "test";
        Cookie cookie = new Cookie("access_token", token);
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn(username);
        when(jwtService.extractTokenType(token)).thenReturn("access");
        when(tokenBlacklist.isBlacklisted(token)).thenReturn(false);
        UserDetails userDetails = User.withUsername(username).password("pass").roles("USER").build();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo(username);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Invalid token does not sets authentication")
    public void invalidToken() throws Exception {
        String token = "invalid";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateToken(token)).thenReturn(false);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Blacklisted token does not sets authentication")
    public void blacklistedToken() throws Exception {
        String token = "blacklisted";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateToken(token)).thenReturn(true);
        when(tokenBlacklist.isBlacklisted(token)).thenReturn(true);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Refresh token ignored for authentication")
    public void refreshTokenIgnored() throws Exception {
        String token = "refresh.token";
        String username = "test";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn(username);
        when(jwtService.extractTokenType(token)).thenReturn("refresh");
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Username is null - skip authentication")
    public void usernameNull() throws Exception {
        String token = "valid.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn(null);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @SuppressWarnings("ConstantConditions")
    @DisplayName("Authentication already present - skip setting again")
    public void authenticationAlreadyPresent() throws Exception {
        UsernamePasswordAuthenticationToken existingAuth =
                new UsernamePasswordAuthenticationToken("existing", null, null);
        SecurityContextHolder.getContext().setAuthentication(existingAuth);
        String token = "valid.token";
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn("test");
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isSameAs(existingAuth);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("No Authorization header and no cookies - extractToken returns null")
    public void noHeaderAndNoCookies() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);
        when(request.getCookies()).thenReturn(null);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Authorization header not Bearer, cookies present - token extracted from cookie")
    public void authHeaderNotBearerButCookiePresent() throws Exception {
        String token = "valid.token";
        String username = "test";
        when(request.getHeader("Authorization")).thenReturn("Basic some-credentials");
        Cookie cookie = new Cookie("access_token", token);
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        when(jwtService.validateToken(token)).thenReturn(true);
        when(jwtService.extractUsername(token)).thenReturn(username);
        when(jwtService.extractTokenType(token)).thenReturn("access");
        when(tokenBlacklist.isBlacklisted(token)).thenReturn(false);
        UserDetails userDetails = User.withUsername(username).password("pass").roles("USER").build();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo(username);
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Authorization header not Bearer, cookies null - extractToken returns null")
    public void authHeaderNotBearerAndCookiesNull() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Basic some-credentials");
        when(request.getCookies()).thenReturn(null);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Cookies present but no access_token cookie - extractToken returns null")
    public void cookiesPresentButNoAccessToken() throws Exception {
        Cookie otherCookie = new Cookie("other", "value");
        when(request.getCookies()).thenReturn(new Cookie[]{otherCookie});
        when(request.getHeader("Authorization")).thenReturn(null);
        filter.doFilter(request, response, filterChain);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }
}
