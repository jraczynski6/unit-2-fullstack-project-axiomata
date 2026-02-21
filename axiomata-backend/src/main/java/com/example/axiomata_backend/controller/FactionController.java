package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.FactionRequestDto;
import com.example.axiomata_backend.dto.FactionResponseDto;
import com.example.axiomata_backend.service.FactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    @ResponseStatus(HttpStatus.CREATED)
    public FactionResponseDto createFaction(@RequestBody @Valid FactionRequestDto dto) {
        return factionService.createFaction(dto); // 201 Created
    }

    // Get a faction by ID
    @GetMapping("/{id}")
    public FactionResponseDto getFaction(@PathVariable Long id) {
        return factionService.getFactionById(id); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Get factions by world ID
    @GetMapping("/world/{worldId}")
    public List<FactionResponseDto> getFactionsByWorld(@PathVariable Long worldId) {
        return factionService.getFactionsByWorldId(worldId); // 200 OK
    }

    // Update a faction
    @PutMapping("/{id}")
    public FactionResponseDto updateFaction(@PathVariable Long id,
                                            @RequestBody @Valid FactionRequestDto dto) {
        return factionService.updateFaction(id, dto); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Delete a faction
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void deleteFaction(@PathVariable Long id) {
        factionService.deleteFaction(id); // ResourceNotFoundException if faction not found
    }
}