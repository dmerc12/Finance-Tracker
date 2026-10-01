package com.dmerc12.api.unit.security;

import com.dmerc12.api.security.JwtAuthenticationEntryPoint;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.AuthenticationException;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link JwtAuthenticationEntryPoint}.
 * <p>Verifies that the entry point returns a 401 status with a JSON error
 * response for protected URIs, and short-circuits actuator URIs with a 200
 * so orchestrator health probes do not treat a missing token as a failure.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("JWT Authentication Entry Point Tests")
public class JwtAuthenticationEntryPointTests {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @Test
    @DisplayName("Commence sets 401 and writes error response")
    public void commence() throws Exception {
        when(request.getRequestURI()).thenReturn("/api/accounts");
        JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
        entryPoint.commence(request, response, authException);
        verify(response).setStatus(401);
        String json = stringWriter.toString();
        assertThat(json).contains("Authentication required");
        assertThat(json).contains("Unauthorized");
        assertThat(json).contains("timestamp");
    }

    @Test
    @DisplayName("Commence returns 200 without body for actuator URIs")
    public void commenceActuator() throws Exception {
        when(request.getRequestURI()).thenReturn("/actuator/health");
        JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();
        entryPoint.commence(request, response, authException);
        verify(response).sendError(HttpServletResponse.SC_OK);
        verify(response, never()).setStatus(401);
        verify(response, never()).getWriter();
    }

    @Test
    @DisplayName("Commence returns 401 with null URI")
    public void commenceNullURI() throws Exception {
        when(request.getRequestURI()).thenReturn(null);
        JwtAuthenticationEntryPoint entryPoint = new JwtAuthenticationEntryPoint();
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
        entryPoint.commence(request, response, authException);
        verify(response).setStatus(401);
        String json = stringWriter.toString();
        assertThat(json).contains("Authentication required");
        assertThat(json).contains("Unauthorized");
        assertThat(json).contains("timestamp");
    }
}
