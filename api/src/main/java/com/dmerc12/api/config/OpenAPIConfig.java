package com.dmerc12.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for OpenAPI (Swagger) documentation.
 * <p>This class configures the OpenAPI specification for the Finance Tracker API,
 * providing interactive API documentation via Swagger UI and generating machine-readable OpenAPI JSON.
 * <p>The OpenAPI documentation is automatically at the following endpoints (when {@code springdoc.api-docs.enabled} is true):
 * <ul>
 *     <li><b>Swagger UI:</b> {@code /swagger-ui.html}</li>
 *     <li><b>OpenAPI JSON:</b> {@code /v3/api-docs}</li>
 * </ul>
 * <p><b>Note:</b>
 * These endpoints are enabled by default in development but should be disabled in production by setting:
 * <pre>
 *     springdoc.api-docs.enabled=false
 *     springdoc.swagger-ui.enabled=false
 * </pre>
 *
 * @see OpenAPI
 * @see GroupedOpenApi
 */
@Configuration
public class OpenAPIConfig {

    /**
     * Creates and configures the custom OpenAPI metadata for the Finance Tracker API.
     * <p>This bean defines the top-level information about the API, including:
     * <ul>
     *     <li><b>Title:</b> "Finance Tracker API"</li>
     *     <li><b>Description:</b> Backend API for the Personal Finance Tracker</li>
     *     <li><b>Version:</b> 1.0.0</li>
     *     <li><b>Contact:</b> Developer information for API support</li>
     *     <li><b>License:</b> MIT License</li>
     * </ul>
     * <p>This information appears in the Swagger UI and can be used by API clients to understand the API's
     * purpose, version, and support channels.
     * <p><b>Example usage in Swagger UI:</b>
     * <pre>
     *     GET /swagger-ui.html
     * </pre>
     * The UI will display the title, description, version, and contact information at the top of the page.
     *
     * @return a fully configured {@link OpenAPI} instance with API metadata
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Finance Tracker API")
                        .description("Backend API for the Personal Finance Tracker application")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Dylan Mercer")
                                .email("dylanmercer12@outlook.com")
                                .url("https://github.com/dmerc12/Finance-Tracker"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }

    // TODO: In the future, additional OpenAPI configuration may be added here:
    // - GroupedOpenApi for organizing endpoints by domain
    // - SecuritySchemes for JWT authentication documentation
    // - Custom server configurations for different environments
    // These will be added when building out specific feature groups.
}
