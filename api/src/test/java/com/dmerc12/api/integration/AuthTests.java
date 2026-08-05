package com.dmerc12.api.integration;

import com.dmerc12.api.controller.AuthController;
import com.dmerc12.api.dto.PasswordChangeRequest;
import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full-stack integration tests for {@link AuthController}.
 * <p>Tests the authentication endpoints against a real PostgreSQL database
 * (via Testcontainers) with a fully loaded Spring context.
 * <p><b>Coverage:</b>
 * <ul>
 *     <li>User registration - success and validation failures</li>
 *     <li>Password change - success, ownership check, and validation errors</li>
 *     <li>Admin password  reset - success and authorization</li>
 * </ul>
 *
 * @see AuthController
 * @see RegisterRequest
 * @see PasswordChangeRequest
 */
@DisplayName("Authentication Integration Tests")
public class AuthTests  extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User user;

    private static final String BASE_URL = "/api/auth";

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        user = User.builder()
                .email("owner@example.com")
                .firstName("Bill")
                .lastName("Johnson")
                .passwordHash(passwordEncoder.encode("OldPass123!"))
                .build();
        user = userRepository.save(user);
        User other = User.builder()
                .email("other@example.com")
                .firstName("Jill")
                .lastName("Smith")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .build();
        userRepository.save(other);
    }

    @Nested
    @DisplayName("POST /api/auth/register")
    class RegisterTests {

        @Test
        @DisplayName("Returns 201 Created with user data on success")
        public void success() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.message").value("User registered successfully"))
                    .andExpect(jsonPath("$.data.email").value(request.getEmail()))
                    .andExpect(jsonPath("$.data.firstName").value(request.getFirstName()))
                    .andExpect(jsonPath("$.data.lastName").value(request.getLastName()));
        }

        @Test
        @DisplayName("Returns 201 Created with boundary user data on success")
        public void successAtBoundary() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Pass123!");
            request.setPasswordConfirm("Pass123!");
            request.setFirstName("J".repeat(100));
            request.setLastName("D".repeat(100));
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.message").value("User registered successfully"))
                    .andExpect(jsonPath("$.data.email").value(request.getEmail()))
                    .andExpect(jsonPath("$.data.firstName").value(request.getFirstName()))
                    .andExpect(jsonPath("$.data.lastName").value(request.getLastName()));
        }

        @Test
        @DisplayName("Returns 400 Bad Request with mismatching passwords")
        public void mismatchingPasswords() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("OnePassword1!");
            request.setPasswordConfirm("OtherPassword1!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Passwords do not match"))
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.error").value("Password Mismatch"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when email null")
        public void emailNull() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail(null);
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when email blank")
        public void emailBlank() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when email invalid")
        public void emailInvalid() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("invalid");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Invalid email format"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password null")
        public void passwordNull() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword(null);
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password").value("Password is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password blank")
        public void passwordBlank() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password").value(anyOf(
                            containsString("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"),
                            containsString("Password is required"))));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password doesn't have any capital letters")
        public void passwordNoCaps() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("pass123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password doesn't have any lowercase letters")
        public void passwordNoLowers() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("PASS123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password doesn't have any digits")
        public void passwordNoDigits() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password doesn't have any special characters")
        public void passwordNoSpecialChars() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Pass1234");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password is too short")
        public void passwordTooShort() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("pass1!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.password")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password confirm null")
        public void passwordConfirmNull() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm(null);
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.passwordConfirm")
                            .value("Password confirmation is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when password confirm blank")
        public void passwordConfirmBlank() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("");
            request.setFirstName("John");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.passwordConfirm")
                            .value("Password confirmation is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when first name null")
        public void firstNameNull() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName(null);
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName")
                            .value("First name is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when first name blank")
        public void firstNameBlank() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("");
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName")
                            .value("First name is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when first name too long")
        public void firstNameTooLong() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("a".repeat(101));
            request.setLastName("Doe");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName")
                            .value("First name cannot exceed 100 characters"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when last name null")
        public void lastNameNull() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName(null);
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName")
                            .value("Last name is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when last name blank")
        public void lastNameBlank() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName")
                            .value("Last name is required"));
        }

        @Test
        @DisplayName("Returns 400 Bad Request when last name too long")
        public void lastNameTooLong() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test-register-" + System.currentTimeMillis() + "@example.com");
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("John");
            request.setLastName("a".repeat(101));
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName")
                            .value("Last name cannot exceed 100 characters"));
        }

        @Test
        @DisplayName("Returns 409 Conflict when email already exists")
        public void duplicateEmail() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setEmail(user.getEmail());
            request.setPassword("Password123!");
            request.setPasswordConfirm("Password123!");
            request.setFirstName("Existing");
            request.setLastName("User");
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL + "/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.message").value(containsString("Email already registered: " + user.getEmail())))
                    .andExpect(jsonPath("$.error").value("Duplicate Resource"));

        }
    }

    @Nested
    @DisplayName("PUT /api/auth/change-password")
    class ChangePasswordTests {

        @Test
        @WithMockUser(username = "owner@example.com", roles = "USER")
        @DisplayName("Returns 200 OK when password changed successfully")
        public void success() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Password changed successfully"));
        }

        @Test
        @WithMockUser(username = "owner@example.com", roles = "USER")
        @DisplayName("Returns 400 Bad Request when passwords don't match")
        public void passwordMismatch() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("OtherPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("New passwords do not match"))
                    .andExpect(jsonPath("$.error").value("Password Mismatch"));
        }

        @Test
        @WithMockUser(username = "owner@example.com", roles = "USER")
        @DisplayName("Returns 400 Bad Request when old password incorrect")
        public void incorrectOldPassword() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("Incorrect123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Old password is incorrect"))
                    .andExpect(jsonPath("$.error").value("Password Mismatch"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when user ID null")
        public void userIdNull() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(null)
                    .oldPassword("Incorrect123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.userId").value("User ID is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when old password null")
        public void oldPasswordNull() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword(null)
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.oldPassword").value("Old password is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when old password blank")
        public void oldPasswordBlank() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.oldPassword").value("Old password is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password null")
        public void newPasswordNull() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword(null)
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword").value("New password is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password blank")
        public void newPasswordBlank() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword").value(anyOf(
                            containsString("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"),
                            containsString("New password is required"))));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password missing capital letter")
        public void newPasswordMissingCapital() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("pass123!")
                    .newPasswordConfirm("pass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password missing lowercase letter")
        public void newPasswordMissingLowercase() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("PASS123!")
                    .newPasswordConfirm("PASS123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password missing digit")
        public void newPasswordMissingDigit() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("Password!")
                    .newPasswordConfirm("Password!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password missing special character")
        public void newPasswordMissingSpecialChar() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("Pass1234")
                    .newPasswordConfirm("Pass1234")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password too short")
        public void newPasswordTooShort() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("pass1!")
                    .newPasswordConfirm("pass1!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPassword")
                            .value("Password must contain one capital letter, one lowercase letter, one number, " +
                                    "one special character, and at least 8 characters in length"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password confirm null")
        public void newPasswordConfirmNull() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm(null)
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPasswordConfirm").value("Password confirmation is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when new password confirm blank")
        public void newPasswordConfirmBlank() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.newPasswordConfirm").value("Password confirmation is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 404 Not Found")
        public void notFound() throws Exception {
            Long userId = 9999L;
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(userId)
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("User not found with ID: " + userId));
        }

        @Test
        @WithMockUser(username = "other@example.com", roles = "USER")
        @DisplayName("Returns 403 Forbidden when trying to change another user's password")
        public void notOwnerThrowsForbidden() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("OldPass123!")
                    .newPassword("NewPass123!")
                    .newPasswordConfirm("NewPass123!")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser
        @DisplayName("Returns 400 Bad Request when validation fails")
        public void validationFails() throws Exception {
            PasswordChangeRequest request = PasswordChangeRequest.builder()
                    .userId(user.getId())
                    .oldPassword("")
                    .newPassword("short")
                    .newPasswordConfirm("short")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/change-password")
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("GET /api/auth/reset-password/{userId}")
    class ResetPasswordTests {

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 200 OK with generated password when admin")
        public void adminSuccess() throws Exception {
            mockMvc.perform(get(BASE_URL + "/reset-password/{userId}", user.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Password reset successfully"))
                    .andExpect(jsonPath("$.data").isString())
                    .andExpect(jsonPath("$.data")
                            .value(matchesPattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 404 Not Found")
        public void notFound() throws Exception {
            Long userId = 9999L;
            mockMvc.perform(get(BASE_URL + "/reset-password/{userId}", userId)
                            .with(csrf()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("User not found with ID: " + userId));
        }

        @Test
        @WithMockUser(roles = "USER")
        @DisplayName("Returns 403 Forbidden when user is not admin")
        public void notAdminForbidden() throws Exception {
            mockMvc.perform(get(BASE_URL + "/reset-password/{userId}", user.getId()))
                    .andExpect(status().isForbidden());
        }
    }
}
