package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.*;
import com.example.axiomata_backend.exception.AccessDeniedException;
import com.example.axiomata_backend.exception.ResourceNotFoundException;
import com.example.axiomata_backend.model.*;
import com.example.axiomata_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorldService {

    private final WorldRepository worldRepository;
    private final UserRepository userRepository;

    public WorldService(WorldRepository worldRepository, UserRepository userRepository) {
        this.worldRepository = worldRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WorldResponseDto createWorld(Long userId, WorldRequestDto request) {

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("World name cannot be blank");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found"));

        World world = new World();
        world.setUser(user);
        world.setName(request.getName());
        world.setDescription(request.getDescription());
        world.setAttributes(request.getAttributes());

        return mapToResponseDto(worldRepository.save(world));
    }

    @Transactional
    public WorldResponseDto updateWorld(Long worldId, WorldRequestDto request) {

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("World name cannot be blank");
        }

        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new ResourceNotFoundException("World with ID " + worldId + " not found"));

        world.setName(request.getName());
        world.setDescription(request.getDescription());
        world.setAttributes(request.getAttributes());

        return mapToResponseDto(world);
    }

    @Transactional(readOnly = true)
    public WorldResponseDto getWorldById(Long worldId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new ResourceNotFoundException("World with ID " + worldId + " not found"));
        return mapToResponseDto(world);
    }

    @Transactional(readOnly = true)
    public List<WorldResponseDto> getWorldsByUser(Long userId) {
        return worldRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteWorld(Long worldId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new ResourceNotFoundException("World with ID " + worldId + " not found"));
        worldRepository.delete(world);
    }

    @Transactional
    public void deleteWorldIfOwnedByUser(Long worldId, Long userId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new ResourceNotFoundException("World with ID " + worldId + " not found"));

        if (!world.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized access to world");
        }

        worldRepository.delete(world);
    }

    private WorldResponseDto mapToResponseDto(World world) {
        List<LocationResponseDto> locations = world.getLocations().stream().map(LocationResponseDto::new).collect(Collectors.toList());
        List<FactionResponseDto> factions = world.getFactions().stream().map(FactionResponseDto::new).collect(Collectors.toList());
        List<CharacterResponseDto> characters = world.getCharacters().stream().map(CharacterResponseDto::new).collect(Collectors.toList());
        List<ItemResponseDto> items = world.getItems().stream().map(ItemResponseDto::new).collect(Collectors.toList());

        return new WorldResponseDto(
                world.getId(),
                world.getName(),
                world.getDescription(),
                world.getAttributes(),
                world.getUser().getUsername(),
                world.getCreatedAt(),
                world.getUpdatedAt(),
                locations,
                factions,
                characters,
                items
        );
    }
}