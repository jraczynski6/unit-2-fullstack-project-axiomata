package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.LocationRequestDto;
import com.example.axiomata_backend.dto.LocationResponseDto;
import com.example.axiomata_backend.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    // Get all locations by id
    @GetMapping("/{id}")
    public ResponseEntity<LocationResponseDto> getById(@PathVariable Long id) {
        LocationResponseDto location = locationService.getById(id);
        if (location == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found");
        }
        return ResponseEntity.ok(location); // 200 OK
    }

    // Get by World
    @GetMapping("/world/{worldId}")
    public ResponseEntity<List<LocationResponseDto>> getByWorld(@PathVariable Long worldId) {
        List<LocationResponseDto> locations = locationService.getByWorld(worldId);
        return ResponseEntity.ok(locations); // 200 OK
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<LocationResponseDto> update(@PathVariable Long id,
                                                      @RequestBody @Valid LocationRequestDto request) {
        LocationResponseDto updated = locationService.update(id, request);
        if (updated == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found");
        }
        return ResponseEntity.ok(updated); // 200 OK
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void delete(@PathVariable Long id) {
        locationService.delete(id); // assume service throws exception if not found
    }
}
