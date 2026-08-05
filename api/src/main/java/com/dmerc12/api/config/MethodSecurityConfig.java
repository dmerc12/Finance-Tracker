package com.dmerc12.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * Configuration for method-level security.
 * <p>Enables {@code @PreAuthorize} and {@code @PostAuthorize} annotations
 * for fine-grained access control at the controller/service layer.
 */
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
}
