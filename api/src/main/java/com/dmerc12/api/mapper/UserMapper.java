package com.dmerc12.api.mapper;

import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import lombok.NonNull;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for converting between {@link User} entities and various DTOs,
 * including {@link UserDTO} and {@link RegisterRequest}.
 * <p>Centralizes all user-related mapping logic to keep services clean and maintainable.
 * This mapper handles:
 * <ul>
 *     <li>Entity → DTO</li>
 *     <li>DTO → Entity</li>
 *     <li>RegisterRequest → Entity</li>
 *     <li>Entity updates</li>
 * </ul>
 *
 * @see User
 * @see UserDTO
 * @see RegisterRequest
 */
@Component
public class UserMapper {

    /**
     * Converts a {@link User} entity to a {@link UserDTO}.
     * <p>Role enums are converted to strings for frontend convenience.
     *
     * @param user the user entity (must not be {@code null}
     * @return the populated user DTO
     */
    public UserDTO toDTO(@NonNull User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles().stream()
                        .map(Role::name)
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Converts a {@link UserDTO} to a {@link User} entity.
     * <p>Used for admin creation/update where the DTO provides all necessary fields.
     * Defaults {@code enabled} to {@code true}
     *
     * @param dto the user DTO (must not be {@code null})
     * @return a new user entity with fields populated from the DTO
     */
    public User toEntity(@NonNull UserDTO dto) {
        return User.builder()
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .roles(dto.getRoles() != null
                        ? dto.getRoles().stream()
                            .map(Role::valueOf)
                            .collect(Collectors.toSet())
                        : Set.of())
                .enabled(true)
                .build();
    }

    /**
     * Converts a {@link RegisterRequest} to a {@link User} entity.
     * <p>This method is specifically for user registration.
     * It accepts a pre-hashed password and a set of roles, allowing the service to handle hashing and role assignment
     * (e.g., default role for regular users, custom roles for admins).
     *
     * @param registerRequest the registration request DTO (must not be {@code null})
     * @param passwordHash the already hashed password (must not be {@code null})
     * @param roles the roles to assign to the new user (must not be {@code null})
     * @return a new user entity with fields populated from the request
     */
    public User registerToEntity(@NonNull RegisterRequest registerRequest, @NonNull String passwordHash,
                                 @NonNull Set<Role> roles) {
        return User.builder()
                .email(registerRequest.getEmail())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .passwordHash(passwordHash)
                .roles(roles)
                .enabled(true)
                .build();
    }

    /**
     * Updates an existing {@link User} entity with data from a {@link UserDTO}.
     * <p>This method modifies the passed entity in place and returns it for convenience.
     * Password, roles, and audit fields are not modified.
     *
     * @param user the existing user entity (must not be {@code null})
     * @param dto the DTO containing the updated fields (must not be {@code null})
     * @return the updated user entity (same instance as the input)
     */
    public User updateEntity(@NonNull User user, @NonNull UserDTO dto) {
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        return user;
    }
}
