package com.dmerc12.api.entity;

/**
 * Defines the available roles for users in the system.
 * <p>Roles are used for authorization with Spring Security.
 * Each role is prefixed with "ROLE_" to align with Spring Security's
 * {@code hasRole()} and {@code hasAuthority()} checks.
 */
public enum Role {
    /**
     * Standard user with access to personal accounts and transactions.
     */
    ROLE_USER,
    /**
     * Administrator with elevated privileges, such as accessing actuator endpoints and system administration features.
     */
    ROLE_ADMIN,
}
