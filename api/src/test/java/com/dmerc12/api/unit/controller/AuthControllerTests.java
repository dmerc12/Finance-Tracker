package com.dmerc12.api.unit.controller;

import com.dmerc12.api.controller.AuthController;
import com.dmerc12.api.dto.*;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.exception.RateLimitExceededException;
import com.dmerc12.api.security.SecurityService;
import com.dmerc12.api.service.AuthService;
import com.dmerc12.api.service.RateLimitService;
import com.dmerc12.api.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthController}.
 * <p>Verifies the logic of authentication endpoints without loading Spring context.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Auth Controller Unit Tests")
public class AuthControllerTests {

    @Mock
    private AuthService authService;

    @Mock
    private UserService userService;

    @Mock
    private SecurityService securityService;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest request;

    @Mock
    private RateLimitService rateLimitService;

    @InjectMocks
    private AuthController authController;

    private static final String TEST_EMAIL = "test@example.com";

    @Nested
    @DisplayName("GET /api/auth/csrf")
    class CsrfTests {
        @Test
        @DisplayName("Returns 200 OK with a success envelope")
        public void success() {
            ResponseEntity<ResponseDTO<Void>> response = authController.csrf();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("CSRF cookie established");
        }
    }

    @Nested
    @DisplayName("GET /api/auth/me")
    class MeTests {

        @Test
        @DisplayName("Returns 200 OK with the authenticated user's profile")
        public void success() {
            UserDTO userDTO = UserDTO.builder()
                    .id(1L)
                    .email(TEST_EMAIL)
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of("ROLE_USER"))
                    .build();
            when(securityService.getCurrentUserId(authentication)).thenReturn(1L);
            when(userService.getUser(1L)).thenReturn(userDTO);
            ResponseEntity<ResponseDTO<UserDTO>> response = authController.me(authentication);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Authenticated user");
            assertThat(response.getBody().getData()).isEqualTo(userDTO);
            verify(securityService).getCurrentUserId(authentication);
            verify(userService).getUser(1L);
        }

