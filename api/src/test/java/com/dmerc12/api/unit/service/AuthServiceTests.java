package com.dmerc12.api.unit.service;

import com.dmerc12.api.dto.LoginRequest;
import com.dmerc12.api.dto.LoginResponse;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.entity.Role;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.mapper.UserMapper;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.security.CustomUserDetailsService;
import com.dmerc12.api.security.JwtService;
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

import java.util.Optional;
import java.util.Set;

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
    private UserMapper mapper;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

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
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(username).password("pass").roles("USER").build();
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
            verify(jwtService, times(2)).extractTokenType(refreshToken);
            verifyNoMoreInteractions(jwtService, userDetailsService);
        }
    }

    @Nested
    @DisplayName("Login Tests")
    class LoginTests {

        @Test
        @DisplayName("Login success returns token and user info")
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
}
