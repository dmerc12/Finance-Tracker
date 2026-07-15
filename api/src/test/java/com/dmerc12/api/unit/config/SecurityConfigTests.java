package com.dmerc12.api.unit.config;

import com.dmerc12.api.config.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@ActiveProfiles("test")
@DisplayName("Security Config Unit Tests")
@SpringBootTest(classes = SecurityConfig.class)
public class SecurityConfigTests {

    @Autowired
    private SecurityConfig securityConfig;

    @Test
    @DisplayName("Password encoder bean")
    public void passwordEncoderBean() {
        assertNotNull(securityConfig.passwordEncoder());
        assertInstanceOf(BCryptPasswordEncoder.class, securityConfig.passwordEncoder());
    }

    @Test
    @DisplayName("CORS configuration source")
    public void corsConfigurationSource() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        assertNotNull(source);
    }

    @Test
    @DisplayName("Filter chain bean")
    public void filterChainBean() throws Exception {
        HttpSecurity http = mock(HttpSecurity.class);
        assertNotNull(securityConfig.filterChain(http));
    }
}
