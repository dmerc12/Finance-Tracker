package com.dmerc12.api.unit.service;

import com.dmerc12.api.dto.LoginRequest;
import com.dmerc12.api.dto.LoginResponse;
import com.dmerc12.api.dto.TokenPair;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.entity.Role;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.mapper.UserMapper;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtService;
import com.dmerc12.api.security.TokenBlacklist;
import com.dmerc12.api.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthServiceImpl}.
 * <p>Verifies refresh-token rotation, blacklisting of consumed tokens, and
 * auth flows.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Auth Service Unit Tests")
public class AuthServiceTests {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserMapper mapper;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TokenBlacklist tokenBlacklist;

    @InjectMocks
    private AuthServiceImpl authService;

    @Nested
    @DisplayName("Refresh Token Tests")
    class RefreshTokenTests {

        @Test
        @DisplayName("Success returns both rotated tokens and sets both cookies")
        public void success() {
            String refreshToken = "valid.refresh.token";
            String username = "test";
            String newAccessToken = "new.access.token";
            String newRefreshToken = "new.refresh.token";
            Date refreshExpiry = new Date(System.currentTimeMillis() + 600_000L);
            when(jwtService.validateToken(refreshToken)).thenReturn(true);
            when(jwtService.extractTokenType(refreshToken)).thenReturn("refresh");
            when(tokenBlacklist.isBlacklisted(refreshToken)).thenReturn(false);
            when(jwtService.extractUsername(refreshToken)).thenReturn(username);
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(username).password("pass").roles("USER").build();
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(jwtService.generateAccessToken(any(Authentication.class))).thenReturn(newAccessToken);
            when(jwtService.generateRefreshToken(any(Authentication.class))).thenReturn(newRefreshToken);
            when(jwtService.extractExpiration(refreshToken)).thenReturn(refreshExpiry);
            HttpServletResponse response = mock(HttpServletResponse.class);
            TokenPair result = authService.refreshTokens(refreshToken, response);
            assertThat(result.getAccessToken()).isEqualTo(newAccessToken);
            assertThat(result.getRefreshToken()).isEqualTo(newRefreshToken);
            verify(jwtService).validateToken(refreshToken);
            verify(jwtService).extractTokenType(refreshToken);
            verify(tokenBlacklist).isBlacklisted(refreshToken);
            verify(jwtService).extractUsername(refreshToken);
            verify(userDetailsService).loadUserByUsername(username);
            verify(jwtService).generateAccessToken(any(Authentication.class));
            verify(jwtService).generateRefreshToken(any(Authentication.class));
            verify(jwtService).extractExpiration(refreshToken);
            verify(tokenBlacklist).blacklistToken(refreshToken, refreshExpiry);
            verify(jwtService).setAccessTokenCookie(response, newAccessToken);
            verify(jwtService).setRefreshTokenCookie(response, newRefreshToken);
        }

        @Test
        @DisplayName("Rejects a refresh token that has already been consumed")
        public void refreshTokenBlacklisted() {
            String refreshToken = "consumed.token";
            HttpServletResponse response = mock(HttpServletResponse.class);
            when(jwtService.validateToken(refreshToken)).thenReturn(true);
            when(jwtService.extractTokenType(refreshToken)).thenReturn("refresh");
            when(tokenBlacklist.isBlacklisted(refreshToken)).thenReturn(true);
            assertThatThrownBy(() -> authService.refreshTokens(refreshToken, response))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid or expired refresh token");
            verify(jwtService).validateToken(refreshToken);
            verify(jwtService).extractTokenType(refreshToken);
            verify(tokenBlacklist).isBlacklisted(refreshToken);
            verifyNoMoreInteractions(jwtService);
            verifyNoInteractions(userDetailsService);
            verify(tokenBlacklist, never()).blacklistToken(any(), any());
        }

