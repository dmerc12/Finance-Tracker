package com.dmerc12.api.dto;

import com.dmerc12.api.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for token refresh responses.
 * <p>Carries the newly issued access and refresh tokens.
 * The same values are also written to the response as HTTP-only cookies;
 * this DTO exists so the controller can surface them in the response body for non-cookie clients.
 *
 * @see AuthService#refreshTokens(String, HttpServletResponse)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshedTokensDTO {

    /**
     * The newly issued JWT access token.
     */
    private String accessToken;

    /**
     * The newly issued JWT refresh token.
     * The incoming refresh token is invalidated by this rotation.
     */
    private String refreshToken;
}
