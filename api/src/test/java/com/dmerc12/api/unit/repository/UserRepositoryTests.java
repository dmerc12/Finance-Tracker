package com.dmerc12.api.unit.repository;

import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link UserRepository}.
 * <p>These tests verify the behavior of custom query methods defined in the repository
 * interface, particularly {@link UserRepository#findByEmail(String)}.
 * <p>Tests only the repository layer
 * <p><b>Test scenarios covered:</b>
 * <ul>
 *     <li>Successfully finding a user by email</li>
 *     <li>Handling non-existent email (returns empty Optional)</li>
 * </ul>
 *
 * @see UserRepository
 * @see DataJpaTest
 */
@DataJpaTest
@ActiveProfiles("test")
@DisplayName("User Repository Unit Tests")
public class UserRepositoryTests {

    @Autowired
    private UserRepository repository;

    @Nested
    @DisplayName("findByEmail Tests")
    class findByEmailTests {
        @Test
        @DisplayName("Returns user when exists")
        public void returnsUserWhenExists() {
            User user = User.builder()
                    .email("test@email.com")
                    .passwordHash("hash")
                    .firstName("John")
                    .lastName("Doe")
                    .roles(Set.of(Role.ROLE_USER))
                    .build();
            repository.save(user);
            Optional<User> found = repository.findByEmail(user.getEmail());
            assertThat(found).isPresent();
            assertThat(found.get().getEmail()).isEqualTo(user.getEmail());
        }

        @Test
        @DisplayName("Returns empty when user does not exist")
        public void returnsEmptyWhenNotFound() {
            Optional<User> found = repository.findByEmail("nonexistent@email.com");
            assertThat(found).isEmpty();
        }
    }
}
