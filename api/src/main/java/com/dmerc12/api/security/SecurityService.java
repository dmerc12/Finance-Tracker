package com.dmerc12.api.security;

import com.dmerc12.api.entity.User;
import com.dmerc12.api.exception.ResourceNotFoundException;
import com.dmerc12.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

/**
 * Security utility for ownership and role checks.
 * <p>Used in controllers with {@code @PreAuthorize} to verify that the authenticated
 * user is either the owner of the resource or has an admin role.
 */
@Component
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;

    /**
     * Checks whether the authenticated user is the owner of the given user ID
     * or has the {@code ROLE_ADMIN} authority.
     *
     * @param userId the ID of the user being accessed
     * @param authentication the current authentication object
     * @return {@code true} if the user is the owner or an admin
     * @throws ResourceNotFoundException if the target does not exist
     */
    public boolean isOwnerOrAdmin(Long userId, Authentication authentication) {
        if (authentication == null || authentication.getName() == null)  {
            return false;
        }
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        boolean isOwner = targetUser.getEmail().equalsIgnoreCase(authentication.getName());
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        return isOwner || isAdmin;
    }

    /**
     * Retrieves the currently authenticated user's ID.
     *
     * @param authentication the current authentication object
     * @return the user ID
     * @throws AccessDeniedException if not authenticated or user not found
     */
    public Long getCurrentUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Not authenticated");
        }
        return userRepository.findByEmail(authentication.getName())
                .map(User::getId)
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }
}
