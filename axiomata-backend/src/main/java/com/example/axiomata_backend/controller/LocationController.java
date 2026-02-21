package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.LocationRequestDto;
import com.example.axiomata_backend.dto.LocationResponseDto;
import com.example.axiomata_backend.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // Create a new location
    @PostMapping
    public ResponseEntity<LocationResponseDto> create(@RequestBody @Valid LocationRequestDto request) {
        LocationResponseDto created = locationService.create(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED); // 201 Created
    }

    // Get a location by ID
    @GetMapping("/{id}")
    public ResponseEntity<LocationResponseDto> getById(@PathVariable Long id) {
        LocationResponseDto location = locationService.getById(id);
        return ResponseEntity.ok(location); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Get all locations for a specific world
    @GetMapping("/world/{worldId}")
    public ResponseEntity<List<LocationResponseDto>> getByWorld(@PathVariable Long worldId) {
        List<LocationResponseDto> locations = locationService.getByWorld(worldId);
        return ResponseEntity.ok(locations); // 200 OK
    }

    // Update a location by ID
    @PutMapping("/{id}")
    public ResponseEntity<LocationResponseDto> update(@PathVariable Long id,
                                                      @RequestBody @Valid LocationRequestDto request) {
        LocationResponseDto updated = locationService.update(id, request);
        return ResponseEntity.ok(updated); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Delete a location by ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void delete(@PathVariable Long id) {
        locationService.delete(id); // service throws ResourceNotFoundException if not found
    }
}