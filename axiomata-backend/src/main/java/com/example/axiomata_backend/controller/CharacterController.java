package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.CharacterRequestDto;
import com.example.axiomata_backend.dto.CharacterResponseDto;
import com.example.axiomata_backend.service.CharacterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
    @ResponseStatus(HttpStatus.CREATED)
    public CharacterResponseDto createCharacter(@RequestBody @Valid CharacterRequestDto dto) {
        return characterService.createCharacter(dto); // 201 Created
    }

    // Read a character by ID
    @GetMapping("/{id}")
    public CharacterResponseDto getCharacterById(@PathVariable Long id) {
        return characterService.getCharacterById(id); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Read all characters by world ID
    @GetMapping("/world/{worldId}")
    public List<CharacterResponseDto> getCharactersByWorld(@PathVariable Long worldId) {
        return characterService.getCharactersByWorldId(worldId); // 200 OK
    }

    // Update an existing character
    @PutMapping("/{id}")
    public CharacterResponseDto updateCharacter(@PathVariable Long id,
                                                @RequestBody @Valid CharacterRequestDto dto) {
        return characterService.updateCharacter(id, dto); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Delete a character
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void deleteCharacter(@PathVariable Long id) {
        characterService.deleteCharacter(id); // ResourceNotFoundException if character not found
    }
}