package com.johnbryce.coupcouponpt2.Config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfiguration {

    @Bean
    public OpenAPI defineOpenAPI() {
        Contact contact = new Contact()
                .name("Max Mullokandov")
                .email("MaximPim95@gmail.com");

        Info info = new Info()
                .title("CoupCoupon Management System API")
                .version("2.0")
                .description("RESTful API for the CoupCoupon coupon marketplace. " +
                        "Supports Admin, Company, and Customer roles with JWT authentication.")
                .contact(contact);

        String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(info)
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT access token")));
    }
}
