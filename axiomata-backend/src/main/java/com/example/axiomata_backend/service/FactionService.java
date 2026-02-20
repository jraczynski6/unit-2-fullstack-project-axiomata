package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.FactionRequestDto;
import com.example.axiomata_backend.dto.FactionResponseDto;
import com.example.axiomata_backend.model.Faction;
import com.example.axiomata_backend.repository.FactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FactionService {

    private final FactionRepository factionRepository;

    public FactionService(FactionRepository factionRepository) {
        this.factionRepository = factionRepository;
    }

    // Create a new faction
    public FactionResponseDto createFaction(FactionRequestDto dto) {
        Faction faction = new Faction();
        faction.setWorldId(dto.getWorldId());
        faction.setName(dto.getName());
        faction.setType(dto.getType());
        faction.setDescription(dto.getDescription());

        Faction savedFaction = factionRepository.save(faction);
        return mapToDto(savedFaction);
    }

    // read factions by id
    public FactionResponseDto getFactionById(Long id) {
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faction not found"));
        return mapToDto(faction);
    }

    // read factions by world id
    public List<FactionResponseDto> getFactionsByWorldId(Long worldId) {
        List<Faction> factions = factionRepository.findByWorldId(worldId);
        return factions.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // Update a faction
    public FactionResponseDto updateFaction(Long id, FactionRequestDto dto) {
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faction not found"));

        faction.setName(dto.getName());
        faction.setType(dto.getType());
        faction.setDescription(dto.getDescription());

        Faction updatedFaction = factionRepository.save(faction);
        return mapToDto(updatedFaction);
    }

    // Delete a faction
    public void deleteFaction(Long id) {
        factionRepository.deleteById(id);
    }

    // Mapper
    private FactionResponseDto mapToDto(Faction faction) {
        FactionResponseDto dto = new FactionResponseDto();
        dto.setId(faction.getId());
        dto.setWorldId(faction.getWorldId());
        dto.setName(faction.getName());
        dto.setType(faction.getType());
        dto.setDescription(faction.getDescription());
        dto.setCreatedAt(faction.getCreatedAt());
        dto.setUpdatedAt(faction.getUpdatedAt());
        return dto;
    }
}
