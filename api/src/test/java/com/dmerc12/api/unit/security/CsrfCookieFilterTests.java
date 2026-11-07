package com.dmerc12.api.unit.security;

import com.dmerc12.api.security.CsrfCookieFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link CsrfCookieFilter}.
 * <p>Verifies that a materialized token is force-evaluated (which triggers
 * {@code CookieCsrfTokenRepository.saveToken} on the response) and that a
 * missing token does not throw and still allows the chain to proceed.
 * <p>Lenient strictness: {@link OncePerRequestFilter} calls {@link HttpServletRequest#getAttribute}
 * internally with attribute names the test does not control (the {@code FILTERED} marker, the
 * {@code jakarta.servlet.error.request_uri} skip-dispatch check).
 * Stubbing every internal attribute the framework might query would couple the test to Spring internals;
 * lenient mode accepts the calls the test does not anticipate.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CSRF Cookie Filter Unit Tests")
@MockitoSettings(strictness = Strictness.LENIENT)
public class CsrfCookieFilterTests {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Test
    @DisplayName("Materialized token - getToken() is invoked and the chain continues")
    public void materializedTokenTriggersSave() throws ServletException, IOException {
        CsrfToken csrfToken = mock(CsrfToken.class);
        when(request.getAttribute(CsrfToken.class.getName())).thenReturn(csrfToken);
        new CsrfCookieFilter().doFilter(request, response, filterChain);
        verify(csrfToken).getToken();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Missing token - no NPE and the chain continues")
    public void missingTokenChainContinues() throws ServletException, IOException {
        new CsrfCookieFilter().doFilter(request, response, filterChain);
        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(response);
    }
}
