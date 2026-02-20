package com.example.axiomata_backend.controller;


import com.example.axiomata_backend.dto.FactionRequestDto;
import com.example.axiomata_backend.dto.FactionResponseDto;
import com.example.axiomata_backend.service.FactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/factions")
public class FactionController {

    private final FactionService factionService;

    public FactionController(FactionService factionService) {
        this.factionService = factionService;
    }

    // Create a new faction
    @PostMapping
    public ResponseEntity<FactionResponseDto> createFaction(@RequestBody @Valid FactionRequestDto dto) {
        FactionResponseDto createdFaction = factionService.createFaction(dto);
        return new ResponseEntity<>(createdFaction, HttpStatus.CREATED); // 201 Created
    }

    // Get a faction by id
    @GetMapping("/{id}")
    public ResponseEntity<FactionResponseDto> getFaction(@PathVariable Long id) {
        FactionResponseDto faction = factionService.getFactionById(id);
        if (faction == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Faction not found");
        }
        return ResponseEntity.ok(faction); // 200 OK
    }

    // Get factions by world id
    @GetMapping("/world/{worldId}")
    public ResponseEntity<List<FactionResponseDto>> getFactionsByWorld(@PathVariable Long worldId) {
        List<FactionResponseDto> factions = factionService.getFactionsByWorldId(worldId);
        return ResponseEntity.ok(factions); // 200 OK
    }

    // Update a faction
    @PutMapping("/{id}")
    public ResponseEntity<FactionResponseDto> updateFaction(@PathVariable Long id,
                                                            @RequestBody @Valid FactionRequestDto dto) {
        FactionResponseDto updatedFaction = factionService.updateFaction(id, dto);
        if (updatedFaction == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Faction not found");
        }
        return ResponseEntity.ok(updatedFaction); // 200 OK
    }

    // Delete a faction
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void deleteFaction(@PathVariable Long id) {
        factionService.deleteFaction(id); // assume service throws ResponseStatusException if not found
    }
}
