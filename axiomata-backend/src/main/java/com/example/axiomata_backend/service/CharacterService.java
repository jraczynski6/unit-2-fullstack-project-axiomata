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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
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

    // Create a new character
    public CharacterResponseDto createCharacter(CharacterRequestDto dto) {
        Character character = new Character();
        mapDtoToEntity(dto, character);
        Character saved = characterRepository.save(character);
        return mapEntityToDto(saved);
    }

    // Read by ID
    public CharacterResponseDto getCharacterById(Long id) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found"));
        return mapEntityToDto(character);
    }

    // Read all by World
    public List<CharacterResponseDto> getCharactersByWorldId(Long worldId) {
        List<Character> characters = characterRepository.findByWorldId(worldId);
        return characters.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    // Update existing character
    public CharacterResponseDto updateCharacter(Long id, CharacterRequestDto dto) {
        System.out.println("Updating character id=" + id + " with locationId=" + dto.getLocationId());
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Character not found"));

        mapDtoToEntity(dto, character);
        Character updated = characterRepository.save(character);
        return mapEntityToDto(updated);
    }

    // Delete character by ID
    public void deleteCharacter(Long id) {
        characterRepository.deleteById(id);
    }

    // Mapper: DTO → Entity
    private void mapDtoToEntity(CharacterRequestDto dto, Character character) {

        // Set World
        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new RuntimeException("World not found"));
        character.setWorld(world);

        // Set Location
        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found"));
            character.setLocation(location);
        } else {
            character.setLocation(null);
        }

        // Set basic fields
        character.setName(dto.getName());
        character.setDescription(dto.getDescription());

        // Set Factions safely (mutate existing collection instead of replacing)
        if (character.getFactions() == null) {
            character.setFactions(new java.util.HashSet<>()); // initialize if null
        }
        character.getFactions().clear(); // remove existing
        if (dto.getFactionIds() != null && !dto.getFactionIds().isEmpty()) {
            for (Long fid : dto.getFactionIds()) {
                Faction faction = factionRepository.findById(fid)
                        .orElseThrow(() -> new RuntimeException("Faction not found with ID: " + fid));
                character.getFactions().add(faction);
            }
        }
    }

    // --- Mapper: Entity → DTO ---
    private CharacterResponseDto mapEntityToDto(Character character) {
        CharacterResponseDto dto = new CharacterResponseDto();

        dto.setId(character.getId());
        dto.setWorldId(character.getWorld() != null ? character.getWorld().getId() : null);
        dto.setLocationId(character.getLocation() != null ? character.getLocation().getId() : null);
        dto.setName(character.getName());
        dto.setDescription(character.getDescription());

        if (character.getFactions() != null && !character.getFactions().isEmpty()) {
            Set<Long> factionIds = character.getFactions().stream()
                    .map(Faction::getId)
                    .collect(Collectors.toSet());
            dto.setFactionIds(factionIds);
        } else {
            dto.setFactionIds(Set.of());
        }

        dto.setCreatedAt(character.getCreatedAt());
        dto.setUpdatedAt(character.getUpdatedAt());

        return dto;
    }
}