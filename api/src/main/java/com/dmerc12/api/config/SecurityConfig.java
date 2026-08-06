package com.dmerc12.api.config;

import com.dmerc12.api.security.JwtAuthenticationEntryPoint;
import com.dmerc12.api.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration for the Finance Tracker API.
 * <p>This class configures the application's security rules, including:
 * <ul>
 *     <li>Endpoint authorization and access control</li>
 *     <li>JWT authentication filter and entry point</li>
 *     <li>Stateless session management</li>
 *     <li>CORS settings</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint authEntryPoint;

    /**
     * List of allowed origins for Cross-Origin Resource Sharing (CORS).
     * <p>These are the frontend development servers that are permitted to access the API.
     * <ul>
     *     <li><b>5173</b> - Default Vite dev server port</li>
     *     <li><b>5174</b> - Alternative Vite port (if 5173 is occupied)</li>
     *     <li><b>3000</b> - Common React dev server port</li>
     * </ul>
     * <p><b>Production Note:</b> Replace with actual production domain(s) when deploying.
     */
    private final List<String> ALLOWED_ORIGINS = List.of(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000"
    );

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
     *     <li>PasswordEncoder bean (BCrypt) - already configured</li>
     *     <li>Proper CORS configuration for frontend - already configured</li>
     *     <li>Secure session management (stateless for JWT)</li>
     * </ul>
     *
     * @param http the {@link HttpSecurity} object to configure
     * @return the configured {@link SecurityFilterChain}
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Temporarily disabled for JWT
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        // Health checks for Docker
                        .requestMatchers("/actuator/health").permitAll()
                        // Secure other actuator endpoints
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        // Public registration and refresh endpoints
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/refresh").permitAll()
                        // Authenticated by default
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * Provides the password encoder bean for hashing user passwords.
     * <p>Uses BCrypt with a strength of 10 (default) which is a good balance between security and performance.
     * <p>This bean is used by:
     * <ul>
     *     <li>User registration - to hash passwords before storage</li>
     *     <li>Authentication provider - to validate password matches</li>
     * </ul>
     *
     * @return the BCrypt password encoder
     * @see DaoAuthenticationProvider
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures Cross-Origin Resource Sharing (CORS) for the API.
     * <p>This bean defines the CORS policy that allows the frontend applications to communicate with the API.
     * <p><b>Policy details:</b>
     * <ul>
     *     <li><b>Allowed origins:</b> Defined in {@link #ALLOWED_ORIGINS}</li>
     *     <li><b>Allowed methods:</b> GET, POST, PUT, DELETE, OPTIONS</li>
     *     <li><b>Allowed headers:</b> All headers (including Authorization)</li>
     *     <li><b>Credentials:</b> Allowed (cookies, Authorization headers)</li>
     * </ul>
     * <p><b>Security Note:</b> In production, restrict allowed origins to actual frontend domain(s) and
     * consider using a more restrictive set of HTTP methods and headers.
     *
     * @return the configured {@link CorsConfigurationSource}
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(ALLOWED_ORIGINS);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Provides the authentication manager bean.
     *
     * @param config the authentication configuration
     * @return the {@link AuthenticationManager}
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }
}
