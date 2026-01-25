package com.wanderlog.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @Value("${spring.data.mongodb.uri:NOT_SET}")
    private String mongoUri;

    @GetMapping("/api/health")
    public String healthCheck() {
        return "WanderLog backend is running 🚀";
    }

    @GetMapping("/api/config/mongodb")
    public String checkMongoConfig() {
        // Mask password in URI for security
        String maskedUri = mongoUri.replaceAll("://[^:]+:[^@]+@", "://***:***@");
        return "MongoDB URI: " + (mongoUri.equals("NOT_SET") ? "NOT CONFIGURED" : maskedUri);
    }
}
