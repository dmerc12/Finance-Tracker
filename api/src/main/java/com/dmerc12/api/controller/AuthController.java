package com.dmerc12.api.controller;

import com.dmerc12.api.dto.PasswordChangeRequest;
import com.dmerc12.api.dto.RegisterRequest;
import com.dmerc12.api.dto.ResponseDTO;
import com.dmerc12.api.dto.UserDTO;
import com.dmerc12.api.exception.InvalidTokenException;
import com.dmerc12.api.exception.ResourceNotFoundException;
import com.dmerc12.api.security.SecurityService;
import com.dmerc12.api.service.AuthService;
import com.dmerc12.api.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

/**
 * REST controller for authentication and user account management endpoints.
 * <p>Provides endpoints for:
 * <ul>
 *     <li><b>Registration:</b> {@code POST /api/auth/register}</li>
 *     <li><b>Password change:</b> {@code PUT /api/auth/change-password}</li>
 *     <li><b>Admin password reset:</b> {@code GET /api/auth/reset-password}</li>
 * </ul>
 * All endpoints return responses wrapped in a consistent {@link ResponseDTO} structure.
 * <p><b>Security:</b>
 * <ul>
 *     <li>Registration is public.</li>
 *     <li>Password change requires authentication (owner or admin).</li>
 *     <li>Password reset is restricted to admins.</li>
 * </ul>
 *
 * @see UserService
 * @see ResponseDTO
 * @see SecurityService
 */
@Slf4j
@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final SecurityService securityService;

    /**
     * Registers a new user.
     * <p>Accepts a validated {@link RegisterRequest}, creates a user account with the
     * default {@code ROLE_USER}, and returns the created user details.
     *
     * @param request the registration DTO (validated via {@code @Valid})
     * @return {@code 201 Created} with a success response containing the user DTO
     */
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO<UserDTO>> registerUser(@Valid @RequestBody RegisterRequest request) {
        log.debug("Registering new user with email: {}", request.getEmail());
        UserDTO user = userService.registerUser(request);
        log.info("Created user with ID: {} and email: {}", user.getId(), user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(ResponseDTO.success("User registered successfully", user));
    }

    /**
     * Changes the authenticated user's password.
     * <p>Requires the user to be authenticated and either be the owner of the account
     * or have the {@code ROLE_ADMIN} authority. The old password is validated,
     * and the new password is hashed before storage.
     *
     * @param request the password change DTO (validated via {@code @Valid})
     * @param authentication the current authentication context (injected by Spring)
     * @return {@code 200 OK} with a success message
     * @throws AccessDeniedException if the user is not the owner and not admin
     */
    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ResponseDTO<Void>> changePassword(
            @Valid @RequestBody PasswordChangeRequest request,
            Authentication authentication) {
        // Ensure the user is changing their own password (or is admin)
        if (!securityService.isOwnerOrAdmin(request.getUserId(), authentication)) {
            log.warn("Unauthorized password change attempt for user ID: {}", request.getUserId());
            throw new AccessDeniedException("You can only change your own password");
        }
        userService.changePassword(request);
        log.info("Password changed for user ID: {}", request.getUserId());
        return ResponseEntity.ok(ResponseDTO.success("Password changed successfully", null));
    }

    /**
     * Resets a user's password (admin only).
     * <p>Generates a new secure random password, hashes it, updates the user record,
     * and returns the plain-text password to the admin (to be communicated securely).
     *
     * @param userId the ID of the user whose password is being reset
     * @return {@code 200 OK} with a success response containing the new password
     * @throws ResourceNotFoundException if the user does not exist
     */
    @PostMapping("/reset-password/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDTO<String>> resetPassword(
            @PathVariable Long userId) {
        String password = userService.resetPassword(userId);
        log.info("Reset password for user ID: {}", userId);
        return ResponseEntity.ok(ResponseDTO.success("Password reset successfully", password));
    }

    /**
     * Refreshes an expired access token using a valid refresh token.
     * <p>The refresh token is expected in the {@code refresh_token} cookie or in the
     * {@code Authorization} header as a Bearer token.
     *
     * @param request the HTTP request
     * @return a new access token wrapped in a {@link ResponseDTO}
     * @throws InvalidTokenException if the refresh token is missing, invalid, or expired
     */
    @PostMapping("/refresh")
    public ResponseEntity<ResponseDTO<String>> refreshToken(HttpServletRequest request) {
        String refreshToken = extractRefreshToken(request);
        log.debug("Refresh token extracted: {}", refreshToken != null ? "present" : "missing");
        try {
            String newAccessToken = authService.refreshAccessToken(refreshToken);
            log.info("Access token refreshed successfully");
            return ResponseEntity.ok(ResponseDTO.success("Token refreshed", newAccessToken));
        } catch (InvalidTokenException e) {
            log.warn("Refresh token invalid: {}", e.getMessage());
            throw e;
        }
    }

    private String extractRefreshToken(HttpServletRequest request) {
        // 1. Try from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            log.debug("Extracted refresh token from Authorization header");
            return token;
        }
        // 2. Try from Cookie
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(c -> "refresh_token".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .map(token -> {
                        log.debug("Extracted refresh token from cookie");
                        return token;
                    })
                    .orElse(null);
        }
        log.debug("No refresh token found");
        return null;
    }
}
