package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.*;
import com.example.axiomata_backend.model.*;
import com.example.axiomata_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorldService {

    private final WorldRepository worldRepository;
    private final UserRepository userRepository;

    public WorldService(WorldRepository worldRepository, UserRepository userRepository) {
        this.worldRepository = worldRepository;
        this.userRepository = userRepository;
    }


    // CRUD operations for World entities


    @Transactional
    public WorldResponseDto createWorld(Long userId, WorldRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        World world = new World();
        world.setUser(user);
        world.setName(request.getName());
        world.setDescription(request.getDescription());
        world.setAttributes(request.getAttributes());

        World savedWorld = worldRepository.save(world);
        return mapToResponseDto(savedWorld);
    }

    @Transactional
    public WorldResponseDto updateWorld(Long worldId, WorldRequestDto request) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new IllegalStateException("World not found"));

        world.setName(request.getName());
        world.setDescription(request.getDescription());
        world.setAttributes(request.getAttributes());

        return mapToResponseDto(world);
    }

    @Transactional(readOnly = true)
    public WorldResponseDto getWorldById(Long worldId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new IllegalStateException("World not found"));

        return mapToResponseDto(world);
    }

    @Transactional(readOnly = true)
    public List<WorldResponseDto> getWorldsByUser(Long userId) {
        return worldRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // Delete world (cascades to locations, factions, characters, items)

    @Transactional
    public void deleteWorld(Long worldId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new IllegalStateException("World not found"));

        // CascadeType.ALL + orphanRemoval on children ensures all children are deleted
        worldRepository.delete(world);
    }

    // Delete world only if owned by specific user
    @Transactional
    public void deleteWorldIfOwnedByUser(Long worldId, Long userId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new IllegalStateException("World not found"));

        if (!world.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Unauthorized");
        }

        worldRepository.delete(world);
    }


    // Helper: Map entity to response DTO (includes children)

    private WorldResponseDto mapToResponseDto(World world) {
        List<LocationResponseDto> locations = world.getLocations()
                .stream()
                .map(LocationResponseDto::new)
                .collect(Collectors.toList());

        List<FactionResponseDto> factions = world.getFactions()
                .stream()
                .map(FactionResponseDto::new)
                .collect(Collectors.toList());

        List<CharacterResponseDto> characters = world.getCharacters()
                .stream()
                .map(CharacterResponseDto::new)
                .collect(Collectors.toList());

        List<ItemResponseDto> items = world.getItems()
                .stream()
                .map(ItemResponseDto::new)
                .collect(Collectors.toList());

        return new WorldResponseDto(
                world.getId(),
                world.getName(),
                world.getDescription(),
                world.getAttributes(),
                world.getUser().getUsername(),
                world.getCreatedAt(),
                world.getUpdatedAt(),
                locations,
                factions,
                characters,
                items
        );
    }

    /*
    ==========================
    Axiomata Backend TODOs
    ==========================
    TODO: Verify ownership checks for world entity CRUD operations.
    TODO: Implement delete account endpoint for users.
    TODO: Add authentication error handling (401/403) with JSON messages.
    TODO: Validate delete operations with parent-child relationships.
    TODO: Design Misc container handling strategy for orphaned entities (Phase 2).
    TODO: Configure cascade deletes from parent to children where appropriate.
    TODO: Add validation dependency (jakarta.validation / Hibernate Validator).
    TODO: Create global exception handler with @ControllerAdvice.
    TODO: Allow requests from frontend origin (CORS configuration).
    TODO: Add field validation annotations (@NotNull, @Size, etc.) to DTOs.
    TODO: Ensure proper HTTP status codes for all responses (201, 204, 400, 401, 403).
    */
}