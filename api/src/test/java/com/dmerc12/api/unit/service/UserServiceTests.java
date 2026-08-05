package com.dmerc12.api.unit.service;

import com.dmerc12.api.dto.PasswordChangeRequest;
import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.exception.DuplicateResourceException;
import com.dmerc12.api.exception.PasswordMismatchException;
import com.dmerc12.api.exception.ResourceNotFoundException;
import com.dmerc12.api.mapper.UserMapper;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.service.impl.UserServiceImpl;
import com.dmerc12.api.util.PasswordGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link UserServiceImpl}.
 * <p>Verifies all user service methods:
 * <ul>
 *     <li>User retrieval (single and list)</li>
 *     <li>Registration (success, duplicate email, password mismatch)</li>
 *     <li>User creation (success, duplicate email)</li>
 *     <li>User updates</li>
 *     <li>Password change and reset</li>
 *     <li>User deletion</li>
 * </ul>
 *
 * @see UserServiceImpl
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("User Service Unit Tests")
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordGenerator passwordGenerator;

    @InjectMocks
    private UserServiceImpl userService;

    // ====== Helper Methods ========

    private RegisterRequest createValidRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@email.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("Pass123!");
        request.setPasswordConfirm("Pass123!");
        return request;
    }

    private PasswordChangeRequest createValidPasswordChangeRequest() {
        return PasswordChangeRequest.builder()
                .userId(1L)
                .oldPassword("Pass123!")
                .newPassword("NewPass123!")
                .newPasswordConfirm("NewPass123!")
                .build();
    }

    private UserDTO createValidUserDTORequest() {
       return UserDTO.builder()
               .id(null)
               .email("test@email.com")
               .firstName("John")
               .lastName("Doe")
               .roles(Set.of(Role.ROLE_USER.name()))
               .build();
    }

    private User createValidUserRequest() {
        return User.builder()
                .id(null)
                .email("test@email.com")
                .firstName("John")
                .lastName("Doe")
                .roles(Set.of(Role.ROLE_USER))
                .build();
    }

    private User createMockUser() {
        return User.builder()
                .id(1L)
                .email("test@email.com")
                .passwordHash("hashedOldPassword")
                .firstName("John")
                .lastName("Doe")
                .roles(Set.of(Role.ROLE_USER))
                .build();
    }

    private UserDTO createMockUserDTO() {
        return UserDTO.builder()
                .id(1L)
                .email("test@email.com")
                .firstName("John")
                .lastName("Doe")
                .roles(Set.of("ROLE_USER"))
                .build();
    }

    // ========== Tests =============

    @Nested
    @DisplayName("getUser() Tests")
    class GetUserTests {
        @Test
        @DisplayName("Returns user when found")
        public void getUserSuccess() {
            Long userId = 1L;
            User user = createMockUser();
            UserDTO dto = createMockUserDTO();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));
            when(userMapper.toDTO(user)).thenReturn(dto);
            UserDTO result = userService.getUser(userId);
            assertThat(result).isEqualTo(dto);
        }

        @Test
        @DisplayName("Throws ResourceNotFoundException when user not found")
        public void getUserNotFoundThrowsException() {
            Long userId = 999L;
            when(userRepository.findById(userId)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> userService.getUser(userId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found with ID: " + userId);
        }
    }

    @Nested
    @DisplayName("getUsers() Tests")
    class GetUsersTests {
        @Test
        @DisplayName("Returns list of all users")
        public void getUsersReturnsList() {
            List<User> users = List.of(createMockUser());
            UserDTO dto = createMockUserDTO();
            when(userRepository.findAll()).thenReturn(users);
            when(userMapper.toDTO(any(User.class))).thenReturn(dto);
            List<UserDTO> result = userService.getUsers();
            assertThat(result).hasSize(1);
            assertThat(result.getFirst()).isEqualTo(dto);
        }

        @Test
        @DisplayName("Returns empty list when no users exist")
        public void getUsersEmptyList() {
            when(userRepository.findAll()).thenReturn(List.of());
            List<UserDTO> result = userService.getUsers();
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("registerUser() Tests")
    class RegisterUserTests {
        @Test
        @DisplayName("Successfully registers a new user")
        public void registerUserSuccess() {
            RegisterRequest request = createValidRegisterRequest();
            User user = createMockUser();
            UserDTO dto = createMockUserDTO();
            when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(request.getPassword())).thenReturn("hashedNewPassword");
            when(userMapper.registerToEntity(any(RegisterRequest.class), anyString(), anySet())).thenReturn(user);
            when(userRepository.save(any(User.class))).thenReturn(user);
            when(userMapper.toDTO(user)).thenReturn(dto);
            UserDTO result = userService.registerUser(request);
            assertThat(result).isEqualTo(dto);
            verify(userRepository).save(any(User.class));
            verify(passwordEncoder).encode(request.getPassword());
        }

        @Test
        @DisplayName("Throws DuplicateResourceException when email already exists")
        public void registerUserDuplicateEmailThrowsException() {
            RegisterRequest request = createValidRegisterRequest();
            when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));
            assertThatThrownBy(() -> userService.registerUser(request))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Email already registered: " + request.getEmail());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Throws PasswordMismatchException when passwords do not match")
        public void registerUserPasswordMismatchThrowsException() {
            RegisterRequest request = createValidRegisterRequest();
            request.setPasswordConfirm("DifferentPassword");
            assertThatThrownBy(() -> userService.registerUser(request))
                    .isInstanceOf(PasswordMismatchException.class)
                    .hasMessageContaining("Passwords do not match");
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("createUser() Tests (Admin)")
    class CreateUserTests {
        @Test
        @DisplayName("Successfully creates a new user")
        public void createUserSuccess() {
            UserDTO request = createValidUserDTORequest();
            User requestUser = createValidUserRequest();
            User user = createMockUser();
            String generatedPassword = "GeneratedPass1!";
            when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("hashedNewPassword");
            when(userMapper.toEntity(any(UserDTO.class))).thenReturn(requestUser);
            when(userRepository.save(any(User.class))).thenReturn(user);
            when(passwordGenerator.generateSecurePassword()).thenReturn(generatedPassword);
            String result = userService.createUser(request);
            assertThat(result).isEqualTo(generatedPassword);
            assertThat(result).matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
            verify(userRepository).save(any(User.class));
            verify(passwordEncoder).encode(anyString());
        }

        @Test
        @DisplayName("Successfully creates a new admin")
        public void createUserAdminSuccess() {
            UserDTO request = createValidUserDTORequest();
            Set<String> roleNames = Set.of(Role.ROLE_USER.name(), Role.ROLE_ADMIN.name());
            request.setRoles(roleNames);
            User requestUser = createValidUserRequest();
            Set<Role> roles = Set.of(Role.ROLE_USER, Role.ROLE_ADMIN);
            requestUser.setRoles(roles);
            User user = createMockUser();
            user.setRoles(roles);
            String generatedPassword = "GeneratedPass1!";
            when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("hashedNewPassword");
            when(userMapper.toEntity(any(UserDTO.class))).thenReturn(requestUser);
            when(userRepository.save(any(User.class))).thenReturn(user);
            when(passwordGenerator.generateSecurePassword()).thenReturn(generatedPassword);
            String result = userService.createUser(request);
            assertThat(result).isEqualTo(generatedPassword);
            verify(userRepository).save(any(User.class));
            verify(passwordEncoder).encode(anyString());
        }

        @Test
        @DisplayName("Throws DuplicateResourceException when email already exists")
        public void createUserDuplicateEmailThrowsException() {
            UserDTO request = createValidUserDTORequest();
            when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));
            assertThatThrownBy(() -> userService.createUser(request))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Email already registered: " + request.getEmail());
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("updateUser() Tests")
    class UpdateUserTests {
        @Test
        @DisplayName("Successfully updates user")
        public void updateUserSuccess() {
            UserDTO dto = createMockUserDTO();
            User existing = createMockUser();
            User updated = createMockUser();
            when(userRepository.findById(dto.getId())).thenReturn(Optional.of(existing));
            when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.empty());
            when(userMapper.updateEntity(existing, dto)).thenReturn(existing);
            when(userRepository.save(existing)).thenReturn(updated);
            when(userMapper.toDTO(updated)).thenReturn(dto);
            UserDTO result = userService.updateUser(dto);
            assertThat(result).isEqualTo(dto);
            verify(userRepository).save(existing);
        }

        @Test
        @DisplayName("Allows update if email belongs to user")
        public void updateUserWhenEmailBelongsToUserException() {
            UserDTO dto = createMockUserDTO();
            User user = createMockUser();
            when(userRepository.findById(dto.getId())).thenReturn(Optional.of(user));
            when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(user));
            when(userMapper.updateEntity(user, dto)).thenReturn(user);
            when(userRepository.save(user)).thenReturn(user);
            when(userMapper.toDTO(user)).thenReturn(dto);
            UserDTO result = userService.updateUser(dto);
            assertThat(result).isEqualTo(dto);
            verify(userRepository).save(user);
        }

        @Test
        @DisplayName("Throws ResourceNotFoundException when user not found")
        public void updateUserNotFoundThrowsException() {
            UserDTO dto = createMockUserDTO();
            when(userRepository.findById(dto.getId())).thenReturn(Optional.empty());
            assertThatThrownBy(() -> userService.updateUser(dto))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Throws DuplicateResourceException when email already exists")
        public void updateUserDuplicateEmailThrowsException() {
            UserDTO dto = createMockUserDTO();
            User user = createMockUser();
            User otherUser = createMockUser();
            otherUser.setId(2L);
            when(userRepository.findById(dto.getId())).thenReturn(Optional.of(user));
            when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(otherUser));
            assertThatThrownBy(() -> userService.updateUser(dto))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("Email already registered");
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("resetPassword() Tests (Admin)")
    class ResetPasswordTests {
        @Test
        @DisplayName("Successfully resets password (sets a randomly generated password)")
        public void resetPasswordSuccess() {
            Long userId = 1L;
            User user = createMockUser();
            String generatedPassword = "GeneratedPass1!";
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));
            when(passwordGenerator.generateSecurePassword()).thenReturn(generatedPassword);
            when(passwordEncoder.encode(anyString())).thenReturn("hashedDefault");
            String password = userService.resetPassword(userId);
            verify(userRepository).save(user);
            assertThat(user.getPasswordHash()).isEqualTo("hashedDefault");
            assertThat(password).isNotNull().isNotEmpty();
            assertThat(password).isEqualTo(generatedPassword);
        }

        @Test
        @DisplayName("Throws ResourceNotFoundException when user not found")
        public void resetPasswordUserNotFoundThrowsException() {
            Long userId = 999L;
            when(userRepository.findById(userId)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> userService.resetPassword(userId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("changePassword() Tests")
    class ChangePasswordTests {
        @Test
        @DisplayName("Successfully changes password")
        public void changePasswordSuccess() {
            PasswordChangeRequest request = createValidPasswordChangeRequest();
            User user = createMockUser();
            when(userRepository.findById(request.getUserId())).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())).thenReturn(true);
            when(passwordEncoder.encode(request.getNewPassword())).thenReturn("hashedNewPassword");
            userService.changePassword(request);
            verify(userRepository).save(user);
            assertThat(user.getPasswordHash()).isEqualTo("hashedNewPassword");
        }

        @Test
        @DisplayName("Throws PasswordMismatchException when new password and confirmation do not match")
        public void changePasswordNewPasswordMismatchThrowsException() {
            PasswordChangeRequest request = createValidPasswordChangeRequest();
            request.setNewPassword("DifferentPassword1!");
            User user = createMockUser();
            when(userRepository.findById(request.getUserId())).thenReturn(Optional.of(user));
            assertThatThrownBy(() -> userService.changePassword(request))
                    .isInstanceOf(PasswordMismatchException.class)
                    .hasMessageContaining("New passwords do not match");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Throws PasswordMismatchException when old password is incorrect")
        public void changePasswordOldPasswordIncorrectThrowsException() {
            PasswordChangeRequest request = createValidPasswordChangeRequest();
            request.setOldPassword("Incorrect123!");
            User user = createMockUser();
            when(userRepository.findById(request.getUserId())).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())).thenReturn(false);
            assertThatThrownBy(() -> userService.changePassword(request))
                    .isInstanceOf(PasswordMismatchException.class)
                    .hasMessageContaining("Old password is incorrect");
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Throws ResourceNotFoundException when user not found")
        public void changePasswordUserNotFoundThrowsException() {
            PasswordChangeRequest request = createValidPasswordChangeRequest();
            when(userRepository.findById(request.getUserId())).thenReturn(Optional.empty());
            assertThatThrownBy(() -> userService.changePassword(request))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("deleteUser() Tests")
    class DeleteUserTests {
        @Test
        @DisplayName("Successfully deletes user")
        public void deleteUserSuccess() {
            Long userId = 1L;
            User user = createMockUser();
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));
            userService.deleteUser(userId);
            verify(userRepository).delete(user);
        }

        @Test
        @DisplayName("Throws ResourceNotFoundException when user not found")
        public void deleteUserNotFoundThrowsException() {
            Long userId = 999L;
            when(userRepository.findById(userId)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> userService.deleteUser(userId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");
            verify(userRepository, never()).delete(any());
        }
    }
}
