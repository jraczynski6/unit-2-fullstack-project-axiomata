package com.example.axiomata_backend.controller;


import com.example.axiomata_backend.dto.FactionRequestDto;
import com.example.axiomata_backend.dto.FactionResponseDto;
import com.example.axiomata_backend.service.FactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<FactionResponseDto> createFaction(@RequestBody FactionRequestDto dto) {
        FactionResponseDto createdFaction = factionService.createFaction(dto);
        return ResponseEntity.ok(createdFaction);
    }

    // Get a faction by id
    @GetMapping("/{id}")
    public ResponseEntity<FactionResponseDto> getFaction(@PathVariable Long id) {
        FactionResponseDto faction = factionService.getFactionById(id);
        return ResponseEntity.ok(faction);
    }

    // Get factions by world id
    @GetMapping("/world/{worldId}")
    public ResponseEntity<List<FactionResponseDto>> getFactionsByWorld(@PathVariable Long worldId) {
        List<FactionResponseDto> factions = factionService.getFactionsByWorldId(worldId);
        return ResponseEntity.ok(factions);
    }

    // Update a faction
    @PutMapping("/{id}")
    public ResponseEntity<FactionResponseDto> updateFaction(
            @PathVariable Long id,
            @RequestBody FactionRequestDto dto) {
        FactionResponseDto updatedFaction = factionService.updateFaction(id, dto);
        return ResponseEntity.ok(updatedFaction);
    }

    // Delete a faction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaction(@PathVariable Long id) {
        factionService.deleteFaction(id);
        return ResponseEntity.noContent().build();
    }
}