        @Test
        @DisplayName("Refresh token fails when token is null")
        public void refreshTokenNull() {
            HttpServletResponse response = mock(HttpServletResponse.class);
            assertThatThrownBy(() -> authService.refreshTokens(null, response))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid or expired refresh token");
            verifyNoInteractions(jwtService, userDetailsService, tokenBlacklist);
        }

        @Test
        @DisplayName("Refresh token fails when token is invalid")
        public void refreshTokenInvalid() {
            String refreshToken = "invalid.token";
            HttpServletResponse response = mock(HttpServletResponse.class);
            assertThatThrownBy(() -> authService.refreshTokens(refreshToken, response))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid or expired refresh token");
            verify(jwtService).validateToken(refreshToken);
            verifyNoMoreInteractions(jwtService, userDetailsService);
            verifyNoInteractions(tokenBlacklist);
        }

        @Test
        @DisplayName("Refresh token fails when token type is not 'refresh'")
        public void refreshTokenWrongType() {
            String refreshToken = "valid.token";
            HttpServletResponse response = mock(HttpServletResponse.class);
            when(jwtService.validateToken(refreshToken)).thenReturn(true);
            when(jwtService.extractTokenType(refreshToken)).thenReturn("access");
            assertThatThrownBy(() -> authService.refreshTokens(refreshToken, response))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid token type");
            verify(jwtService).validateToken(refreshToken);
            verify(jwtService, times(2)).extractTokenType(refreshToken);
            verifyNoMoreInteractions(jwtService, userDetailsService);
            verifyNoInteractions(tokenBlacklist);
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Login success returns tokens and user info")
        public void loginSuccess() {
            LoginRequest request = new LoginRequest("test@example.com", "Password123!");
            Authentication auth = mock(Authentication.class);
            User user = User.builder()
                    .email("test@example.com")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of(Role.ROLE_USER))
                    .build();
            String accessToken = "access.token";
            String refreshToken = "refresh.token";
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(auth);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
            when(jwtService.generateAccessToken(auth)).thenReturn(accessToken);
            when(jwtService.generateRefreshToken(auth)).thenReturn(refreshToken);
            UserDTO userDTO = UserDTO.builder()
                    .email("test@example.com")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of("ROLE_USER"))
                    .build();
            when(mapper.toDTO(user)).thenReturn(userDTO);
            HttpServletResponse response = mock(HttpServletResponse.class);
            LoginResponse result = authService.login(request, response);
            assertThat(result.getAccessToken()).isEqualTo(accessToken);
            assertThat(result.getRefreshToken()).isEqualTo(refreshToken);
            assertThat(result.getEmail()).isEqualTo("test@example.com");
            assertThat(result.getFirstName()).isEqualTo("John");
            assertThat(result.getLastName()).isEqualTo("Doe");
            assertThat(result.getRoles()).contains("ROLE_USER");
            verify(authenticationManager).authenticate(any());
            verify(userRepository).findByEmail("test@example.com");
            verify(jwtService).generateAccessToken(auth);
            verify(jwtService).generateRefreshToken(auth);
            verify(mapper).toDTO(user);
        }

