package com.wanderlog.backend.service;

import com.wanderlog.backend.model.Trip;
import com.wanderlog.backend.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null") // suppress static null-safety warnings from analysis
public class TripService {

    private final TripRepository repository;

    public TripService(TripRepository repository) {
        this.repository = repository;
    }

    public Trip saveTrip(Trip trip) {
        return repository.save(trip);
    }

    public List<Trip> getTripsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<Trip> getPublicTrips() {
        return repository.findByIsPublicTrue();
    }

    public List<Trip> getPublicTripsByLocation(String location) {
        return repository.findByIsPublicTrueAndLocationContainingIgnoreCase(location);
    }

    public Optional<Trip> getTripById(String id) {
        return repository.findById(id);
    }

    public Optional<Trip> updateTrip(String id, Trip tripDetails) {
        return repository.findById(id).map(existingTrip -> {
            if (tripDetails.getTitle() != null) existingTrip.setTitle(tripDetails.getTitle());
            if (tripDetails.getLocation() != null) existingTrip.setLocation(tripDetails.getLocation());
            if (tripDetails.getDescription() != null) existingTrip.setDescription(tripDetails.getDescription());
            if (tripDetails.getDate() != null) existingTrip.setDate(tripDetails.getDate());
            if (tripDetails.getTotalBudget() != null) existingTrip.setTotalBudget(tripDetails.getTotalBudget());
            if (tripDetails.getPlacesVisited() != null) existingTrip.setPlacesVisited(tripDetails.getPlacesVisited());
            if (tripDetails.getFoodExperience() != null) existingTrip.setFoodExperience(tripDetails.getFoodExperience());
            if (tripDetails.getCoverImage() != null) existingTrip.setCoverImage(tripDetails.getCoverImage());
            if (tripDetails.getImages() != null) existingTrip.setImages(tripDetails.getImages());
            existingTrip.setPublic(tripDetails.isPublic());
            return repository.save(existingTrip);
        });
    }

    public void deleteTrip(String id) {
        repository.deleteById(id);
    }
}
