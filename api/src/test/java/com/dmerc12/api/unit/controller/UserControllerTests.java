package com.dmerc12.api.unit.controller;

import com.dmerc12.api.controller.UserController;
import com.dmerc12.api.dto.ResponseDTO;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link UserController}.
 * <p>Verifies CRUD endpoints logic without loading Spring context.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("User Controller Unit Tests")
public class UserControllerTests {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private static final Long USER_ID = 1L;

    @Nested
    @DisplayName("GET /api/users/{id}")
    class GetUserTests {

        @Test
        @DisplayName("Returns 200 OK with user data")
        public void success() {
           UserDTO userDTO = UserDTO.builder()
                   .id(USER_ID)
                   .email("user@example.com")
                   .firstName("John")
                   .lastName("Doe")
                   .build();
           when(userService.getUser(USER_ID)).thenReturn(userDTO);
           ResponseEntity<ResponseDTO<UserDTO>> response = userController.getUser(USER_ID);
           assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
           assertThat(response.getBody()).isNotNull();
           assertThat(response.getBody().getMessage()).isEqualTo("User retrieved successfully");
           assertThat(response.getBody().getData()).isEqualTo(userDTO);
           verify(userService).getUser(USER_ID);
        }
    }

    @Nested
    @DisplayName("GET /api/users")
    class GetUsersTests {

        @Test
        @DisplayName("Returns 200 OK with list of users")
        public void success() {
            List<UserDTO> users = List.of(
                    UserDTO.builder().id(1L).email("user1@example.com").build(),
                    UserDTO.builder().id(2L).email("user2@example.com").build()
            );
            when(userService.getUsers()).thenReturn(users);
            ResponseEntity<ResponseDTO<List<UserDTO>>> response = userController.getUsers();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Users retrieved successfully");
            assertThat(response.getBody().getData()).hasSize(2);
            verify(userService).getUsers();
        }
    }

    @Nested
    @DisplayName("POST /api/users")
    class CreateUserTests {

        @Test
        @DisplayName("Returns 200 OK with generated password")
        public void success() {
            UserDTO request = UserDTO.builder()
                    .email("newuser@example.com")
                    .firstName("New")
                    .lastName("User")
                    .build();
            String generatedPassword = "GeneratedPass1!";
            when(userService.createUser(any(UserDTO.class))).thenReturn(generatedPassword);
            ResponseEntity<ResponseDTO<String>> response = userController.createUser(request);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("Created user successfully");
            assertThat(response.getBody().getData()).isEqualTo(generatedPassword);
            verify(userService).createUser(request);
        }
    }

    @Nested
    @DisplayName("PUT /api/users/{id}")
    class UpdateUserTests {

        @Test
        @DisplayName("Returns 200 OK with updated user")
        public void success() {
            UserDTO request = UserDTO.builder()
                    .email("updated@example.com")
                    .firstName("Updated")
                    .lastName("Name")
                    .build();
            UserDTO updatedUser = UserDTO.builder()
                    .id(USER_ID)
                    .email("updated@example.com")
                    .firstName("Updated")
                    .lastName("Name")
                    .build();
            when(userService.updateUser(any(UserDTO.class))).thenReturn(updatedUser);
            ResponseEntity<ResponseDTO<UserDTO>> response = userController.updateUser(USER_ID, request);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("User updated successfully");
            assertThat(response.getBody().getData()).isEqualTo(updatedUser);
            verify(userService).updateUser(any(UserDTO.class));
        }
    }

    @Nested
    @DisplayName("DELETE /api/users/{id}")
    class DeleteUserTests {

        @Test
        @DisplayName("Returns 200 OK when user is deleted")
        public void success() {
            doNothing().when(userService).deleteUser(USER_ID);
            ResponseEntity<ResponseDTO<Void>> response = userController.deleteUser(USER_ID);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getMessage()).isEqualTo("User deleted successfully");
            assertThat(response.getBody().getData()).isNull();
            verify(userService).deleteUser(USER_ID);
        }
    }
}
