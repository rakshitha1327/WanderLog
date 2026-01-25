package com.wanderlog.backend.repository;

import com.wanderlog.backend.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TripRepository extends MongoRepository<Trip, String> {

    List<Trip> findByUserEmail(String userEmail);
    
    List<Trip> findByIsPublicTrue();
    
    List<Trip> findByIsPublicTrueAndLocationContainingIgnoreCase(String location);
}
