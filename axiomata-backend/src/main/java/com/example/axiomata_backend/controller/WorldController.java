package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.WorldRequestDto;
import com.example.axiomata_backend.dto.WorldResponseDto;
import com.example.axiomata_backend.exception.AccessDeniedException;
import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.repository.UserRepository;
import com.example.axiomata_backend.service.WorldService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<WorldResponseDto>> getAllWorlds(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<WorldResponseDto> worlds = worldService.getWorldsByUser(user.getId());
        return ResponseEntity.ok(worlds); // 200 OK
    }

    // GET /api/worlds/{id} - Get world by ID (must belong to logged-in user)
    @GetMapping("/{id}")
    public ResponseEntity<WorldResponseDto> getWorldById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto worldDto = worldService.getWorldById(id);

        if (!worldDto.getUsername().equals(user.getUsername())) {
            throw new AccessDeniedException("Unauthorized access to world"); // handled by global handler
        }

        return ResponseEntity.ok(worldDto); // 200 OK
    }

    // POST /api/worlds - Create a new world for logged-in user
    @PostMapping
    public ResponseEntity<WorldResponseDto> createWorld(@RequestBody @Valid WorldRequestDto request,
                                                        Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto createdWorld = worldService.createWorld(user.getId(), request);
        return new ResponseEntity<>(createdWorld, HttpStatus.CREATED); // 201 Created
    }

    // PUT /api/worlds/{id} - Update existing world (must belong to logged-in user)
    @PutMapping("/{id}")
    public ResponseEntity<WorldResponseDto> updateWorld(@PathVariable Long id,
                                                        @RequestBody @Valid WorldRequestDto request,
                                                        Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto updatedWorld = worldService.updateWorld(id, request);

        if (!updatedWorld.getUsername().equals(user.getUsername())) {
            throw new AccessDeniedException("Unauthorized access to world"); // handled by global handler
        }

        return ResponseEntity.ok(updatedWorld); // 200 OK
    }

    // DELETE /api/worlds/{id} - Delete a world by ID (must belong to logged-in user)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorld(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        worldService.deleteWorldIfOwnedByUser(id, user.getId()); // just call service, exceptions handled globally
    }

    // Helper: Get authenticated User entity from Authentication object
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found")); // could also make this a ResourceNotFoundException
    }
}