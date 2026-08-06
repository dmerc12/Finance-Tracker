package com.dmerc12.api.unit.config;

import com.dmerc12.api.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Security Config Unit Tests")
public class SecurityConfigTests {

    @Autowired
    private SecurityConfig securityConfig;

    @Test
    @DisplayName("Password encoder bean is BCrypt")
    public void passwordEncoderBean() {
        PasswordEncoder encoder = securityConfig.passwordEncoder();
        assertNotNull(encoder);
        assertInstanceOf(BCryptPasswordEncoder.class, encoder);
    }

    @Test
    @DisplayName("CORS configuration source bean exists")
    public void corsConfigurationSource() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        assertNotNull(source);
    }

    @Test
    @DisplayName("AuthenticationManager bean is injected correctly")
    public void authenticationManagerInjected() {
        AuthenticationManager authManager = securityConfig
                .authenticationManager(mock(AuthenticationConfiguration.class));
        assertNotNull(authManager);
    }
}
