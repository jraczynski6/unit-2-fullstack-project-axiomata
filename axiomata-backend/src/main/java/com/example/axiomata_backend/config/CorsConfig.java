package com.example.axiomata_backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Global CORS configuration for Axiomata backend
// Allows React frontend (Vite) to access all API endpoints,

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to all endpoints
                        .allowedOriginPatterns("http://localhost:*") // Vite React dev server
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Methods frontend will use
                        .allowCredentials(true) // Needed for JWT or cookie auth
                        .maxAge(3600); // Optional: cache preflight requests for 1 hour
            }
        };
    }
}

