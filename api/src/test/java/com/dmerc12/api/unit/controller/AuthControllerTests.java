package com.dmerc12.api.unit.controller;

import com.dmerc12.api.controller.AuthController;
import com.dmerc12.api.dto.PasswordChangeRequest;
import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.dto.ResponseDTO;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.security.SecurityService;
import com.dmerc12.api.service.UserService;
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
import org.springframework.security.core.Authentication;

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
    private UserService userService;

    @Mock
    private SecurityService securityService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthController authController;

    private static final String TEST_EMAIL = "test@example.com";

    @Nested
    @DisplayName("POST /api/auth/register")
    class RegisterTests {

        @Test
        @DisplayName("Returns 201 Created with user data on successful registration")
        public void success() {
            RegisterRequest request = new RegisterRequest();
            request.setEmail(TEST_EMAIL);
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            UserDTO userDTO = UserDTO.builder()
                    .id(1L)
                    .email(TEST_EMAIL)
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            when(userService.registerUser(any(RegisterRequest.class))).thenReturn(userDTO);
            ResponseEntity<ResponseDTO<UserDTO>> response = authController.registerUser(request);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("User registered successfully");
            assertThat(response.getBody().getData()).isEqualTo(userDTO);
            verify(userService).registerUser(request);
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
}
