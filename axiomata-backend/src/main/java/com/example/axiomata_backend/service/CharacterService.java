package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.CharacterRequestDto;
import com.example.axiomata_backend.dto.CharacterResponseDto;
import com.example.axiomata_backend.exception.ResourceNotFoundException;
import com.example.axiomata_backend.model.Character;
import com.example.axiomata_backend.model.Faction;
import com.example.axiomata_backend.model.Location;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.CharacterRepository;
import com.example.axiomata_backend.repository.FactionRepository;
import com.example.axiomata_backend.repository.LocationRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public CharacterResponseDto createCharacter(CharacterRequestDto dto) {
        validateDto(dto);
        Character character = mapDtoToEntity(dto);
        return new CharacterResponseDto(characterRepository.save(character));
    }

    @Transactional(readOnly = true)
    public CharacterResponseDto getCharacterById(Long id) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id " + id));
        return new CharacterResponseDto(character);
    }

    @Transactional(readOnly = true)
    public List<CharacterResponseDto> getCharactersByWorldId(Long worldId) {
        return characterRepository.findByWorldId(worldId)
                .stream()
                .map(CharacterResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CharacterResponseDto updateCharacter(Long id, CharacterRequestDto dto) {
        validateDto(dto);
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id " + id));
        mapDtoToEntity(dto, character);
        return new CharacterResponseDto(characterRepository.save(character));
    }

    @Transactional
    public void deleteCharacter(Long id) {
        Character character = characterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id " + id));
        characterRepository.delete(character);
    }

    private void validateDto(CharacterRequestDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Character name cannot be blank");
        }
        if (dto.getWorldId() == null) {
            throw new IllegalArgumentException("World ID is required");
        }
    }

    private Character mapDtoToEntity(CharacterRequestDto dto) {
        Character character = new Character();
        return mapDtoToEntity(dto, character);
    }

    private Character mapDtoToEntity(CharacterRequestDto dto, Character character) {

        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new ResourceNotFoundException("World not found with id " + dto.getWorldId()));
        character.setWorld(world);

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + dto.getLocationId()));
            character.setLocation(location);
        } else {
            character.setLocation(null);
        }

        character.setName(dto.getName());
        character.setDescription(dto.getDescription());

        if (character.getFactions() == null) {
            character.setFactions(new java.util.HashSet<>());
        }
        character.getFactions().clear();
        if (dto.getFactionIds() != null) {
            for (Long fid : dto.getFactionIds()) {
                Faction faction = factionRepository.findById(fid)
                        .orElseThrow(() -> new ResourceNotFoundException("Faction not found with id " + fid));
                character.getFactions().add(faction);
            }
        }

        return character;
    }
}