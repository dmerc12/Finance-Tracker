package com.dmerc12.api.unit.security;

import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.exception.ResourceNotFoundException;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.security.SecurityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link SecurityService}.
 * <p>Verifies that the ownership and role checks work correctly in all scenarios:
 * <ul>
 *     <li><b>isOwnerOrAdmin:</b> returns {@code true} for the owner or an admin,
 *     {@code false} otherwise, handles {@code null} authentication gracefully,
 *     and throws {@link ResourceNotFoundException} when the target user is missing.</li>
 *     <li><b>getCurrentUserId:</b> returns the ID of the authenticated user, or
 *     throws {@link AccessDeniedException} when not authenticated or the user is not found.</li>
 * </ul>
 * <p>Uses Mockito to mock dependencies and simulate various authentication states.
 *
 * @see SecurityService
 * @see Authentication
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Security Service Unit Tests")
public class SecurityServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SecurityService securityService;

    private User targetUser;

    @BeforeEach
    public void setUp() {
        targetUser = User.builder()
                .id(1L)
                .email("owner@example.com")
                .passwordHash("hash")
                .firstName("Owner")
                .lastName("User")
                .roles(Set.of(Role.ROLE_USER))
                .build();
    }

    @Nested
    @DisplayName("isOwnerOrAdmin Tests")
    class IsOwnerOrAdminTests {
        @Test
        @DisplayName("Returns true when user is owner")
        public void ownerReturnsTrue() {
            when(authentication.getName()).thenReturn("owner@example.com");
            when(userRepository.findById(1L)).thenReturn(Optional.of(targetUser));
            boolean result = securityService.isOwnerOrAdmin(1L, authentication);
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("Returns true when user is admin")
        public void adminReturnsTrue() {
            when(authentication.getName()).thenReturn("admin@example.com");
            when(userRepository.findById(1L)).thenReturn(Optional.of(targetUser));
            doReturn(Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")))
                    .when(authentication).getAuthorities();
            boolean result = securityService.isOwnerOrAdmin(1L, authentication);
            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("Returns false when not owner and not admin")
        public void neitherReturnsFalse() {
            when(authentication.getName()).thenReturn("other@example.com");
            when(userRepository.findById(1L)).thenReturn(Optional.of(targetUser));
            when(authentication.getAuthorities()).thenReturn(List.of());
            boolean result = securityService.isOwnerOrAdmin(1L, authentication);
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("Throws ResourceNotFoundException when user not found")
        public void userNotFoundThrowsException() {
            when(authentication.getName()).thenReturn("owner@example.com");
            when(userRepository.findById(999L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> securityService.isOwnerOrAdmin(999L, authentication))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("User not found");
        }

        @Test
        @DisplayName("Returns false when authentication is null")
        public void authenticationNullReturnsFalse() {
            boolean result = securityService.isOwnerOrAdmin(1L, null);
            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("Returns false when authentication name is null")
        public void authenticationNameNullReturnsFalse() {
            when(authentication.getName()).thenReturn(null);
            boolean result = securityService.isOwnerOrAdmin(1L, authentication);
            assertThat(result).isFalse();
        }
    }

    @Nested
    @DisplayName("getCurrentUserId Tests")
    class GetCurrentUserIdTests {
        @Test
        @DisplayName("Returns user ID when authenticated")
        public void success() {
            when(authentication.getName()).thenReturn("owner@example.com");
            when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(targetUser));
            Long result = securityService.getCurrentUserId(authentication);
            assertThat(result).isEqualTo(1L);
        }

        @Test
        @DisplayName("Throws AccessDeniedException when not authenticated")
        public void notAuthenticatedThrowsException() {
            when(authentication.getName()).thenReturn(null);
            assertThatThrownBy(() -> securityService.getCurrentUserId(authentication))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("Not authenticated");
        }

        @Test
        @DisplayName("Throws AccessDeniedException when user not found")
        public void userNotFoundThrowsException() {
            when(authentication.getName()).thenReturn("unknown@example.com");
            when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());
            assertThatThrownBy(() -> securityService.getCurrentUserId(authentication))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("Authenticated user not found");
        }

        @Test
        @DisplayName("Throws AccessDeniedException when authentication is null")
        public void authenticationNullThrowsException() {
            assertThatThrownBy(() -> securityService.getCurrentUserId(null))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("Not authenticated");
        }
    }
}
