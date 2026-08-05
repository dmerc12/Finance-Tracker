package com.dmerc12.api.integration;

import com.dmerc12.api.controller.UserController;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full-stack integration tests for {@link UserController}.
 * <p>Tests the user management endpoints against a real PostgreSQL database
 * (via Testcontainers) with a fully loaded Spring context.
 * <p><b>Coverage:</b>
 * <ul>
 *     <li>GET /users/{id} - ownership and admin access</li>
 *     <li>GET /users - admin only</li>
 *     <li>POST /users - admin only, returns generated password</li>
 *     <li>PUT /users/{id} - ownership and admin updates</li>
 *     <li>DELETE /users/{id} - ownership and admin deletion</li>
 * </ul>
 *
 * @see UserController
 * @see UserDTO
 */
@DisplayName("User Management Integration Tests")
public class UserTests extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private User otherUser;

    private static final String BASE_URL = "/api/users";

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        user = User.builder()
                .email("owner@example.com")
                .firstName("Bill")
                .lastName("Johnson")
                .passwordHash("hashedPassword")
                .build();
        user = userRepository.save(user);
        otherUser = User.builder()
                .email("other@example.com")
                .firstName("Jill")
                .lastName("Smith")
                .passwordHash("hashedPassword")
                .build();
        otherUser = userRepository.save(otherUser);
    }

    @Nested
    @DisplayName("GET /api/users/{userId}")
    class GetUserTests {

        @Test
        @WithMockUser(username = "owner@example.com", roles = "USER")
        @DisplayName("Returns user when owner")
        public void ownerSuccess() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{userId}", user.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(user.getId()));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns user when admin")
        public void adminSuccess() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{userId}", user.getId()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.id").value(user.getId()));
        }

        @Test
        @WithMockUser(username = "other@example.com", roles = "USER")
        @DisplayName("Returns 403 Forbidden when not owner and not admin")
        public void forbidden() throws Exception {
            mockMvc.perform(get(BASE_URL + "/{userId}", user.getId()))
                    .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 404 Not Found when user does not exist")
        public void notFound() throws Exception {
            Long nonExistentId = 9999L;
            mockMvc.perform(get(BASE_URL + "/{userId}", nonExistentId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value(containsString("User not found")));
        }
    }

    @Nested
    @DisplayName("GET /api/users")
    class GetAllUsersTests {

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns list of users when admin")
        public void adminSuccess() throws Exception {
            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data").isArray());
        }

        @Test
        @WithMockUser(roles = "USER")
        @DisplayName("Returns 403 Forbidden when not admin")
        public void notAdminForbidden() throws Exception {
            mockMvc.perform(get(BASE_URL))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("POST /api/users")
    class CreateUserTests {

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Creates user and returns generated password")
        public void adminSuccess() throws Exception {
            UserDTO request = UserDTO.builder()
                            .email("new.user-" + System.currentTimeMillis() + "@example.com")
                            .firstName("New")
                            .lastName("User")
                            .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Created user successfully"))
                    .andExpect(jsonPath("$.data").isString())
                    .andExpect(jsonPath("$.data")
                            .value(matchesPattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Creates user and returns generated password with boundary conditions")
        public void boundarySuccess() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName("N".repeat(100))
                    .lastName("U".repeat(100))
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Created user successfully"))
                    .andExpect(jsonPath("$.data").isString())
                    .andExpect(jsonPath("$.data")
                            .value(matchesPattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with null email")
        public void nullEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email(null)
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with blank email")
        public void blankEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("")
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with invalid email")
        public void invalidEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("invalid")
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Invalid email format"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with null first name")
        public void nullFirstName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName(null)
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName").value("First name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with blank first name")
        public void blankFirstName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName("")
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName").value("First name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with first name too long")
        public void firstNameTooLong() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName("J".repeat(101))
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName").value("First name cannot exceed 100 characters"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with null last name")
        public void nullLastName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName("John")
                    .lastName(null)
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with blank last name")
        public void blankLastName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName("John")
                    .lastName("")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request with last name too long")
        public void lastNameTooLong() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("new.user-" + System.currentTimeMillis() + "@example.com")
                    .firstName("John")
                    .lastName("D".repeat(101))
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name cannot exceed 100 characters"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 409 Conflict with duplicate email")
        public void duplicateEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email(user.getEmail())
                    .firstName("John")
                    .lastName("Doe")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Email already registered: " + user.getEmail()))
                    .andExpect(jsonPath("$.error").value("Duplicate Resource"));
        }

        @Test
        @WithMockUser(roles = "USER")
        @DisplayName("Returns 403 Forbidden when not admin")
        public void notAdminForbidden() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("newuser@example.com")
                    .firstName("New")
                    .lastName("User")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser(roles = "USER")
        @DisplayName("Returns 400 Bad Request when validation fails")
        public void validationFails() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("invalid")
                    .firstName("")
                    .lastName("")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(post(BASE_URL)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("PUT /api/users/{userId}")
    class UpdateUserTests {

        @Test
        @WithMockUser(username = "owner@example.com", roles = "USER")
        @DisplayName("Updates user when owner")
        public void ownerSuccess() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated-owner@example.com")
                    .firstName("Updated")
                    .lastName("Owner")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", user.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.email").value(request.getEmail()));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Updates user when admin")
        public void adminSuccess() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated-by-admin@example.com")
                    .firstName("Admin")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.email").value(request.getEmail()));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when email null")
        public void nullEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email(null)
                    .firstName("Admin")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when email blank")
        public void blankEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("")
                    .firstName("Admin")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Email is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when email invalid")
        public void invalidEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("invalid")
                    .firstName("Admin")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.email").value("Invalid email format"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when first name null")
        public void nullFirstName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName(null)
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName").value("First name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when first name blank")
        public void blankFirstName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName("")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName").value("First name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when first name too long")
        public void firstNameTooLong() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName("U".repeat(101))
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.firstName").value("First name cannot exceed 100 characters"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when last name null")
        public void nullLastName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName("Update")
                    .lastName(null)
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when last name blank")
        public void blankLastName() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName("Update")
                    .lastName("")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name is required"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 400 Bad Request when last name too long")
        public void lastNameTooLong() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName("Update")
                    .lastName("U".repeat(101))
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Invalid request payload"))
                    .andExpect(jsonPath("$.error").value("Validation Failed"))
                    .andExpect(jsonPath("$.fieldErrors.lastName").value("Last name cannot exceed 100 characters"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Duplicate email throws Exception")
        public void duplicateEmail() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email(user.getEmail())
                    .firstName("Duplicate")
                    .lastName("Email")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.message").value("Email already registered: " + user.getEmail()))
                    .andExpect(jsonPath("$.error").value("Duplicate Resource"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Updates user when duplicate email belongs to user")
        public void duplicateEmailSuccess() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email(otherUser.getEmail())
                    .firstName("Admin")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", otherUser.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.email").value(request.getEmail()));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 404 Not Found")
        public void notFound() throws Exception {
            Long userId = 9999L;
            UserDTO request = UserDTO.builder()
                    .email(otherUser.getEmail())
                    .firstName("Admin")
                    .lastName("Update")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", userId)
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("User not found with ID: " + userId));
        }

        @Test
        @WithMockUser(username = "other@example.com", roles = "USER")
        @DisplayName("Returns 403 Forbidden when not owner and not admin")
        public void forbidden() throws Exception {
            UserDTO request = UserDTO.builder()
                    .email("hacker@example.com")
                    .firstName("Hack")
                    .lastName("Er")
                    .build();
            ObjectMapper mapper = new ObjectMapper();
            mockMvc.perform(put(BASE_URL + "/{userId}", user.getId())
                            .with(csrf())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(mapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("DELETE /api/users/{userId}")
    class DeleteUserTests {

        @Test
        @WithMockUser(username = "owner@example.com", roles = "USER")
        @DisplayName("Deletes user when owner")
        public void ownerSuccess() throws Exception {
            mockMvc.perform(delete(BASE_URL + "/{userId}", user.getId())
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("User deleted successfully"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Deletes user when admin")
        public void adminSuccess() throws Exception {
            mockMvc.perform(delete(BASE_URL + "/{userId}", user.getId())
                            .with(csrf()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("User deleted successfully"));
        }

        @Test
        @WithMockUser(roles = "ADMIN")
        @DisplayName("Returns 404 Not Found")
        public void notFound() throws Exception {
            Long userId = 9999L;
            mockMvc.perform(delete(BASE_URL + "/{userId}", userId)
                            .with(csrf()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message").value("User not found with ID: " + userId));
        }

        @Test
        @WithMockUser(username = "other@example.com", roles = "USER")
        @DisplayName("Returns 403 Forbidden when not owner and not admin")
        public void forbidden() throws Exception {
            mockMvc.perform(delete(BASE_URL + "/{userId}", user.getId())
                            .with(csrf()))
                    .andExpect(status().isForbidden());
        }
    }
}
