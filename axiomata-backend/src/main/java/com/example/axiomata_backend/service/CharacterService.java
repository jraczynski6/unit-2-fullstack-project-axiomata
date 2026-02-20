package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.CharacterRequestDto;
import com.example.axiomata_backend.dto.CharacterResponseDto;
import com.example.axiomata_backend.model.Character;
import com.example.axiomata_backend.model.Faction;
import com.example.axiomata_backend.model.Location;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.CharacterRepository;
import com.example.axiomata_backend.repository.FactionRepository;
import com.example.axiomata_backend.repository.LocationRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CharacterService {

    private final CharacterRepository characterRepository;
    private final WorldRepository worldRepository;
    private final LocationRepository locationRepository;
    private final FactionRepository factionRepository;

    public CharacterService(CharacterRepository characterRepository,
                            WorldRepository worldRepository,
                            LocationRepository locationRepository,
                            FactionRepository factionRepository) {
        this.characterRepository = characterRepository;
        this.worldRepository = worldRepository;
        this.locationRepository = locationRepository;
        this.factionRepository = factionRepository;
    }

    // --- CRUD Operations ---

    @Transactional
    public CharacterResponseDto createCharacter(CharacterRequestDto dto) {
        Character character = mapDtoToEntity(dto);
        Character saved = characterRepository.save(character);
        return new CharacterResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public CharacterResponseDto getCharacterById(Long id) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Character not found with id " + id));
        return new CharacterResponseDto(character);
    }

    @Transactional(readOnly = true)
    public List<CharacterResponseDto> getCharactersByWorldId(Long worldId) {
        List<Character> characters = characterRepository.findByWorldId(worldId);
        return characters.stream()
                .map(CharacterResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CharacterResponseDto updateCharacter(Long id, CharacterRequestDto dto) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Character not found with id " + id));

        mapDtoToEntity(dto, character);
        Character updated = characterRepository.save(character);
        return new CharacterResponseDto(updated);
    }

    @Transactional
    public void deleteCharacter(Long id) {
        if (!characterRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Character not found with id " + id);
        }
        characterRepository.deleteById(id);
    }

    // --- Mapper: DTO → Entity ---
    private Character mapDtoToEntity(CharacterRequestDto dto) {
        Character character = new Character();
        return mapDtoToEntity(dto, character);
    }

    private Character mapDtoToEntity(CharacterRequestDto dto, Character character) {

        // Set World (required)
        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "World not found with id " + dto.getWorldId()));
        character.setWorld(world);

        // Set Location (optional)
        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with id " + dto.getLocationId()));
            character.setLocation(location);
        } else {
            character.setLocation(null);
        }

        // Set basic fields
        character.setName(dto.getName());
        character.setDescription(dto.getDescription());

        // Set Factions safely
        if (character.getFactions() == null) {
            character.setFactions(new java.util.HashSet<>());
        }
        character.getFactions().clear();
        if (dto.getFactionIds() != null && !dto.getFactionIds().isEmpty()) {
            for (Long fid : dto.getFactionIds()) {
                Faction faction = factionRepository.findById(fid)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Faction not found with id " + fid));
                character.getFactions().add(faction);
            }
        }

        return character;
    }
}