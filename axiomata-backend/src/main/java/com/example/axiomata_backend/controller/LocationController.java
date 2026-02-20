package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.LocationRequestDto;
import com.example.axiomata_backend.dto.LocationResponseDto;
import com.example.axiomata_backend.service.LocationService;
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
    public LocationResponseDto create(@RequestBody LocationRequestDto request) {
        return locationService.create(request);
    }

    // Get all locations by id
    @GetMapping("/{id}")
    public LocationResponseDto getById(@PathVariable Long id) {
        return locationService.getById(id);
    }

    // Get by World
    @GetMapping("/world/{worldId}")
    public List<LocationResponseDto> getByWorld(@PathVariable Long worldId) {
        return locationService.getByWorld(worldId);
    }

    // UPDATE
    @PutMapping("/{id}")
    public LocationResponseDto update(
            @PathVariable Long id,
            @RequestBody LocationRequestDto request) {
        return locationService.update(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        locationService.delete(id);
    }
}
