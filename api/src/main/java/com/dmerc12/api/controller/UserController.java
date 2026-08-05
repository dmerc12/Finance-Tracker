package com.dmerc12.api.controller;

import com.dmerc12.api.dto.ResponseDTO;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for user management operations.
 * <p>Provides CRUD endpoints for users:
 * <ul>
 *     <li><b>Get user:</b> {@code GET /api/users/{userId}}</li>
 *     <li><b>List users:</b> {@code GET /api/users}</li>
 *     <li><b>Create user:</b> {@code POST /api/users}</li>
 *     <li><b>Update user:</b> {@code PUT /api/users/{userId}}</li>
 *     <li><b>Delete user:</b> {@code DELETE /api/users/{userId}}</li>
 * </ul>
 * <p><b>Security:</b>
 * <ul>
 *     <li>GET /{userId}, PUT /{userId}, DELETE /{userId} - require ownership or admin role.</li>
 *     <li>GET /, POST / - require admin role</li>
 * </ul>
 * All responses are wrapped in a consistent {@link ResponseDTO} structure.
 *
 * @see UserService
 * @see ResponseDTO
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    /**
     * Retrieves a user by ID.
     * <p>Accessible only to the user themselves or an admin.
     *
     * @param userId the user ID
     * @return {@code 200 OK} with the user DTO
     */
    @GetMapping("/{userId}")
    @PreAuthorize("@securityService.isOwnerOrAdmin(#userId, authentication)")
    public ResponseEntity<ResponseDTO<UserDTO>> getUser(@PathVariable Long userId) {
        UserDTO user = userService.getUser(userId);
        log.info("Retrieved user ID: {}", user.getId());
        return ResponseEntity.ok(ResponseDTO.success("User retrieved successfully", user));
    }

    /**
     * Lists all users.
     * <p>Admin only. Returns a list of all user DTOs.
     *
     * @return {@code 200 OK} with a list of user DTOs
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO<List<UserDTO>>> getUsers() {
        List<UserDTO> users = userService.getUsers();
        log.info("Retrieved all users");
        return ResponseEntity.ok(ResponseDTO.success("Users retrieved successfully", users));
    }

    /**
     * Creates a new user (admin only).
     * <p>Accepts a {@link UserDTO} (without password), generates a secure random password,
     * and returns the plain-text password to the admin.
     *
     * @param userDTO the user data (validated via {@code @Valid})
     * @return {@code 200 OK} with a success response containing the generated password
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO<String>> createUser(@Valid @RequestBody UserDTO userDTO) {
        String password = userService.createUser(userDTO);
        log.info("Created user with email: {}", userDTO.getEmail());
        return ResponseEntity.ok(ResponseDTO.success("Created user successfully", password));
    }

    /**
     * Updates an existing user.
     * <p>Accessible only to the user themselves or an admin. The user ID in the path
     * must match the ID in the DTO (it is set automatically).
     *
     * @param userId the user ID
     * @param userDTO the updated user data (validated via {@code @Valid})
     * @return {@code 200 OK} with the updated user DTO
     */
    @PutMapping("/{userId}")
    @PreAuthorize("@securityService.isOwnerOrAdmin(#userId, authentication)")
    public ResponseEntity<ResponseDTO<UserDTO>> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserDTO userDTO) {
        userDTO.setId(userId);
        UserDTO updated = userService.updateUser(userDTO);
        log.info("Updated user with ID: {} and email: {}", userId, userDTO.getEmail());
        return ResponseEntity.ok(ResponseDTO.success("User updated successfully", updated));
    }

    /**
     * Deletes a user.
     * <p>Accessible only to the user themselves or an admin.
     *
     * @param userId the user ID
     * @return {@code 200 OK} with a success message
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("@securityService.isOwnerOrAdmin(#userId, authentication)")
    public ResponseEntity<ResponseDTO<Void>> deleteUser(
            @PathVariable Long userId) {
        userService.deleteUser(userId);
        log.info("Deleted user with ID: {}", userId);
        return ResponseEntity.ok(ResponseDTO.success("User deleted successfully", null));
    }
}
