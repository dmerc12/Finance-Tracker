package com.dmerc12.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Data Transfer Object (DTO) for user registration requests.
 * <p>This DTO is used as the request body for the {@code /auth/register} endpoint.
 * It enforces validation rules for all fields to ensure data integrity and security.
 * <p><b>Validation rules:</b>
 * <ul>
 *     <li><b>Email:</b> Required and must be a valid email format.</li>
 *     <li><b>Password:</b> Required, at least 8 characters, and must contain at least
 *     one uppercase letter, one lowercase letter, one digit, and one special character
 *     ({@code @$!%*?&}).</li>
 *     <li><b>Password Confirm:</b> Required (must match password in the service layer).</li>
 *     <li><b>First Name:</b> Required, max 100 characters.</li>
 *     <li><b>Last Name:</b> Required, max 100 characters.</li>
 * </ul>
 * <p>The DTO is built with Lombok {@code @Builder} and includes both a no-args and an all-args constructor.
 *
 * @see jakarta.validation.Validator
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    /**
     * The user's email address.
     * <p>Must not be blank and must be a valid email format.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    /**
     * The user's password.
     * <p>Must not be blank, at least 8 characters long, and meet complexity requirements:
     * at least one uppercase, one lowercase, one digit, and one special character.
     */
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain one capital letter, one lowercase letter, one number, " +
                    "one special character, and at least 8 characters in length"
    )
    private String password;

    /**
     * Password confirmation field.
     * <p>Must not be blank. The service layer will verify that it matches the {@code password} field.
     */
    @NotBlank(message = "Password confirmation is required")
    private String passwordConfirm;

    /**
     * The user's first name.
     * <p>Must not be blank and cannot exceed 100 characters.
     */
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name cannot exceed 100 characters")
    private String firstName;

    /**
     * The user's last name.
     * <p>Must not be blank and cannot exceed 100 characters.
     */
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;
}
