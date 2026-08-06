package com.dmerc12.api.security;

import com.dmerc12.api.entity.Role;
import com.dmerc12.api.entity.User;
import com.dmerc12.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

/**
 * Implementation of Spring Security's {@link UserDetailsService} that loads user details from the database
 * using {@link UserRepository}.
 * <p>Used by the authentication provider and the JWT filter to build {@link UserDetails} objects for authentication.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads a user by email (which is the username in this application).
     *
     * @param email the user's email
     * @return a {@link UserDetails} object containing the user's credentials and authorities
     * @throws UsernameNotFoundException if the user is not found
     */
    @NonNull
    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        log.debug("User loaded: {}, roles: {}", user.getEmail(), user.getRoles());
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(user.getRoles().stream()
                        .map(Role::name)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList()))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isEnabled())
                .build();
    }
}
