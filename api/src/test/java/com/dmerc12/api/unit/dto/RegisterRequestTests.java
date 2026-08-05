package com.dmerc12.api.unit.dto;

import com.dmerc12.api.dto.RegisterRequest;
import jakarta.validation.*;
import org.junit.jupiter.api.*;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link RegisterRequest} DTO.
 * <p>These tests verify that all validation constraints defined in the DTO are correctly enforced:
 * <ul>
 *     <li>Email: required and valid format</li>
 *     <li>Password: required, complex, and minimum length</li>
 *     <li>Password confirmation: required</li>
 *     <li>First name: required and max length</li>
 *     <li>Last name: required and max length</li>
 * </ul>
 * <p>The tests cover both {@code null} and blank values, boundary conditions (exactly 100 characters),
 * and various password complexity violations.
 *
 * @see RegisterRequest
 * @see jakarta.validation.Validator
 */
@DisplayName("Register Request DTO Unit Tests")
public class RegisterRequestTests {

    private static Validator validator;
    private RegisterRequest registerRequest;

    @BeforeEach
    void init() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@email.com");
        registerRequest.setPassword("Test123!");
        registerRequest.setPasswordConfirm("Test123!");
        registerRequest.setFirstName("Test");
        registerRequest.setLastName("Test");
    }

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Nested
    @DisplayName("Valid Register Request Tests")
    class ValidRegisterRequestTests {
        @Test
        @DisplayName("Valid register request has no violations")
        public void validRegisterRequestHasNoViolations() {
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("First name is valid with 100 characters")
        public void firstNameIsValidWith100Characters() {
            registerRequest.setFirstName("t".repeat(100));
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("Last name is valid with 100 characters")
        public void lastNameIsValidWith100Characters() {
            registerRequest.setLastName("t".repeat(100));
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations).isEmpty();
        }
    }

    @Nested
    @DisplayName("Email Tests")
    class EmailTests {
        @Test
        @DisplayName("Email not null")
        public void emailNotNull() {
            registerRequest.setEmail(null);
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("email"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Email is required");
        }

        @Test
        @DisplayName("Email not blank")
        public void emailNotBlank() {
            registerRequest.setEmail("");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("email"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Email is required");
        }

        @Test
        @DisplayName("Email is incorrect format")
        public void emailIsIncorrectFormat() {
            registerRequest.setEmail("testatemaildotcom");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("email"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Invalid email format");
        }
    }

    @Nested
    @DisplayName("Password Tests")
    class PasswordTests {
        private final String passwordRegexMessage = "Password must contain one capital letter, one lowercase letter, " +
                "one number, one special character, and at least 8 characters in length";

        @Test
        @DisplayName("Password not null")
        public void passwordNotNull() {
            registerRequest.setPassword(null);
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Password is required");
        }

        @Test
        @DisplayName("Password not blank")
        public void passwordNotBlank() {
            registerRequest.setPassword("");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("Password is too short")
        public void passwordIsTooShort() {
            registerRequest.setPassword("Test12!");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("Password is missing capital letter")
        public void passwordIsMissingCapitalLetter() {
            registerRequest.setPassword("test123!");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("Password is missing lowercase letter")
        public void passwordIsMissingLowercaseLetter() {
            registerRequest.setPassword("TEST123!");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("Password is missing number")
        public void passwordIsMissingNumber() {
            registerRequest.setPassword("TestTest!");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }

        @Test
        @DisplayName("Password is missing special character")
        public void passwordIsMissingSpecialCharacter() {
            registerRequest.setPassword("Test1234");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("password"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf(passwordRegexMessage);
        }
    }

    @Nested
    @DisplayName("Password Confirm Tests")
    class PasswordConfirmTests {
        @Test
        @DisplayName("Password confirm not null")
        public void passwordConfirmNotNull() {
            registerRequest.setPasswordConfirm(null);
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("passwordConfirm"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Password confirmation is required");
        }

        @Test
        @DisplayName("Password confirm not blank")
        public void passwordConfirmNotBlank() {
            registerRequest.setPasswordConfirm("");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("passwordConfirm"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Password confirmation is required");
        }
    }

    @Nested
    @DisplayName("First Name Tests")
    class FirstNameTests {
        @Test
        @DisplayName("First name not null")
        public void firstNameNotNull() {
            registerRequest.setFirstName(null);
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("firstName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("First name is required");
        }

        @Test
        @DisplayName("First name not blank")
        public void firstNameNotBlank() {
            registerRequest.setFirstName("");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("firstName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("First name is required");
        }

        @Test
        @DisplayName("First name is too long")
        public void firstNameIsTooLong() {
            registerRequest.setFirstName("a".repeat(101));
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("firstName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("First name cannot exceed 100 characters");
        }
    }

    @Nested
    @DisplayName("Last Name Tests")
    class LastNameTests {
        @Test
        @DisplayName("Last name not null")
        public void lastNameNotNull() {
            registerRequest.setLastName(null);
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("lastName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Last name is required");
        }

        @Test
        @DisplayName("Last name not blank")
        public void lastNameNotBlank() {
            registerRequest.setLastName("");
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("lastName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Last name is required");
        }

        @Test
        @DisplayName("Last name is too long")
        public void lastNameIsTooLong() {
            registerRequest.setLastName("a".repeat(101));
            Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(registerRequest);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("lastName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Last name cannot exceed 100 characters");
        }
    }
}
