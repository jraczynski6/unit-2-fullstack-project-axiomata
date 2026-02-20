package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.CharacterRequestDto;
import com.example.axiomata_backend.dto.CharacterResponseDto;
import com.example.axiomata_backend.service.CharacterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
public class CharacterController {

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    // Create a new character
    @PostMapping
    public ResponseEntity<CharacterResponseDto> createCharacter(@RequestBody CharacterRequestDto dto) {
        CharacterResponseDto created = characterService.createCharacter(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<CharacterResponseDto> getCharacterById(@PathVariable Long id) {
        CharacterResponseDto character = characterService.getCharacterById(id);
        if (character == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Character not found");
        }
        return ResponseEntity.ok(character); // 200 OK
    }

    // Read all by World
    @GetMapping("/world/{worldId}")
    public ResponseEntity<List<CharacterResponseDto>> getCharactersByWorld(@PathVariable Long worldId) {
        List<CharacterResponseDto> characters = characterService.getCharactersByWorldId(worldId);
        return ResponseEntity.ok(characters);
    }

    // Update existing character
    @PutMapping("/{id}")
    public ResponseEntity<CharacterResponseDto> updateCharacter(@PathVariable Long id,
                                                                @RequestBody CharacterRequestDto dto) {
        CharacterResponseDto updated = characterService.updateCharacter(id, dto);
        if (updated == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Character not found");
        }
        return ResponseEntity.ok(updated); // 200 OK
    }

    // Delete a character
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id); // service should throw ResponseStatusException if not found
    }
}
