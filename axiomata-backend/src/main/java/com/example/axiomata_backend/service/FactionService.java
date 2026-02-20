package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.FactionRequestDto;
import com.example.axiomata_backend.dto.FactionResponseDto;
import com.example.axiomata_backend.model.Faction;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.FactionRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FactionService {

    private final FactionRepository factionRepository;
    private final WorldRepository worldRepository;

    public FactionService(FactionRepository factionRepository,
                          WorldRepository worldRepository) {
        this.factionRepository = factionRepository;
        this.worldRepository = worldRepository;
    }

    // --- CRUD Operations ---

    @Transactional
    public FactionResponseDto createFaction(FactionRequestDto dto) {
        Faction faction = mapDtoToEntity(dto);
        Faction saved = factionRepository.save(faction);
        return new FactionResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public FactionResponseDto getFactionById(Long id) {
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Faction not found with id " + id));
        return new FactionResponseDto(faction);
    }

    @Transactional(readOnly = true)
    public List<FactionResponseDto> getFactionsByWorldId(Long worldId) {
        List<Faction> factions = factionRepository.findByWorldId(worldId);
        return factions.stream()
                .map(FactionResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public FactionResponseDto updateFaction(Long id, FactionRequestDto dto) {
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Faction not found with id " + id));

        faction.setName(dto.getName());
        faction.setType(dto.getType());
        faction.setDescription(dto.getDescription());

        // Update world if changed
        if (dto.getWorldId() != null && !faction.getWorld().getId().equals(dto.getWorldId())) {
            World world = worldRepository.findById(dto.getWorldId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "World not found with id " + dto.getWorldId()));
            faction.setWorld(world);
        }

        Faction updated = factionRepository.save(faction);
        return new FactionResponseDto(updated);
    }

    @Transactional
    public void deleteFaction(Long id) {
        if (!factionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Faction not found with id " + id);
        }
        factionRepository.deleteById(id); // cascades to Character relationships if configured
    }

    // --- Mapper: DTO → Entity ---
    private Faction mapDtoToEntity(FactionRequestDto dto) {
        Faction faction = new Faction();

        // Set basic fields
        faction.setName(dto.getName());
        faction.setType(dto.getType());
        faction.setDescription(dto.getDescription());

        // Set World entity
        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "World not found with id " + dto.getWorldId()));
        faction.setWorld(world);

        return faction;
    }
}