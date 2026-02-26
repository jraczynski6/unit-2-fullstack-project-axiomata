package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.*;
import com.example.axiomata_backend.exception.AccessDeniedException;
import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.repository.UserRepository;
import com.example.axiomata_backend.service.WorldService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.axiomata_backend.service.LocationService;
import com.example.axiomata_backend.service.FactionService;
import com.example.axiomata_backend.service.CharacterService;
import com.example.axiomata_backend.service.ItemService;

import java.util.*;

@RestController
@RequestMapping("/api/worlds")
public class WorldController {

    private final WorldService worldService;
    private final UserRepository userRepository;
    private final LocationService locationService;
    private final FactionService factionService;
    private final CharacterService characterService;
    private final ItemService itemService;

    public WorldController(WorldService worldService, UserRepository userRepository,
                           LocationService locationService, FactionService factionService,
                           CharacterService characterService, ItemService itemService) {
        this.worldService = worldService;
        this.userRepository = userRepository;
        this.locationService = locationService;
        this.factionService = factionService;
        this.characterService = characterService;
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<WorldResponseDto>> getAllWorlds(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(worldService.getWorldsByUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorldResponseDto> getWorldById(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto worldDto = worldService.getWorldById(id);

        if (!worldDto.getUsername().equals(user.getUsername())) {
            throw new AccessDeniedException("Unauthorized access to world");
        }
        return ResponseEntity.ok(worldDto);
    }

    @PostMapping
    public ResponseEntity<WorldResponseDto> createWorld(@RequestBody @Valid WorldRequestDto request,
                                                        Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto createdWorld = worldService.createWorld(user.getId(), request);
        return new ResponseEntity<>(createdWorld, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorldResponseDto> updateWorld(@PathVariable Long id,
                                                        @RequestBody @Valid WorldRequestDto request,
                                                        Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        WorldResponseDto updatedWorld = worldService.updateWorld(id, request);

        if (!updatedWorld.getUsername().equals(user.getUsername())) {
            throw new AccessDeniedException("Unauthorized access to world");
        }
        return ResponseEntity.ok(updatedWorld);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorld(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        worldService.deleteWorldIfOwnedByUser(id, user.getId());
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User not authenticated");
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Map DTO to generic map with entityType for frontend
    private Map<String, Object> toMapWithType(Object dto, String entityType) {
        Map<String, Object> map = new HashMap<>();
        map.put("entityType", entityType); // used by frontend to group

        if (dto instanceof LocationResponseDto l) {
            map.put("name", l.getName());
            map.put("description", l.getDescription());
            map.put("locationType", l.getType()); // renamed
        } else if (dto instanceof FactionResponseDto f) {
            map.put("name", f.getName());
            map.put("description", f.getDescription());
            map.put("factionType", f.getType()); // renamed
        } else if (dto instanceof CharacterResponseDto c) {
            map.put("name", c.getName());
            map.put("description", c.getDescription());
            map.put("factionIds", c.getFactionIds());
        } else if (dto instanceof ItemResponseDto i) {
            map.put("name", i.getName());
            map.put("description", i.getDescription());
        }

        return map;
    }
}