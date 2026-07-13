package com.dmerc12.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security configuration for the Finance Tracker API.
 * <p>This class configures the application's security rules, including:
 * <ul>
 *     <li>Endpoint authorization and access control</li>
 *     <li>CSRF protection (disabled for now, to be enabled with JWT)</li>
 *     <li>Authentication requirements for actuator endpoints</li>
 * </ul>
 * <p><b>Security Principles:</b>
 * <ul>
 *     <li>Actuator health endpoint is public for container health checks</li>
 *     <li>All other actuator endpoints require ADMIN role</li>
 *     <li>All other endpoints are currently public (to be secured later)</li>
 *     <li>CSRF is disabled for now but will be re-enabled with JWT token validation</li>
 * </ul>
 *
 * @see EnableWebSecurity
 * @see SecurityFilterChain
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the security filter chain for HTTP requests.
     * <p>This bean defines the security rules for all incoming HTTP requests:
     * <ul>
     *     <li><b>/actuator/health</b> - Publicly accessible (for Docker health checks)</li>
     *     <li><b>/actuator/**</b> - Requires ADMIN role (logs, metrics, etc.)</li>
     *     <li><b>any other request</b> - Currently permitted (public)</li>
     * </ul>
     * <p>CSRF protection is temporarily disabled to simplify development with stateless JWT authentication.
     * It will be re-enabled in a future iteration.
     * <p><b>Security Note:</b>
     * In production, this configuration must be enhanced with:
     * <ul>
     *     <li>JWT authentication filter</li>
     *     <li>UserDetailsService for authentication</li>
     *     <li>PasswordEncoder bean (BCrypt)</li>
     *     <li>Proper CORS configuration for frontend</li>
     *     <li>Secure session management (stateless for JWT)</li>
     * </ul>
     *
     * @param http the {@link HttpSecurity} object to configure
     * @return the configured {@link SecurityFilterChain}
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // Health checks for Docker
                        .requestMatchers("/actuator/health").permitAll()
                        // Secure other actuator endpoints
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        // Public for now (to be secured)
                        .anyRequest().permitAll()
                )
                // Temporarily disabled for JWT
                .csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }

    // TODO: Add the following beans in the next phase:
    // - PasswordEncoder (BCryptPasswordEncoder)
    // - AuthenticationManager
    // - JwtAuthenticationFilter
    // - JwtAuthenticationEntryPoint
    // These will be added when implementing full authentication functionality.
}
