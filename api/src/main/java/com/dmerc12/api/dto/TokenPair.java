package com.dmerc12.api.dto;

import com.dmerc12.api.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A pair of JWTs identifying a session: the short-lived access token and the long-lived refresh token.
 *
 * <p>Used in two places:
 * <ul>
 *     <li>
 *         As the response body of {@code POST /api/auth/refresh}, carrying the newly rotated pair.
 *         The same values are also written to HTTP-only cookies;
 *         the DTO exists so non-cookie clients can read them from the response.
 *     </li>
 *     <li>
 *         As the input to {@code AuthService.logout}, carrying the current pair extracted from the request's cookies.
 *     </li>
 * </ul>
 *
 * @see AuthService#refreshTokens(String, HttpServletResponse)
 * @see AuthService#logout(TokenPair, HttpServletResponse)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenPair {

    /**
     * The JWT access token.
     */
    private String accessToken;

    /**
     * The JWT refresh token.
     */
    private String refreshToken;
}
