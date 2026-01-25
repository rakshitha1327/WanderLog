package com.wanderlog.backend.controller;

import com.wanderlog.backend.model.Trip;
import com.wanderlog.backend.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173") // React Vite
public class TripController {

    private final TripService service;

    public TripController(TripService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        Trip savedTrip = service.saveTrip(trip);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTrip);
    }

    @GetMapping
    public ResponseEntity<List<Trip>> getTrips(@RequestParam(required = false) String userEmail) {
        if (userEmail != null && !userEmail.isEmpty()) {
            return ResponseEntity.ok(service.getTripsByUser(userEmail));
        }
        return ResponseEntity.ok(service.getPublicTrips());
    }

    @GetMapping("/public")
    public ResponseEntity<List<Trip>> getPublicTrips(@RequestParam(required = false) String location) {
        if (location != null && !location.isEmpty()) {
            return ResponseEntity.ok(service.getPublicTripsByLocation(location));
        }
        return ResponseEntity.ok(service.getPublicTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTrip(@PathVariable String id) {
        return service.getTripById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable String id, @RequestBody Trip tripDetails) {
        return service.updateTrip(id, tripDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable String id) {
        service.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}
