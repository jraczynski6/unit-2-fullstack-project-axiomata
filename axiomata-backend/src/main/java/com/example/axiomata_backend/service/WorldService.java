package com.example.axiomata_backend.service;

import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorldService {

    private final WorldRepository worldRepository;

    public WorldService(WorldRepository worldRepository) {
        this.worldRepository = worldRepository;
    }

    // Crud operations for World entities

    // Create a new world
    public World createWorld(World world) {
        return worldRepository.save(world);
    }

    // Get a world
    public List<World> getAllWorlds() {
        return worldRepository.findAll();
    }

    // Get world by id
    public Optional<World> getWorldById(Long id) {
        return worldRepository.findById(id);
    }

    // get world by user id
    public List<World> getWorldsByUserId(Long userId) {
        return worldRepository.findByUserId(userId);
    }


    // Update a world
    public Optional<World> updateWorld(Long id, World updatedWorld) {
        return worldRepository.findById(id).map(world -> {
            world.setName(updatedWorld.getName());
            world.setDescription(updatedWorld.getDescription());
            return worldRepository.save(world);
        });
    }

    // Delete a world
    public void deleteWorld(Long id) {
        worldRepository.deleteById(id);
    }

    public void deleteWorldIfOwnedByUser(Long worldId, Long userId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new IllegalStateException("World not found"));
        if (!world.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Unauthorized");
        }
        worldRepository.delete(world);
    }
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