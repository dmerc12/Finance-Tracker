package com.dmerc12.api.repository;

import com.dmerc12.api.entity.User;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository for {@link User} entities.
 * <p>Provides CRUD operations and custom queries for user management.
 * <p>Key features:
 * <ul>
 *     <li>Standard CRUD operations</li>
 *     <li>Custom queries for user retrieval</li>
 *     <li>Pagination and sorting support</li> // TODO
 *     <li>Advanced filtering via specifications</li> // TODO
 * </ul>
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Finds a user by email address.
     *
     * @param email User's email address
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Retrieves all users with caching support.
     * @return List of all users
     */
    @NonNull
    @Override
    List<User> findAll();
}
