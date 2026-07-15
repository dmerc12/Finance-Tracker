package com.dmerc12.api.unit.config;

import com.dmerc12.api.config.OpenAPIConfig;
import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ActiveProfiles("test")
@SpringBootTest(classes = OpenAPIConfig.class)
@DisplayName("Open API Config Unit Tests")
public class OpenAPIConfigTests {

    @Autowired
    private OpenAPIConfig config;

    @Test
    @DisplayName("Custom Open API")
    public void customOpenAPI() {
        OpenAPI api = config.customOpenAPI();
        assertNotNull(api);
        assertEquals("Finance Tracker API", api.getInfo().getTitle());
        assertEquals("Dylan Mercer", api.getInfo().getContact().getName());
    }
}
