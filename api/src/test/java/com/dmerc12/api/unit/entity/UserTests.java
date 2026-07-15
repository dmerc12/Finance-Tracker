package com.dmerc12.api.unit.entity;

import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("User Entity Unit Tests")
public class UserTests {

    @Autowired
    private TestEntityManager entityManager;

    @BeforeEach
    public void setup() {
        entityManager.flush();
        entityManager.clear();
    }

    private User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setFirstName("test");
        user.setLastName("user");
        user.setPasswordHash("password-hash");
        return user;
    }

    @Nested
    @DisplayName("Column Mappings & Constraints")
    class ColumnMappingAndConstraintsTests {
        @Test
        @DisplayName("Email is required")
        public void emailIsRequired() {
            User user = createUser(null);
            assertThrows(
                    ConstraintViolationException.class,
                    () -> entityManager.persistAndFlush(user)
            );
        }

        @Test
        @DisplayName("Email must be unique")
        public void emailMustBeUnique() {
            User user1 = createUser("test@email.com");
            assertDoesNotThrow(
                    () -> entityManager.persistAndFlush(user1)
            );
            User user2 = createUser(null);
            assertThrows(
                    ConstraintViolationException.class,
                    () -> entityManager.persistAndFlush(user2)
            );
        }

        @Test
        @DisplayName("Password hash is required")
        public void passwordHashIsRequired() {
            User user = createUser("test@email.com");
            user.setPasswordHash(null);
            assertThrows(
                    ConstraintViolationException.class,
                    () -> entityManager.persistAndFlush(user)
            );
        }
    }

    @Nested
    @DisplayName("Default Values")
    class DefaultValuesTests {
        @Test
        @DisplayName("Enabled defaults to true")
        public void enabledDefaultsToTrue() {
            User user = createUser("test@email.com");
            assertTrue(user.isEnabled());
        }
    }

    @Nested
    @DisplayName("Role Handling (@ElementCollection)")
    class RoleHandlingTests {
        @Test
        @DisplayName("Roles are initially empty")
        public void rolesAreInitiallyEmpty() {
            User user = createUser("test@email.com");
            assertNotNull(user.getRoles());
            assertTrue(user.getRoles().isEmpty());
        }

        @Test
        @DisplayName("Add a single role")
        public void addSingleRole() {
            User user = createUser("test@email.com");
            user.getRoles().add(Role.ROLE_USER);
            entityManager.persistAndFlush(user);
            entityManager.clear();
            User found = entityManager.find(User.class, user.getId());
            assertNotNull(found);
            assertNotNull(found.getRoles());
            assertEquals(1, found.getRoles().size());
            assertTrue(found.getRoles().contains(Role.ROLE_USER));
        }

        @Test
        @DisplayName("Add multiple roles")
        public void addMultipleRoles() {
            User user = createUser("test@email.com");
            user.getRoles().add(Role.ROLE_USER);
            user.getRoles().add(Role.ROLE_ADMIN);
            entityManager.persistAndFlush(user);
            entityManager.clear();
            User found = entityManager.find(User.class, user.getId());
            assertNotNull(found);
            assertNotNull(found.getRoles());
            assertEquals(2, found.getRoles().size());
            assertTrue(found.getRoles().contains(Role.ROLE_USER));
            assertTrue(found.getRoles().contains(Role.ROLE_ADMIN));
        }

        @Test
        @DisplayName("Remove a role")
        public void removeRole() {
            User user = createUser("test@email.com");
            user.getRoles().add(Role.ROLE_USER);
            user.getRoles().add(Role.ROLE_ADMIN);
            entityManager.persistAndFlush(user);
            entityManager.clear();
            User found = entityManager.find(User.class, user.getId());
            assertNotNull(found);
            assertNotNull(found.getRoles());
            assertEquals(2, found.getRoles().size());
            assertTrue(found.getRoles().contains(Role.ROLE_USER));
            assertTrue(found.getRoles().contains(Role.ROLE_ADMIN));
            found.getRoles().remove(Role.ROLE_ADMIN);
            entityManager.persistAndFlush(found);
            entityManager.clear();
            User updated = entityManager.find(User.class, user.getId());
            assertNotNull(updated);
            assertNotNull(updated.getRoles());
            assertEquals(1, updated.getRoles().size());
            assertTrue(updated.getRoles().contains(Role.ROLE_USER));
            assertFalse(found.getRoles().contains(Role.ROLE_ADMIN));
        }

        @Test
        @DisplayName("Role uniqueness")
        public void roleUniqueness() {
            User user = createUser("test@email.com");
            user.getRoles().add(Role.ROLE_USER);
            user.getRoles().add(Role.ROLE_USER);
            entityManager.persistAndFlush(user);
            entityManager.clear();
            User found = entityManager.find(User.class, user.getId());
            assertNotNull(found);
            assertNotNull(found.getRoles());
            assertEquals(1, found.getRoles().size());
            assertTrue(found.getRoles().contains(Role.ROLE_USER));
        }

        @Test
        @DisplayName("Role enum values are stored as strings")
        public void roleEnumValuesAreStoredAsStrings() {
            User user = createUser("test@email.com");
            user.getRoles().add(Role.ROLE_USER);
            entityManager.persistAndFlush(user);
            String storedRole = (String) entityManager
                    .getEntityManager()
                    .createNativeQuery("SELECT roles FROM user_roles WHERE user_id = :id")
                    .setParameter("id", user.getId())
                    .getSingleResult();
            assertEquals("ROLE_USER", storedRole);
        }

        @Test
        @DisplayName("Eager fetching")
        public void eagerFetching() {
            User user = createUser("test@email.com");
            user.getRoles().add(Role.ROLE_USER);
            entityManager.persistAndFlush(user);
            entityManager.clear();
            User found = entityManager.find(User.class, user.getId());
            assertNotNull(found);
            assertNotNull(found.getRoles());
            assertFalse(found.getRoles().isEmpty());
        }
    }

    @Nested
    @DisplayName("Optional Fields")
    class OptionalFieldsTests {
        @Test
        @DisplayName("firstName and lastName can be null")
        public void firstNameAndLastNameCanBeNull() {
            User user = createUser("test@email.com");
            user.setFirstName(null);
            user.setLastName(null);
            entityManager.persist(user);
            entityManager.flush();
            entityManager.clear();
            User found = entityManager.find(User.class, user.getId());
            assertNotNull(found);
            assertNull(found.getFirstName());
            assertNull(found.getLastName());
        }
    }
}
