package com.dmerc12.api.service.impl;

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
import com.dmerc12.api.service.UserService;
import com.dmerc12.api.util.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of {@link UserService} for user management operations.
 * <p>This service handles all business logic related to users, including:
 * <ul>
 *     <li>Registration (email uniqueness, password hashing, default role)</li>
 *     <li>User retrieval (single and list)</li>
 *     <li>Admin user creation</li>
 *     <li>User updates (with email uniqueness check)</li>
 *     <li>Password change (with old password validation)</li>
 *     <li>Admin password reset (generates a random password)</li>
 *     <li>User deletion</li>
 * </ul>
 *
 * @see UserService
 * @see UserRepository
 * @see UserMapper
 * @see PasswordEncoder
 */
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final PasswordGenerator passwordGenerator;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;
    private final UserMapper mapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public UserDTO getUser(Long userId) {
        User user = getUserEntity(userId);
        return mapper.toDTO(user);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getUsers() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @SuppressWarnings("ConstantConditions")
    public UserDTO registerUser(RegisterRequest request) {
        // 1. Check email uniqueness
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration attempt with existing email: {}", request.getEmail());
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }
        // 2. Validate password confirmation
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            log.warn("Registration attempt with password mismatch for email: {}", request.getEmail());
            throw new PasswordMismatchException("Passwords do not match");
        }
        // 3. Hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        // 4. Build entity with default role
        User user = mapper.registerToEntity(request, hashedPassword, Set.of(Role.ROLE_USER));
        // 5. Save
        User saved = repository.save(user);
        log.info("User registered successfully: {} (ID: {})", saved.getEmail(), saved.getId());
        // 6. Convert to DTO and return
        return mapper.toDTO(saved);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String createUser(UserDTO userDTO) {
        // 1. Check email uniqueness
        if (repository.findByEmail(userDTO.getEmail()).isPresent()) {
            log.warn("Admin creation attempt with existing email: {}", userDTO.getEmail());
            throw new DuplicateResourceException("Email already registered: " + userDTO.getEmail());
        }
        // 2. Map DTO to entity (without password)
        User user = mapper.toEntity(userDTO);
        // 3. Generate and hash a default password
        String generatedPassword = passwordGenerator.generateSecurePassword();
        user.setPasswordHash(passwordEncoder.encode(generatedPassword));
        // 4. Save
        User saved = repository.save(user);
        log.info("Admin created user: {} (ID: {}) with generated password", saved.getEmail(), saved.getId());
        // 5. Return the generated password
        return generatedPassword;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        // 1. Check if user exists
        User user = getUserEntity(userDTO.getId());
        // 2. Check email uniqueness (if email is being changed)
        Optional<User> existing = repository.findByEmail(userDTO.getEmail());
        if (existing.isPresent() && !existing.get().getId().equals(user.getId())) {
            log.warn("Update attempt with existing email: {} for user ID: {}", userDTO.getEmail(), user.getId());
            throw new DuplicateResourceException("Email already registered: " + userDTO.getEmail());
        }
        // 3. Update fields (except password/roles)
        User updated = mapper.updateEntity(user, userDTO);
        // 4. Save and return
        User saved = repository.save(updated);
        log.info("User updated: {} (ID: {})", saved.getEmail(), saved.getId());
        return mapper.toDTO(saved);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String resetPassword(Long userId) {
        // 1. Check if user exists
        User user = getUserEntity(userId);
        // 2. Generate a random password and hash it
        String generatedPassword = passwordGenerator.generateSecurePassword();
        user.setPasswordHash(passwordEncoder.encode(generatedPassword));
        // 3. Save and return generated password
        repository.save(user);
        log.info("Password reset for user: {} (ID: {})", user.getEmail(), user.getId());
        return generatedPassword;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void changePassword(PasswordChangeRequest request) {
        // 1. Check if user exists
        User user = getUserEntity(request.getUserId());
        // 2. Validate new password confirmation
        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            log.warn("Password change mismatch for user ID: {}", request.getUserId());
            throw new PasswordMismatchException("New passwords do not match");
        }
        // 3. Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            log.warn("Incorrect old password for user ID: {}", request.getUserId());
            throw new PasswordMismatchException("Old password is incorrect");
        }
        // 4. Encode and set new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
        log.info("Password changed for user: {} (ID: {})", user.getEmail(), user.getId());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteUser(Long userId) {
        User user = getUserEntity(userId);
        repository.delete(user);
        log.info("User deleted: {} (ID: {})", user.getEmail(), user.getId());
    }

    // =========== Private Helpers ==============

    /**
     * Returns user entity from user ID
     * @param userId the user's ID
     * @return the User entity from the database
     */
    private User getUserEntity(Long userId) {
        return repository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found with ID: {}", userId);
                    return new ResourceNotFoundException("User not found with ID: " + userId);
                });
    }
}
