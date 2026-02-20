package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.WorldRequestDto;
import com.example.axiomata_backend.dto.WorldResponseDto;
import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.repository.UserRepository;
import com.example.axiomata_backend.service.WorldService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/worlds")
public class WorldController {

    private final WorldService worldService;
    private final UserRepository userRepository;

    public WorldController(WorldService worldService, UserRepository userRepository) {
        this.worldService = worldService;
        this.userRepository = userRepository;
    }

    // GET /api/worlds - Get all worlds for logged-in user
    @GetMapping
    public List<WorldResponseDto> getAllWorlds(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return worldService.getWorldsByUser(user.getId());
    }

    // GET /api/worlds/{id} - Get world by ID (must belong to logged-in user)
    @GetMapping("/{id}")
    public WorldResponseDto getWorldById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto worldDto = worldService.getWorldById(id);
        if (!worldDto.getUsername().equals(user.getUsername())) {
            throw new IllegalStateException("Unauthorized access to world");
        }
        return worldDto;
    }

    // POST /api/worlds - Create a new world for logged-in user
    @PostMapping
    public WorldResponseDto createWorld(@RequestBody WorldRequestDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return worldService.createWorld(user.getId(), request);
    }

    // PUT /api/worlds/{id} - Update existing world (must belong to logged-in user)
    @PutMapping("/{id}")
    public WorldResponseDto updateWorld(@PathVariable Long id,
                                        @RequestBody WorldRequestDto request,
                                        Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto updatedWorld = worldService.updateWorld(id, request);
        if (!updatedWorld.getUsername().equals(user.getUsername())) {
            throw new IllegalStateException("Unauthorized access to world");
        }
        return updatedWorld;
    }

    // DELETE /api/worlds/{id} - Delete a world by ID (must belong to logged-in user)
    @DeleteMapping("/{id}")
    public String deleteWorld(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        worldService.deleteWorldIfOwnedByUser(id, user.getId());
        return "World with id " + id + " deleted successfully.";
    }

    // Helper: Get authenticated User entity from Authentication object
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}