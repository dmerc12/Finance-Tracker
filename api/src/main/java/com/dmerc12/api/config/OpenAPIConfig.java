package com.dmerc12.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

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
}