        @Test
        @DisplayName("Login fails with invalid credentials")
        public void loginInvalidCredentials() {
            LoginRequest request = new LoginRequest("test@example.com", "Password123!");
            HttpServletResponse response = mock(HttpServletResponse.class);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new BadCredentialsException("Invalid credentials"));
            assertThatThrownBy(() -> authService.login(request, response))
                    .isInstanceOf(BadCredentialsException.class)
                    .hasMessageContaining("Invalid credentials");
            verify(authenticationManager).authenticate(any());
            verifyNoInteractions(userRepository, jwtService);
        }

        @Test
        @DisplayName("Login fails when user not found after authentication")
        public void loginUserNotFound() {
            LoginRequest request = new LoginRequest("test@example.com", "Password123!");
            Authentication auth = mock(Authentication.class);
            HttpServletResponse response = mock(HttpServletResponse.class);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(auth);
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
            assertThatThrownBy(() -> authService.login(request, response))
                    .isInstanceOf(BadCredentialsException.class)
                    .hasMessageContaining("Invalid email or password");
            verify(authenticationManager).authenticate(any());
            verify(userRepository).findByEmail("test@example.com");
            verifyNoInteractions(jwtService);
        }

        @Test
        @DisplayName("Login throws generic exception and logs error")
        public void loginGenericException() {
            LoginRequest request = new LoginRequest("test@example.com", "Password123!");
            HttpServletResponse response = mock(HttpServletResponse.class);
            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new RuntimeException("Database connection failed"));
            assertThatThrownBy(() -> authService.login(request, response))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Database connection failed");
            verify(authenticationManager).authenticate(any());
            verifyNoInteractions(userRepository, jwtService, mapper);
        }
    }

    @Nested
    @DisplayName("Logout Tests")
    class LogoutTests {
        @Test
        @DisplayName("Blacklists both valid tokens and clears cookies")
        public void success() {
            String accessToken = "valid.access.token";
            String refreshToken = "valid.refresh.token";
            Date accessExpiry = new Date(System.currentTimeMillis() + 60_000L);
            Date refreshExpiry = new Date(System.currentTimeMillis() + 600_000L);
            when(jwtService.validateToken(accessToken)).thenReturn(true);
            when(jwtService.validateToken(refreshToken)).thenReturn(true);
            when(jwtService.extractExpiration(accessToken)).thenReturn(accessExpiry);
            when(jwtService.extractExpiration(refreshToken)).thenReturn(refreshExpiry);
            HttpServletResponse response = mock(HttpServletResponse.class);
            TokenPair tokens = TokenPair.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
            authService.logout(tokens, response);
            verify(tokenBlacklist).blacklistToken(accessToken, accessExpiry);
            verify(tokenBlacklist).blacklistToken(refreshToken, refreshExpiry);
            verify(jwtService).clearCookies(response);
        }

        @Test
        @DisplayName("Clears cookies even when no tokens are present")
        public void nullTokens() {
            HttpServletResponse response = mock(HttpServletResponse.class);
            TokenPair tokens = TokenPair.builder().build();
            authService.logout(tokens, response);
            verify(jwtService, never()).validateToken(any());
            verify(jwtService, never()).extractExpiration(any());
            verify(jwtService).clearCookies(response);
        }

        @Test
        @DisplayName("Skips blacklisting for expired tokens but still clears cookies")
        public void expiredTokens() {
            String expiredAccess = "expired.access.token";
            String expiredRefresh = "expired.refresh.token";
            when(jwtService.validateToken(expiredAccess)).thenReturn(false);
            when(jwtService.validateToken(expiredRefresh)).thenReturn(false);
            HttpServletResponse response = mock(HttpServletResponse.class);
            TokenPair tokens = TokenPair.builder()
                    .accessToken(expiredAccess)
                    .refreshToken(expiredRefresh)
                    .build();
            authService.logout(tokens, response);
            verify(tokenBlacklist, never()).blacklistToken(any(), any());
            verify(jwtService, never()).extractExpiration(any());
            verify(jwtService).clearCookies(response);
        }

        @Test
        @DisplayName("Blacklists only the valid token when the other is expired")
        public void mixedValidity() {
            String accessToken = "valid.access.token";
            String refreshToken = "valid.refresh.token";
            Date accessExpiry = new Date(System.currentTimeMillis() + 60_000L);
            when(jwtService.validateToken(accessToken)).thenReturn(true);
            when(jwtService.validateToken(refreshToken)).thenReturn(false);
            when(jwtService.extractExpiration(accessToken)).thenReturn(accessExpiry);
            HttpServletResponse response = mock(HttpServletResponse.class);
            TokenPair tokens = TokenPair.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
            authService.logout(tokens, response);
            verify(tokenBlacklist, times(1)).blacklistToken(any(), any());
            verify(tokenBlacklist).blacklistToken(accessToken, accessExpiry);
            verify(jwtService, times(1)).extractExpiration(any());
            verify(jwtService).clearCookies(response);
        }
    }
}
