package com.dmerc12.api.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

/**
 * Represents a user of the finance tracking application.
 * <p>This entity extends {@link BaseEntity} to inherit the `id`, `createdAt`, and `updatedAt` fields.
 * It uses JPA auditing to automatically populate timestamps.
 * <p>Roles are stored as an {@link ElementCollection} in a separate table
 * {@code user_roles} to allow multiple roles per user.
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User extends BaseEntity {

    /**
     * The user's email address - used as the primary login identifier.
     * Must be unique and not null.
     */
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /**
     * The hashed password (stored with a BCrypt secure algorithm).
     * Never store the plain-text password.
     */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    /**
     * The user's first name - optional.
     */
    @Column(name = "first_name")
    private String firstName;

    /**
     * The user's last name - optional.
     */
    @Column(name = "last_name")
    private String lastName;

    /**
     * Indicates whether the account is enabled (e.g., for email verification).
     * Defaults to {@code true} for new users.
     */
    @Column(name = "enabled")
    private boolean enabled = true;

    /**
     * The set of roles assigned to this user.
     * Loaded eagerly because roles are typically needed immediately for authorization decisions.
     * <p>Stored in a separate table {@code user_roles} with a composite primary key of {@code (user_id, role)}.
     */
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id")
    )
    private Set<Role> roles = new HashSet<>();
}
