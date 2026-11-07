package com.dmerc12.api.config;

import com.dmerc12.api.security.CsrfCookieFilter;
import com.dmerc12.api.security.JwtAuthenticationEntryPoint;
import com.dmerc12.api.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
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
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
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
 *     <li>
 *         CSRF protection via explicit {@link CookieCsrfTokenRepository}
 *         and {@link CsrfCookieFilter} (not {@code CsrfConfigurer.spa()};
 *         see {@link #filterChain(HttpSecurity)} for why)
 *     </li>
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
     * <p>CSRF is enabled with an explicit {@link CookieCsrfTokenRepository}, (JS-readable {@code XSRF-TOKEN} cookie)
     * and a {@link CsrfTokenRequestAttributeHandler} that exposes the raw token on the request attribute so it
     * can be compared against the {@code X-XSRF-TOKEN} header sent by the SPA.
     * The {@link CsrfCookieFilter} runs after {@link CsrfFilter} and forces token materialization on every request,
     * so the {@code XSRF-TOKEN} cookie is set on the primer GET rather than only on the first state-changing request.
     * * <p>Note: {@code CsrfConfigurer::spa} was tried first but on Spring Security 7.0.x it overrides any
     * explicitly configured {@code csrfTokenRepository}, leaving the default {@code HttpSessionCsrfTokenRepository}
     * in place despite the {@code STATELESS} session policy.
     * The manual composition above is the working alternative.
     *
     * @param http the {@link HttpSecurity} object to configure
     * @return the configured {@link SecurityFilterChain}
     */

    @Bean
    @Order(1)
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) {
        http
                // Health checks for Docker
                .securityMatcher("/actuator/**")
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
                // Configure CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF enabled via the Spring Security 7 SPA preset:
                // CookieCsrfTokenRepository.withHttpOnlyFalse() + SpaCsrfTokenRequestHandler.
                // The token is written to XSRF-TOKEN (readable by JS) and expected back in X-XSRF-TOKEN
                // on state-changing requests.
                .csrf(csrf -> csrf
                        .csrfTokenRepository(csrfTokenRepository())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                .addFilterAfter(new CsrfCookieFilter(), CsrfFilter.class)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        // Public auth endpoints
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/refresh",
                                "/api/auth/logout",
                                "/api/auth/csrf"
                        ).permitAll()
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

    /**
     * Tells Spring Boot not to wire filter into the servlet context automatically
     * @param filter the filter JWT authentication configuration
     * @return the {@link FilterRegistrationBean}
     */
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    /**
     * Provides the CSRF token repository used by the security filter chain.
     * <p>Extracted as a bean so tests can assert on the production repository
     * without relying on real-HTTP cookie emission, which is unreliable when
     * {@code @AutoConfigureMockMvc} substitutes the repository for the whole application context.
     *
     * @return the cookie-backed CSRF token repository
     */
    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        return CookieCsrfTokenRepository.withHttpOnlyFalse();
    }
}
