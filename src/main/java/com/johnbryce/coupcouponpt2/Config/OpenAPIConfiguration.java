package com.johnbryce.coupcouponpt2.Config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfiguration {
    @Bean
    public OpenAPI defineOpenAPI(@Value("spring-openapi-ui") String serviceTitle, @Value("1.6.12") String serviceVersion) {
        Server server = new Server();
        server.setUrl("http://localhost:8080");
        server.setDescription("CoupCoupon api for a coupon project.");

        Contact contact = new Contact();
        contact.setName("Max Mullokandov");
        contact.setEmail("MaximPim95@gmail.com");

        Info info = new Info()
                .title("CoupCoupon Management System API")
                .version("1.0")
                .description("CoupCoupon Management System API to manage coupons.")
                .contact(contact);

        final String securitySchemeName = "bearerAuth";


        return new OpenAPI().components(new Components().addSecuritySchemes(
                securitySchemeName,new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")

                        )
                )
                .info(info.version(serviceVersion)).servers(List.of(server));
    }
}
