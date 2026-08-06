package com.dmerc12.api.unit.service;

import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtService;
import com.dmerc12.api.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthServiceImpl}.
 * <p>Verifies refresh token logic - success, null token, invalid token, wrong token type.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Auth Service Unit Tests")
public class AuthServiceTests {

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Nested
    @DisplayName("Refresh Token Tests")
    class RefreshTokenTests {

        @Test
        @DisplayName("Success")
        public void success() {
            String refreshToken = "valid.refresh.token";
            String username = "test";
            String newAccessToken = "new.access.token";
            when(jwtService.validateToken(refreshToken)).thenReturn(true);
            when(jwtService.extractTokenType(refreshToken)).thenReturn("refresh");
            when(jwtService.extractUsername(refreshToken)).thenReturn(username);
            UserDetails userDetails = User.withUsername(username).password("pass").roles("USER").build();
            when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
            when(jwtService.generateAccessToken(any(Authentication.class))).thenReturn(newAccessToken);
            String result = authService.refreshAccessToken(refreshToken);
            assertThat(result).isEqualTo(newAccessToken);
            verify(jwtService).validateToken(refreshToken);
            verify(jwtService).extractTokenType(refreshToken);
            verify(jwtService).extractUsername(refreshToken);
            verify(userDetailsService).loadUserByUsername(username);
            verify(jwtService).generateAccessToken(any(Authentication.class));
        }

        @Test
        @DisplayName("Refresh token fails when token is null")
        public void refreshTokenNull() {
            assertThatThrownBy(() -> authService.refreshAccessToken(null))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid or expired refresh token");
            verifyNoInteractions(jwtService, userDetailsService);
        }

        @Test
        @DisplayName("Refresh token fails when token is invalid")
        public void refreshTokenInvalid() {
            String refreshToken = "invalid.token";
            assertThatThrownBy(() -> authService.refreshAccessToken(refreshToken))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid or expired refresh token");
            verify(jwtService).validateToken(refreshToken);
            verifyNoMoreInteractions(jwtService, userDetailsService);
        }

        @Test
        @DisplayName("Refresh token fails when token type is not 'refresh'")
        public void refreshTokenWrongType() {
            String refreshToken = "valid.token";
            when(jwtService.validateToken(refreshToken)).thenReturn(true);
            when(jwtService.extractTokenType(refreshToken)).thenReturn("access");
            assertThatThrownBy(() -> authService.refreshAccessToken(refreshToken))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessageContaining("Invalid token type");
            verify(jwtService).validateToken(refreshToken);
            verify(jwtService).extractTokenType(refreshToken);
            verifyNoMoreInteractions(jwtService, userDetailsService);
        }
    }
}
