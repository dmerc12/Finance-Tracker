package com.dmerc12.api.unit.mapping;

import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.mapper.UserMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for {@link UserMapper}.
 * <p>Verifies that all mapping methods correctly transform between entities and DTOs:
 * <ul>
 *     <li>{@link UserMapper#toDTO(User)} - User entity → UserDTO</li>
 *     <li>{@link UserMapper#toEntity(UserDTO)} - UserDTO → User entity</li>
 *     <li>{@link UserMapper#registerToEntity(RegisterRequest, String, Set)} - RegisterRequest → User</li>
 *     <li>{@link UserMapper#updateEntity(User, UserDTO)} - updated existing user from DTO</li>
 * </ul>
 * <p>Also validates that all {@code @NonNull} parameters correctly throw {@link NullPointerException}
 * when {@code null} is passed.
 *
 * @see UserMapper
 */
@DisplayName("User Mapper Unit Tests")
public class UserMapperTests {

    private final UserMapper mapper = new UserMapper();

    @Nested
    @DisplayName("toDTO Tests")
    class toDTOTests {
        @Test
        @DisplayName("Correctly maps User entity to UserDTO")
        public void correctlyMapsUserEntityToUserDTO() {
            User user = User.builder()
                    .id(1L)
                    .email("test@email.com")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of(Role.ROLE_USER, Role.ROLE_ADMIN))
                    .build();
            UserDTO dto = mapper.toDTO(user);
            assertThat(dto).isNotNull();
            assertThat(dto.getId()).isEqualTo(1L);
            assertThat(dto.getEmail()).isEqualTo("test@email.com");
            assertThat(dto.getFirstName()).isEqualTo("John");
            assertThat(dto.getLastName()).isEqualTo("Doe");
            assertThat(dto.getRoles()).hasSize(2);
            assertThat(dto.getRoles()).containsExactlyInAnyOrder("ROLE_USER", "ROLE_ADMIN");
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when user is null")
        public void throwsNPEWhenUserIsNull() {
            assertThatThrownBy(() -> mapper.toDTO(null))
                    .isInstanceOf(NullPointerException.class);
        }
    }

    @Nested
    @DisplayName("toEntity Tests")
    class toEntityTests {
        @Test
        @DisplayName("Correctly maps UserDTO to User entity")
        public void correctlyMapsUserDTOToUserEntity() {
            UserDTO dto = UserDTO.builder()
                    .email("test@email.com")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of("ROLE_USER"))
                    .build();
            User user = mapper.toEntity(dto);
            assertThat(user).isNotNull();
            assertThat(user.getEmail()).isEqualTo("test@email.com");
            assertThat(user.getFirstName()).isEqualTo("John");
            assertThat(user.getLastName()).isEqualTo("Doe");
            assertThat(user.getRoles()).hasSize(1);
            assertThat(user.getRoles()).containsExactly(Role.ROLE_USER);
            assertThat(user.isEnabled()).isTrue();
            assertThat(user.getId()).isNull();
            assertThat(user.getCreatedAt()).isNull();
            assertThat(user.getUpdatedAt()).isNull();
        }

        @Test
        @DisplayName("Handles null roles in UserDTO gracefully")
        public void handlesNullRoles() {
            UserDTO dto = UserDTO.builder()
                    .email("test@email.com")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(null)
                    .build();
            User user = mapper.toEntity(dto);
            assertThat(user).isNotNull();
            assertThat(user.getRoles()).isEmpty();
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when UserDTO is null")
        public void throwsNPEWhenUserDTOIsNull() {
            assertThatThrownBy(() -> mapper.toEntity(null))
                    .isInstanceOf(NullPointerException.class);
        }
    }

    @Nested
    @DisplayName("registerToEntity Tests")
    class registerToEntityTests {
        @Test
        @DisplayName("Correctly maps RegisterRequest to User with hashed password and roles")
        public void correctlyMapsRegisterRequestToUserWithHashedPasswordAndRoles() {
            RegisterRequest registerRequest = RegisterRequest.builder()
                    .email("test@email.com")
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            String hashedPassword = "hashed-password";
            Set<Role> roles = Set.of(Role.ROLE_USER, Role.ROLE_ADMIN);
            User user = mapper.registerToEntity(registerRequest, hashedPassword, roles);
            assertThat(user).isNotNull();
            assertThat(user.getEmail()).isEqualTo(registerRequest.getEmail());
            assertThat(user.getFirstName()).isEqualTo(registerRequest.getFirstName());
            assertThat(user.getLastName()).isEqualTo(registerRequest.getLastName());
            assertThat(user.getPasswordHash()).isEqualTo(hashedPassword);
            assertThat(user.getRoles()).hasSize(2);
            assertThat(user.getRoles()).containsExactlyInAnyOrder(Role.ROLE_USER, Role.ROLE_ADMIN);
            assertThat(user.isEnabled()).isTrue();
            assertThat(user.getId()).isNull();
            assertThat(user.getCreatedAt()).isNull();
            assertThat(user.getUpdatedAt()).isNull();
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when register request is null")
        public void throwsNPEWhenRequestIsNull() {
            assertThatThrownBy(() -> mapper.registerToEntity(null, "hash", Set.of()))
                    .isInstanceOf(NullPointerException.class);
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when password hash is null")
        public void throwsNPEWhenPasswordHashIsNull() {
            RegisterRequest request = new RegisterRequest();
            assertThatThrownBy(() -> mapper.registerToEntity(request, null, Set.of()))
                    .isInstanceOf(NullPointerException.class);
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when roles is null")
        public void throwsNPEWhenRolesIsNull() {
            RegisterRequest request = new RegisterRequest();
            assertThatThrownBy(() -> mapper.registerToEntity(request, "hash", null))
                    .isInstanceOf(NullPointerException.class);
        }
    }

    @Nested
    @DisplayName("updateEntity Tests")
    class UpdateEntityTests {
        @Test
        @DisplayName("Maps existing user fields from UserDTO")
        public void correctlyMapsUserDTOToUserEntity() {
            User user = User.builder()
                    .id(1L)
                    .email("old@email.com")
                    .firstName("Old")
                    .lastName("Old")
                    .passwordHash("old-hash")
                    .roles(Set.of(Role.ROLE_ADMIN))
                    .build();
            UserDTO dto = UserDTO.builder()
                    .email("new@email.com")
                    .firstName("New")
                    .lastName("New")
                    .build();
            User updated = mapper.updateEntity(user, dto);
            assertThat(updated).isSameAs(user);
            assertThat(updated.getEmail()).isEqualTo("new@email.com");
            assertThat(updated.getFirstName()).isEqualTo("New");
            assertThat(updated.getLastName()).isEqualTo("New");
            assertThat(updated.getPasswordHash()).isEqualTo("old-hash");
            assertThat(updated.getRoles()).hasSize(1);
            assertThat(updated.getRoles()).containsExactly(Role.ROLE_ADMIN);
            assertThat(updated.getId()).isEqualTo(user.getId());
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when user is null")
        public void throwsNPEWhenUserIsNull() {
            UserDTO dto = UserDTO.builder().build();
            assertThatThrownBy(() -> mapper.updateEntity(null, dto))
                    .isInstanceOf(NullPointerException.class);
        }

        @Test
        @SuppressWarnings("ConstantConditions")
        @DisplayName("Throws NullPointerException when dto is null")
        public void throwsNPEWhenDTOIsNull() {
            User user = User.builder().build();
            assertThatThrownBy(() -> mapper.updateEntity(user, null))
                    .isInstanceOf(NullPointerException.class);
        }
    }
}
