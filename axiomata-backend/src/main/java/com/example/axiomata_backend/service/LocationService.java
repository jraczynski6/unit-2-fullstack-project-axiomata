package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.LocationRequestDto;
import com.example.axiomata_backend.dto.LocationResponseDto;
import com.example.axiomata_backend.exception.ResourceNotFoundException;
import com.example.axiomata_backend.model.Location;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.LocationRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public LocationResponseDto create(LocationRequestDto request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Location name cannot be blank");
        }

        World world = worldRepository.findById(request.getWorldId())
                .orElseThrow(() -> new ResourceNotFoundException("World not found with id " + request.getWorldId()));

        Location parentRegion = null;
        if (request.getRegionId() != null) {
            parentRegion = locationRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent region not found with id " + request.getRegionId()));

            if (!parentRegion.getWorld().getId().equals(world.getId())) {
                throw new IllegalArgumentException("Parent region must belong to same world");
            }
        }

        Location location = new Location();
        location.setWorld(world);
        location.setRegion(parentRegion);
        location.setName(request.getName());
        location.setType(request.getType());
        location.setDescription(request.getDescription());

        return new LocationResponseDto(locationRepository.save(location));
    }

    @Transactional(readOnly = true)
    public List<LocationResponseDto> getByWorld(Long worldId) {
        return locationRepository.findByWorldId(worldId).stream()
                .map(LocationResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LocationResponseDto getById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + id));
        return new LocationResponseDto(location);
    }

    @Transactional
    public LocationResponseDto update(Long id, LocationRequestDto request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Location name cannot be blank");
        }

        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + id));

        location.setName(request.getName());
        location.setType(request.getType());
        location.setDescription(request.getDescription());

        if (request.getRegionId() != null) {
            Location parentRegion = locationRepository.findById(request.getRegionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent region not found with id " + request.getRegionId()));

            if (!parentRegion.getWorld().getId().equals(location.getWorld().getId())) {
                throw new IllegalArgumentException("Parent region must belong to same world");
            }

            location.setRegion(parentRegion);
        } else {
            location.setRegion(null);
        }

        return new LocationResponseDto(locationRepository.save(location));
    }

    @Transactional
    public void delete(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + id));
        locationRepository.delete(location);
    }
}