package com.dmerc12.api.service;

import com.dmerc12.api.dto.PasswordChangeRequest;
import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.dto.UserDTO;

import java.util.List;

/**
 * Service interface for user management operations
 * <p>Defines the contract for user-related business logic, including registration, retrieval, update,
 * password change, and deletion.
 */
public interface UserService {
    /**
     * Retrieves a user by their unique identifier
     *
     * @param userId the ID of the user
     * @return the user DTO
     * @throws com.dmerc12.api.exception.ResourceNotFoundException if no user exists with the given ID
     */
    UserDTO getUser(Long userId);

    /**
     * Retrieves all users.
     *
     * @return a list of all user DTOs (may be empty)
     */
    List<UserDTO> getUsers();

    /**
     * Registers a new user from a registration request
     *
     * @param request the registration request DTO
     * @return the created user DTO
     * @throws com.dmerc12.api.exception.DuplicateResourceException if the email is already registered
     * @throws com.dmerc12.api.exception.PasswordMismatchException if password and confirmation password do not match
     */
    UserDTO registerUser(RegisterRequest request);

    /**
     * Creates a new user (admin only).
     * <p>This method is intended for admin-level user creation.
     *
     * @param userDTO the user data to create
     * @return the generated plain-text password (must be communicated securely to the user)
     * @throws com.dmerc12.api.exception.DuplicateResourceException if the email is already registered
     */
    String createUser(UserDTO userDTO);

    /**
     * Updates an existing user.
     *
     * @param userDTO the user data to update (must contain the ID)
     * @return the updated user DTO
     * @throws com.dmerc12.api.exception.DuplicateResourceException if the email is already registered
     * @throws com.dmerc12.api.exception.ResourceNotFoundException if the user does not exist
     */
    UserDTO updateUser(UserDTO userDTO);

    /**
     * Resets a user's password (admin only).
     * <p>This method is intended for admin-level user password reset.
     *
     * @param userId the user ID of the user's password to change
     * @return the new generated password
     * @throws com.dmerc12.api.exception.ResourceNotFoundException if the user does not exist
     */
    String resetPassword(Long userId);

    /**
     * Changes a user's password.
     *
     * @param request the password change data (must contain the old password)
     * @throws com.dmerc12.api.exception.ResourceNotFoundException if the user does not exist
     * @throws com.dmerc12.api.exception.PasswordMismatchException if new password and new confirmation password do not match
     */
    void changePassword(PasswordChangeRequest request);

    /**
     * Deletes a user.
     *
     * @param userId the user ID of the user to delete
     * @throws com.dmerc12.api.exception.ResourceNotFoundException if the user does not exist
     */
    void deleteUser(Long userId);
}
