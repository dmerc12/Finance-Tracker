package com.dmerc12.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * Data Transfer Object for login responses.
 * <p>Contains the access token and user details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    /**
     * The JWT access token.
     */
    private String accessToken;

    /**
     * The JWT refresh token
     */
    private String refreshToken;

    /**
     * The user's email;
     */
    private String email;

    /**
     * The user's first name.
     */
    private String firstName;

    /**
     * The user's last name.
     */
    private String lastName;

    /**
     * The user's roles (e.g., ROLE_USER, ROLE_ADMIN).
     */
    private Set<String> roles;
}