        @Test
        @DisplayName("Propagates AccessDeniedException when the principal cannot be resolved")
        public void unauthenticated() {
            when(securityService.getCurrentUserId(authentication))
                    .thenThrow(new AccessDeniedException("Not authenticated"));
            assertThatThrownBy(() -> authController.me(authentication))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Not authenticated");
            verify(userService, never()).getUser(anyLong());
        }
    }

    @Nested
    @DisplayName("POST /api/auth/register")
    class RegisterTests {

        @Test
        @DisplayName("Returns 201 Created with user data on successful registration")
        public void success() {
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(TEST_EMAIL);
            registerRequest.setPassword("Password123!");
            registerRequest.setPasswordConfirm("Password123!");
            registerRequest.setFirstName("John");
            registerRequest.setLastName("Doe");
            UserDTO userDTO = UserDTO.builder()
                    .id(1L)
                    .email(TEST_EMAIL)
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            when(userService.registerUser(any(RegisterRequest.class))).thenReturn(userDTO);
            ResponseEntity<ResponseDTO<UserDTO>> response = authController.registerUser(registerRequest, request);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("User registered successfully");
            assertThat(response.getBody().getData()).isEqualTo(userDTO);
            verify(rateLimitService).checkRegister(any(String.class));
            verify(userService).registerUser(registerRequest);
        }

        @Test
        @DisplayName("Propagates RateLimitExceededException without calling UserService")
        public void rateLimitExceeded() {
            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(TEST_EMAIL);
            registerRequest.setPassword("Password123!");
            registerRequest.setPasswordConfirm("Password123!");
            registerRequest.setFirstName("John");
            registerRequest.setLastName("Doe");
            doThrow(new RateLimitExceededException("Too many attempts", 60L))
                    .when(rateLimitService).checkRegister(any(String.class));
            assertThatThrownBy(() -> authController.registerUser(registerRequest, request))
                    .isInstanceOf(RateLimitExceededException.class);
            verifyNoInteractions(userService);
        }

        @Nested
        @DisplayName("client IP resolution")
        class ExtractClientIpTests {

            private RegisterRequest buildRegisterRequest() {
                RegisterRequest r = new RegisterRequest();
                r.setEmail("test@example.com");
                r.setPassword("Password123!");
                r.setPasswordConfirm("Password123!");
                r.setFirstName("John");
                r.setLastName("Doe");
                return r;
            }

            @Test
            @DisplayName("Uses the first entry of X-Forwarded-For when the header is present")
            public void usesFirstForwardedForEntry() {
                RegisterRequest req = buildRegisterRequest();
                UserDTO userDTO = UserDTO.builder().id(1L).email(TEST_EMAIL).build();
                when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.5, 198.51.100.7");
                when(userService.registerUser(any(RegisterRequest.class))).thenReturn(userDTO);
                authController.registerUser(req, request);
                verify(rateLimitService).checkRegister("203.0.113.5");
            }

            @Test
            @DisplayName("Falls back to getRemoteAddr when X-Forwarded-For is absent")
            public void fallsBackToRemoteAddr() {
                RegisterRequest req = buildRegisterRequest();
                UserDTO userDTO = UserDTO.builder().id(1L).email(TEST_EMAIL).build();
                when(request.getHeader("X-Forwarded-For")).thenReturn(null);
                when(request.getRemoteAddr()).thenReturn("192.0.2.1");
                when(userService.registerUser(any(RegisterRequest.class))).thenReturn(userDTO);
                authController.registerUser(req, request);
                verify(rateLimitService).checkRegister("192.0.2.1");
            }

            @Test
            @DisplayName("Falls back to getRemoteAddr when X-Forwarded-For is blank")
            public void fallsBackWhenForwardedForIsBlank() {
                RegisterRequest req = buildRegisterRequest();
                UserDTO userDTO = UserDTO.builder().id(1L).email(TEST_EMAIL).build();
                when(request.getHeader("X-Forwarded-For")).thenReturn("  ");
                when(request.getRemoteAddr()).thenReturn("192.0.2.2");
                when(userService.registerUser(any(RegisterRequest.class))).thenReturn(userDTO);
                authController.registerUser(req, request);
                verify(rateLimitService).checkRegister("192.0.2.2");
            }

            @Test
            @DisplayName("Returns 'unknown' when neither source provides a value")
            public void returnsUnknownWhenBothSourcesNull() {
                RegisterRequest req = buildRegisterRequest();
                UserDTO userDTO = UserDTO.builder().id(1L).email(TEST_EMAIL).build();
                when(request.getHeader("X-Forwarded-For")).thenReturn(null);
                when(request.getRemoteAddr()).thenReturn(null);
                when(userService.registerUser(any(RegisterRequest.class))).thenReturn(userDTO);
                authController.registerUser(req, request);
                verify(rateLimitService).checkRegister("unknown");
            }
        }
    }

    @Nested
    @DisplayName("PUT /api/auth/change-password")
    class ChangePasswordTests {

        @Test
        @DisplayName("Returns 200 OK when password is changed successfully")
        public void success() {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(1L)
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            when(securityService.isOwnerOrAdmin(anyLong(), any(Authentication.class))).thenReturn(true);
            ResponseEntity<ResponseDTO<Void>> response = authController.changePassword(request, authentication);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Password changed successfully");
            assertThat(response.getBody().getData()).isNull();
            verify(userService).changePassword(request);
        }

        @Test
        @DisplayName("Throws AccessDeniedException when user is not owner or admin")
        public void notOwnerThrowsAccessDenied() {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(1L)
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            when(securityService.isOwnerOrAdmin(anyLong(), any(Authentication.class))).thenReturn(false);
            assertThatThrownBy(() -> authController.changePassword(request, authentication))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("You can only change your own password");
            verify(userService, never()).changePassword(request);
        }
    }

    @Nested
    @DisplayName("GET /api/auth/reset-password/{userId}")
    class ResetPasswordTests {

        @Test
        @DisplayName("Returns 200 OK with generated password when admin")
        public void success() {
            Long userId = 1L;
            String generatedPassword = "NewPass123!";
            when(userService.resetPassword(userId)).thenReturn(generatedPassword);
            ResponseEntity<ResponseDTO<String>> response = authController.resetPassword(userId);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Password reset successfully");
            assertThat(response.getBody().getData()).isEqualTo(generatedPassword);
            verify(userService).resetPassword(userId);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/refresh")
    class RefreshTokenTests {

        @Test
        @DisplayName("Returns 200 OK with new tokens when refresh token is valid")
        public void success() {
            String refreshToken = "valid.refresh.token";
            TokenPair rotated = TokenPair.builder()
                    .accessToken("new.access.token")
                    .refreshToken("new.refresh.token")
                    .build();
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn("Bearer " + refreshToken);
            when(authService.refreshTokens(refreshToken, mockResponse)).thenReturn(rotated);
            ResponseEntity<ResponseDTO<TokenPair>> response = authController.refreshTokens(request, mockResponse);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Tokens refreshed");
            assertThat(response.getBody().getData()).isEqualTo(rotated);
            verify(authService).refreshTokens(refreshToken, mockResponse);
        }

        @Test
        @DisplayName("Returns 401 Unauthorized when refresh token is missing")
        public void missingToken() {
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn(null);
            when(request.getCookies()).thenReturn(null);
            when(authService.refreshTokens(null, mockResponse))
                    .thenThrow(new InvalidTokenException("Invalid or expired refresh token"));
            assertThatThrownBy(() -> authController.refreshTokens(request, mockResponse))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessage("Invalid or expired refresh token");
            verify(authService).refreshTokens(null, mockResponse);
        }

        @Test
        @DisplayName("Returns 401 Unauthorized when refresh token is invalid")
        public void invalidToken() {
            String invalidToken = "invalid.token";
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn("Bearer " + invalidToken);
            when(authService.refreshTokens(invalidToken, mockResponse))
                    .thenThrow(new InvalidTokenException("Invalid or expired refresh token"));
            assertThatThrownBy(() -> authController.refreshTokens(request, mockResponse))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessage("Invalid or expired refresh token");
            verify(authService).refreshTokens(invalidToken, mockResponse);
        }

        @Test
        @DisplayName("Returns 401 Unauthorized when authorization header is not bearer")
        public void authHeaderNotBearer() {
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn("Other ");
            when(authService.refreshTokens(null, mockResponse))
                    .thenThrow(new InvalidTokenException("Invalid or expired refresh token"));
            assertThatThrownBy(() -> authController.refreshTokens(request, mockResponse))
                    .isInstanceOf(InvalidTokenException.class)
                    .hasMessage("Invalid or expired refresh token");
            verify(authService).refreshTokens(null, mockResponse);
        }

        @Test
        @DisplayName("Extracts refresh token from cookie when Authorization header is absent")
        public void successFromCookie() {
            String refreshToken = "cookie.refresh.token";
            TokenPair rotated = TokenPair.builder()
                    .accessToken("new.access.token")
                    .refreshToken("new.refresh.token")
                    .build();
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn(null);
            Cookie cookie = new Cookie("refresh_token", refreshToken);
            when(request.getCookies()).thenReturn(new Cookie[]{cookie});
            when(authService.refreshTokens(refreshToken, mockResponse)).thenReturn(rotated);
            ResponseEntity<ResponseDTO<TokenPair>> response = authController.refreshTokens(request, mockResponse);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getData()).isEqualTo(rotated);
            verify(authService).refreshTokens(refreshToken, mockResponse);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class LoginTests {

        @Test
        @DisplayName("Returns 200 OK with token and user info on success")
        public void success() {
            LoginRequest loginRequest = new LoginRequest("test@example.com", "Password123!");
            LoginResponse response = LoginResponse.builder()
                    .accessToken("access.token")
                    .refreshToken("refresh.token")
                    .email("test@example.com")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of("ROLE_USER"))
                    .build();
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(authService.login(loginRequest, mockResponse)).thenReturn(response);
            ResponseEntity<ResponseDTO<LoginResponse>> result = authController.login(loginRequest, request, mockResponse);
            assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(result.getBody()).isNotNull();
            assertThat(result.getBody().getMessage()).isEqualTo("Login successful");
            assertThat(result.getBody().getData()).isEqualTo(response);
            verify(rateLimitService).checkLogin(eq("test@example.com"), any(String.class));
            verify(authService).login(loginRequest, mockResponse);
        }

        @Test
        @DisplayName("Propagates BadCredentialsException")
        public void badCredentials() {
            LoginRequest loginRequest = new LoginRequest("test@example.com", "wrong");
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(authService.login(loginRequest, mockResponse)).thenThrow(new BadCredentialsException("Invalid credentials"));
            assertThatThrownBy(() -> authController.login(loginRequest, request, mockResponse))
                    .isInstanceOf(BadCredentialsException.class)
                    .hasMessageContaining("Invalid credentials");
            verify(rateLimitService).checkLogin(eq("test@example.com"), any(String.class));
            verify(authService).login(loginRequest, mockResponse);
        }

        @Test
        @DisplayName("Propagates RateLimitExceededException without calling AuthService")
        public void rateLimitExceeded() {
            LoginRequest loginRequest = new LoginRequest("test@example.com", "Password123!");
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            doThrow(new RateLimitExceededException("Too many attempts", 60L))
                    .when(rateLimitService).checkLogin(any(String.class), any(String.class));
            assertThatThrownBy(() -> authController.login(loginRequest, request, mockResponse))
                    .isInstanceOf(RateLimitExceededException.class);
            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/logout")
    class LogoutTests {

        @Test
        @DisplayName("Returns 200 OK and passes cookie tokens to the service")
        public void success() {
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            Cookie accessCookie = new Cookie("access_token", "access.value");
            Cookie refreshCookie = new Cookie("refresh_token", "refresh.value");
            when(request.getHeader("Authorization")).thenReturn(null);
            when(request.getCookies()).thenReturn(new Cookie[]{accessCookie, refreshCookie});
            ResponseEntity<ResponseDTO<Void>> response = authController.logout(request, mockResponse);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Logged out successfully");
            verify(authService).logout(
                    argThat(t -> "access.value".equals(t.getAccessToken())
                            && "refresh.value".equals(t.getRefreshToken())),
                    eq(mockResponse)
            );
        }

        @Test
        @DisplayName("Returns 200 OK and passes null tokens when no cookies or header are present")
        public void noTokens() {
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn(null);
            when(request.getCookies()).thenReturn(null);
            ResponseEntity<ResponseDTO<Void>> response = authController.logout(request, mockResponse);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(authService).logout(
                    argThat(t -> t.getAccessToken() == null && t.getRefreshToken() == null),
                    eq(mockResponse)
            );
        }

        @Test
        @DisplayName("Extracts tokens from the Authorization header when cookies are absent")
        public void headerTokens() {
            HttpServletResponse mockResponse = mock(HttpServletResponse.class);
            when(request.getHeader("Authorization")).thenReturn("Bearer header.token");
            ResponseEntity<ResponseDTO<Void>> response = authController.logout(request, mockResponse);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(authService).logout(
                    argThat(t -> "header.token".equals(t.getAccessToken())),
                    eq(mockResponse)
            );
        }
    }
}
