package com.wanderlog.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
@SuppressWarnings("null") // suppress static null-safety warnings for Mongo beans
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        // Log connection (masking credentials for security)
        String maskedUri = mongoUri.replaceAll("://[^:]+:[^@]+@", "://***:***@");
        System.out.println("========================================");
        System.out.println("🔗 MongoDB Configuration:");
        System.out.println("URI: " + maskedUri);
        System.out.println("========================================");
        
        // Explicitly create MongoClient with Atlas URI
        MongoClient client = MongoClients.create(mongoUri);
        System.out.println("✅ MongoClient created successfully");
        return client;
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        // Extract database name from URI or use default
        String databaseName = "wanderlog";
        if (mongoUri.contains("/")) {
            String[] parts = mongoUri.split("/");
            if (parts.length > 1) {
                String dbPart = parts[parts.length - 1].split("\\?")[0];
                if (!dbPart.isEmpty()) {
                    databaseName = dbPart;
                }
            }
        }
        System.out.println("📦 Using database: " + databaseName);
        return new SimpleMongoClientDatabaseFactory(mongoClient, databaseName);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDatabaseFactory) {
        return new MongoTemplate(mongoDatabaseFactory);
    }
}


