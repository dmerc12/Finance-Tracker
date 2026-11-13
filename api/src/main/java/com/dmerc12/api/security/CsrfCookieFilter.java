package com.dmerc12.api.security;

import com.dmerc12.api.config.SecurityConfig;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Forces {@link CookieCsrfTokenRepository} to write the {@code XSRF-TOKEN} cookie on every response.
 * <p>The cookie repository is lazy: it only persists the token when {@link CsrfToken#getToken()} is called.
 * On state-changing requests the {@code CsrfFilter} already triggers that, but on the primer GET
 * (and any other read-only request) nothing forces materialization,
 * so the cookie would never be set before the first mutation.
 * <p>This is the classic pre-{@code CsrfConfigurer.spa()} recipe.
 * It remains the reliable path on Spring Security 7.x, where {@code spa()} does not consistently
 * compose the cookie repository with the SPA request handler - see {@link SecurityConfig#filterChain}.
 *
 * @see SecurityConfig
 * @see CsrfFilter
 */
public class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            csrfToken.getToken();
        }
        filterChain.doFilter(request, response);
    }
}
