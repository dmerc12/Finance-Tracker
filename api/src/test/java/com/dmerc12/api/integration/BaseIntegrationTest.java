package com.dmerc12.api.integration;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.utility.TestcontainersConfiguration;

/**
 * Base class for all integration tests using Testcontainers with PostgreSQL.
 * <p>This abstract class provides a standardized test environment configuration for
 * all integration tests, eliminating repetitive setup code and ensuring consistency across test suites.
 * <p><b>Key features:</b>
 * <ul>
 *     <li>Uses PostgreSQL Testcontainer (defined in {@link TestcontainersConfiguration}</li>
 *     <li>Activates {@code test} profile</li>
 *     <li>Configures {@link MockMvc} via {@link AutoConfigureMockMvc}</li>
 *     <li>Resets the Spring context after each test class ({@link DirtiesContext})</li>
 * </ul>
 * <p><b>Usage:</b> Extend this class in any integration test class to inherit the
 * complete test environment setup.
 *
 * @see TestcontainersConfiguration
 * @see SpringBootTest
 */
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)

public abstract class BaseIntegrationTest {
}
