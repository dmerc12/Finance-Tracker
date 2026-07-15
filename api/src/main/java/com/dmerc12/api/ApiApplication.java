package com.dmerc12.api;

import com.dmerc12.api.entity.BaseEntity;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main entry point for the Finance Tracker Spring Boot application.
 * <p>This class bootstraps the application using Spring Boot's {@link SpringBootApplication}.
 * It also enables JPA auditing via {@link EnableJpaAuditing} to automatically populate
 * {@code createdAt} and {@code updatedAt} fields in entities that extend {@link BaseEntity}.
 * <p>The application runs on the default port 8080 and serves the REST API for the Finance Tracker frontend.
 *
 * @see BaseEntity
 * @see SpringApplication
 */
@EnableJpaAuditing
@SpringBootApplication
@EnableConfigurationProperties
public class ApiApplication {

    /**
     * Launches the Spring Boot application.
     *
     * @param args command-line arguments passed to the application
     */
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
