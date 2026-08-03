package com.dmerc12.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

/**
 * Data Transfer Object (DTO) for password change requests.
 * <p>This DTO is used as the request body for the {@code /auth/change-password} endpoint.
 * It enforces validation rules for all fields to ensure data integrity and security.
 * <p><b>Validation rules:</b>
 * <ul>
 *     <li><b>Old Password:</b> Required</li>
 *     <li><b>New Password:</b> Required, at least 8 characters, and must contain at least
 *     one uppercase letter, one lowercase letter, one digit, and one special character
 *     ({@code @$!%*?&}).</li>
 *     <li><b>New Password Confirm:</b> Required (must match password in the service layer).</li>
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
public class PasswordChangeRequest {

    /**
     * The user's ID.
     * <p>Must not be blank. The service will verify the user exists</p>
     */
    @NotNull(message = "User ID is required")
    private Long userId;

    /**
     * The user's old password.
     * <p>Must not be blank. The service layer will verify that it matches the current stored password hash.
     */
    @NotBlank(message = "Old password is required")
    private String oldPassword;

    /**
     * The user's new password.
     * <p>Must not be blank, at least 8 characters long, and meet complexity requirements:
     * at least one uppercase, one lowercase, one digit, and one special character.
     */
    @NotBlank(message = "New password is required")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain one capital letter, one lowercase letter, one number, " +
                    "one special character, and at least 8 characters in length"
    )
    private String newPassword;

    /**
     * New password confirmation field.
     * <p>Must not be blank. The service layer will verify that it matches the {@code newPassword} field.
     */
    @NotBlank(message = "Password confirmation is required")
    private String newPasswordConfirm;
}
