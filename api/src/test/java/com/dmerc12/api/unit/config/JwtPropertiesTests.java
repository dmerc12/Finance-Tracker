package com.dmerc12.api.unit.config;

import com.dmerc12.api.config.JwtProperties;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("JWT Properties Tests")
@TestPropertySource(properties = {
        "jwt.secret=testSecret",
        "jwt.expiration=86400000"
})
public class JwtPropertiesTests {

    @Autowired
    private JwtProperties properties;

    @Test
    @DisplayName("Properties binding")
    public void propertiesBinding() {
        assertNotNull(properties.getSecret());
        assertTrue(properties.getExpiration() > 0);
    }
}
