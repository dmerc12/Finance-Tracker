package com.dmerc12.api.security;

import com.dmerc12.api.dto.ResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Custom {@link AuthenticationEntryPoint} that sends a JSON error response when authentication fails
 * (e.g., missing or invalid token).
 * <p>Returns HTTP 401 Unauthorized with a structured {@link ResponseDTO} body.
 */
@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    /**
     * Called when an unauthenticated user attempts to access a protected resource.
     *
     * @param request the HTTP request
     * @param response the HTTP response
     * @param authException the authentication exception
     * @throws IOException if an I/O error occurs
     */
    @Override
    public void commence(@NonNull HttpServletRequest request, HttpServletResponse response,
                         @NonNull AuthenticationException authException) throws IOException {
        log.warn("Authentication failed: {}", authException.getMessage());
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ResponseDTO<Object> errorResponse = ResponseDTO.error(
                "Authentication required",
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized"
        );
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
