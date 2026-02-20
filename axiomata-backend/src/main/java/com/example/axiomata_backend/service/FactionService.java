package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.FactionRequestDto;
import com.example.axiomata_backend.dto.FactionResponseDto;
import com.example.axiomata_backend.exception.ResourceNotFoundException;
import com.example.axiomata_backend.model.Faction;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.FactionRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public FactionResponseDto createFaction(FactionRequestDto dto) {
        validateDto(dto);
        Faction faction = mapDtoToEntity(dto);
        return new FactionResponseDto(factionRepository.save(faction));
    }

    @Transactional(readOnly = true)
    public FactionResponseDto getFactionById(Long id) {
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faction not found with id " + id));
        return new FactionResponseDto(faction);
    }

    @Transactional(readOnly = true)
    public List<FactionResponseDto> getFactionsByWorldId(Long worldId) {
        return factionRepository.findByWorldId(worldId)
                .stream()
                .map(FactionResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public FactionResponseDto updateFaction(Long id, FactionRequestDto dto) {
        validateDto(dto);
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faction not found with id " + id));

        faction.setName(dto.getName());
        faction.setType(dto.getType());
        faction.setDescription(dto.getDescription());

        if (dto.getWorldId() != null && !faction.getWorld().getId().equals(dto.getWorldId())) {
            World world = worldRepository.findById(dto.getWorldId())
                    .orElseThrow(() -> new ResourceNotFoundException("World not found with id " + dto.getWorldId()));
            faction.setWorld(world);
        }

        return new FactionResponseDto(factionRepository.save(faction));
    }

    @Transactional
    public void deleteFaction(Long id) {
        Faction faction = factionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faction not found with id " + id));
        factionRepository.delete(faction);
    }

    private void validateDto(FactionRequestDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Faction name cannot be blank");
        }
        if (dto.getWorldId() == null) {
            throw new IllegalArgumentException("World ID is required");
        }
    }

    private Faction mapDtoToEntity(FactionRequestDto dto) {
        Faction faction = new Faction();
        faction.setName(dto.getName());
        faction.setType(dto.getType());
        faction.setDescription(dto.getDescription());

        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new ResourceNotFoundException("World not found with id " + dto.getWorldId()));
        faction.setWorld(world);

        return faction;
    }
}