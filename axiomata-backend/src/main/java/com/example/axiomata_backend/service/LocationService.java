package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.LocationRequestDto;
import com.example.axiomata_backend.dto.LocationResponseDto;
import com.example.axiomata_backend.model.Location;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.LocationRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final WorldRepository worldRepository;

    public LocationService(LocationRepository locationRepository, WorldRepository worldRepository) {
        this.locationRepository = locationRepository;
        this.worldRepository = worldRepository;
    }

    // Create a new location
    public LocationResponseDto create(LocationRequestDto request) {

        World world = worldRepository.findById(request.getWorldId())
                .orElseThrow(() -> new RuntimeException("World not found"));

        Location parentRegion = null;
        if (request.getRegionId() != null) {
            parentRegion = locationRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new RuntimeException("Parent region not found"));

            // Ensure parent region is in same world
            if (!parentRegion.getWorld().getId().equals(world.getId())) {
                throw new RuntimeException("Parent region must belong to same world");
            }
        }

        Location location = new Location();
        location.setWorld(world);
        location.setRegion(parentRegion);
        location.setName(request.getName());
        location.setType(request.getType());
        location.setDescription(request.getDescription());

        Location saved = locationRepository.save(location);

        return mapToResponse(saved);
    }

    // Read a location by ID
    public List<LocationResponseDto> getByWorld(Long worldId) {
        return locationRepository.findByWorldId(worldId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LocationResponseDto getById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        return mapToResponse(location);
    }

    // Update a location
    public LocationResponseDto update(Long id, LocationRequestDto request) {

        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        location.setName(request.getName());
        location.setType(request.getType());
        location.setDescription(request.getDescription());

        if (request.getRegionId() != null) {
            Location parentRegion = locationRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new RuntimeException("Parent region not found"));

            if (!parentRegion.getWorld().getId().equals(location.getWorld().getId())) {
                throw new RuntimeException("Parent region must belong to same world");
            }

            location.setRegion(parentRegion);
        } else {
            location.setRegion(null);
        }

        Location updated = locationRepository.save(location);

        return mapToResponse(updated);
    }

    // Delete a location
    public void delete(Long id) {
        locationRepository.deleteById(id);
    }

    //Mapping
    private LocationResponseDto mapToResponse(Location location) {
        return new LocationResponseDto(location);
    }
}
