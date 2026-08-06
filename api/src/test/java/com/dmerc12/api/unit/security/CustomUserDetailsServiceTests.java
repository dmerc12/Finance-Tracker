package com.dmerc12.api.unit.security;

import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.repository.UserRepository;
import com.dmerc12.api.security.CustomUserDetailsService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link CustomUserDetailsService}.
 * <p>Verifies that the service correctly loads user details from the repository.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Custom User Details Service Tests")
public class CustomUserDetailsServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService service;

    @Test
    @DisplayName("Load user by email - success")
    public void loadUserByUsernameSuccess() {
        User user = User.builder()
                .email("test@example.com")
                .passwordHash("hashed")
                .firstName("John")
                .lastName("Doe")
                .roles(Set.of(Role.ROLE_USER))
                .enabled(true)
                .build();
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        UserDetails details = service.loadUserByUsername("test@example.com");
        assertThat(details.getUsername()).isEqualTo("test@example.com");
        assertThat(details.getPassword()).isEqualTo("hashed");
        assertThat(details.getAuthorities()).hasSize(1);
        assertThat(details.isEnabled()).isTrue();
    }

    @Test
    @DisplayName("Load user by email - not found")
    public void loadUserByUsernameNotFound() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.loadUserByUsername("unknown@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}
