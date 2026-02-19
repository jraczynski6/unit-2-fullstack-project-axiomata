package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.WorldDto;
import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.UserRepository;
import com.example.axiomata_backend.service.WorldService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/worlds") // Base endpoint for all world operations
public class WorldController {

    private final WorldService worldService;
    private final UserRepository userRepository;

    public WorldController(WorldService worldService, UserRepository userRepository) {
        this.worldService = worldService;
        this.userRepository = userRepository;
    }

    // GET /api/worlds - Get all worlds for the logged-in user
    @GetMapping
    public List<WorldDto> getAllWorlds(Authentication authentication) {
        String username = authentication.getName(); // Extracted from JWT
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        List<World> worlds = worldService.getWorldsByUserId(user.getId());

        // Convert each World entity to a WorldDto (attributes as JSON string)
        return worlds.stream()
                .map(world -> new WorldDto(
                        world.getId(),
                        world.getName(),
                        world.getDescription(),
                        world.getCreatedAt(),
                        world.getUpdatedAt(),
                        world.getAttributes(), // JSON string
                        user.getUsername()
                ))
                .collect(Collectors.toList());
    }

    // GET /api/worlds/{id} - Get a world by ID (must belong to the logged-in user)
    @GetMapping("/{id}")
    public WorldDto getWorldById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        World world = worldService.getWorldById(id)
                .orElseThrow(() -> new IllegalStateException("World not found"));

        // Ensure the world belongs to the logged-in user
        if (!world.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Unauthorized access to world");
        }

        return new WorldDto(
                world.getId(),
                world.getName(),
                world.getDescription(),
                world.getCreatedAt(),
                world.getUpdatedAt(),
                world.getAttributes(), // JSON string
                user.getUsername()
        );
    }

    // POST /api/worlds - Create a new world for the logged-in user
    @PostMapping
    public WorldDto createWorld(@RequestBody WorldDto worldDto, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Convert DTO to entity and save
        World world = worldService.createWorld(worldDto.toEntity(user));

        return new WorldDto(
                world.getId(),
                world.getName(),
                world.getDescription(),
                world.getCreatedAt(),
                world.getUpdatedAt(),
                world.getAttributes(), // JSON string
                user.getUsername()
        );
    }

    // PUT /api/worlds/{id} - Update an existing world (must belong to logged-in user)
    @PutMapping("/{id}")
    public WorldDto updateWorld(@PathVariable Long id, @RequestBody WorldDto worldDto, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Convert DTO to entity and update
        World updatedWorld = worldService.updateWorld(id, worldDto.toEntity(user))
                .orElseThrow(() -> new IllegalStateException("World not found or unauthorized"));

        return new WorldDto(
                updatedWorld.getId(),
                updatedWorld.getName(),
                updatedWorld.getDescription(),
                updatedWorld.getCreatedAt(),
                updatedWorld.getUpdatedAt(),
                updatedWorld.getAttributes(), // JSON string
                user.getUsername()
        );
    }

    // DELETE /api/worlds/{id} - Delete a world by ID (must belong to logged-in user)
    @DeleteMapping("/{id}")
    public String deleteWorld(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Service method ensures only owned worlds are deleted
        worldService.deleteWorldIfOwnedByUser(id, user.getId());

        return "World with id " + id + " deleted successfully.";
    }
}
