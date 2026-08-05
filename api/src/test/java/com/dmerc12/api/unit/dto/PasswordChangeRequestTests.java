package com.dmerc12.api.unit.dto;

import com.dmerc12.api.dto.PasswordChangeRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.*;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link PasswordChangeRequestTests} DTO.
 * <p>These tests verify that all validation constraints defined in the DTO are correctly enforced:
 * <ul>
 *     <li>Password: required, complex, and minimum length</li>
 *     <li>Password confirmation: required</li>
 * </ul>
 * <p>The tests cover both {@code null} and blank values, and various password complexity violations.
 *
 * @see PasswordChangeRequest
 * @see jakarta.validation.Validator
 */
@DisplayName("Password Change Request Request DTO Unit Tests")
public class PasswordChangeRequestTests {

    private static Validator validator;
    private PasswordChangeRequest passwordChangeRequest;

    @BeforeEach
    void init() {
        passwordChangeRequest = new PasswordChangeRequest();
        passwordChangeRequest.setUserId(1L);
        passwordChangeRequest.setOldPassword("Old1234!");
        passwordChangeRequest.setNewPassword("New1234!");
        passwordChangeRequest.setNewPasswordConfirm("New1234!");
    }

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Nested
    @DisplayName("Valid Password Change Request Tests")
    class ValidPasswordChangeRequestTests {
        @Test
        @DisplayName("Valid password change request has no violations")
        public void validPasswordChangeRequestHasNoViolations() {
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations).isEmpty();
        }
    }

    @Nested
    @DisplayName("User ID Tests")
    class UserIDTests {
        @Test
        @DisplayName("User ID not null")
        public void oldPasswordConfirmNotNull() {
            passwordChangeRequest.setUserId(null);
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("userId"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("User ID is required");
        }
    }

    @Nested
    @DisplayName("Old Password Confirm Tests")
    class OldPasswordConfirmTests {
        @Test
        @DisplayName("Old password confirm not null")
        public void oldPasswordConfirmNotNull() {
            passwordChangeRequest.setOldPassword(null);
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("oldPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Old password is required");
        }

        @Test
        @DisplayName("Old password confirm not blank")
        public void oldPasswordConfirmNotBlank() {
            passwordChangeRequest.setOldPassword("");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("oldPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Old password is required");
        }
    }

    @Nested
    @DisplayName("New Password Tests")
    class NewPasswordTests {
        private final String passwordRegexMessage = "Password must contain one capital letter, one lowercase letter, " +
                "one number, one special character, and at least 8 characters in length";

        @Test
        @DisplayName("New password not null")
        public void newPasswordNotNull() {
            passwordChangeRequest.setNewPassword(null);
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("New password is required");
        }

        @Test
        @DisplayName("New password not blank")
        public void newPasswordNotBlank() {
            passwordChangeRequest.setNewPassword("");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("New password is too short")
        public void newPasswordIsTooShort() {
            passwordChangeRequest.setNewPassword("Test12!");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("New password is missing capital letter")
        public void newPasswordIsMissingCapitalLetter() {
            passwordChangeRequest.setNewPassword("test123!");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("New password is missing lowercase letter")
        public void newPasswordIsMissingLowercaseLetter() {
            passwordChangeRequest.setNewPassword("TEST123!");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("New password is missing number")
        public void newPasswordIsMissingNumber() {
            passwordChangeRequest.setNewPassword("TestTest!");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("New password is missing special character")
        public void newPasswordIsMissingSpecialCharacter() {
            passwordChangeRequest.setNewPassword("Test1234");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }
    }

    @Nested
    @DisplayName("New Password Confirm Tests")
    class NewPasswordConfirmTests {
        @Test
        @DisplayName("New password confirm not null")
        public void newPasswordConfirmNotNull() {
            passwordChangeRequest.setNewPasswordConfirm(null);
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPasswordConfirm"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Password confirmation is required");
        }

        @Test
        @DisplayName("New password confirm not blank")
        public void newPasswordConfirmNotBlank() {
            passwordChangeRequest.setNewPasswordConfirm("");
            Set<ConstraintViolation<PasswordChangeRequest>> violations = validator.validate(passwordChangeRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("newPasswordConfirm"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Password confirmation is required");
        }
    }
}
