package com.dmerc12.api.unit.dto;

import com.dmerc12.api.dto.UserDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.*;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for the {@link UserDTO} validation constraints.
 * <p>These tests verify that the DTO enforces the correct rules for its validated fields:
 * <ul>
 *     <li>Email: required and valid format</li>
 *     <li>First name: required and max length 100</li>
 *     <li>Last name: required and max length 100</li>
 * </ul>
 * <p>The tests cover both {@code null} and blank values, boundary conditions (exactly 100 characters),
 * and invalid email formats.
 *
 * @see UserDTO
 * @see jakarta.validation.Validator
 */
@DisplayName("User DTO Unit Tests")
public class UserDTOTests {
    private static Validator validator;
    private UserDTO userDTO;

    @BeforeEach
    void init() {
        userDTO = new UserDTO();
        userDTO.setEmail("test@email.com");
        userDTO.setFirstName("Test");
        userDTO.setLastName("Test");
    }

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Nested
    @DisplayName("Valid user DTO Tests")
    class ValidUserDTOTests {
        @Test
        @DisplayName("Valid user DTO has no violations")
        public void validUserDTOHasNoViolations() {
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("First name is valid with 100 characters")
        public void firstNameIsValidWith100Characters() {
            userDTO.setFirstName("t".repeat(100));
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations).isEmpty();
        }

        @Test
        @DisplayName("Last name is valid with 100 characters")
        public void lastNameIsValidWith100Characters() {
            userDTO.setLastName("t".repeat(100));
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations).isEmpty();
        }
    }

    @Nested
    @DisplayName("Email Tests")
    class EmailTests {
        @Test
        @DisplayName("Email not null")
        public void emailNotNull() {
            userDTO.setEmail(null);
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("email"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Email is required");
        }

        @Test
        @DisplayName("Email not blank")
        public void emailNotBlank() {
            userDTO.setEmail("");
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("email"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Email is required");
        }

        @Test
        @DisplayName("Email is incorrect format")
        public void emailIsIncorrectFormat() {
            userDTO.setEmail("testatemaildotcom");
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("email"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Invalid email format");
        }
    }

    @Nested
    @DisplayName("First Name Tests")
    class FirstNameTests {
        @Test
        @DisplayName("First name not null")
        public void firstNameNotNull() {
            userDTO.setFirstName(null);
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("firstName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("First name is required");
        }

        @Test
        @DisplayName("First name not blank")
        public void firstNameNotBlank() {
            userDTO.setFirstName("");
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("firstName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("First name is required");
        }

        @Test
        @DisplayName("First name is too long")
        public void firstNameIsTooLong() {
            userDTO.setFirstName("a".repeat(101));
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
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
            userDTO.setLastName(null);
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("lastName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Last name is required");
        }

        @Test
        @DisplayName("Last name not blank")
        public void lastNameNotBlank() {
            userDTO.setLastName("");
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("lastName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Last name is required");
        }

        @Test
        @DisplayName("Last name is too long")
        public void lastNameIsTooLong() {
            userDTO.setLastName("a".repeat(101));
            Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);
            assertThat(violations)
                    .filteredOn(v -> v.getPropertyPath().toString().equals("lastName"))
                    .extracting(ConstraintViolation::getMessage)
                    .containsAnyOf("Last name cannot exceed 100 characters");
        }
    }
}
