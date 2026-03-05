package com.example.axiomata_backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class WorldResponseDto {
    private Long id;
    private String name;
    private String description;
    private Map<String, Object> attributes; // <-- change here
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<LocationResponseDto> locations;
    private List<FactionResponseDto> factions;
    private List<CharacterResponseDto> characters;
    private List<ItemResponseDto> items;

    public WorldResponseDto(Long id, String name, String description,
                            Map<String, Object> attributes, String username,
                            LocalDateTime createdAt, LocalDateTime updatedAt,
                            List<LocationResponseDto> locations,
                            List<FactionResponseDto> factions,
                            List<CharacterResponseDto> characters,
                            List<ItemResponseDto> items) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.attributes = attributes;
        this.username = username;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.locations = locations;
        this.factions = factions;
        this.characters = characters;
        this.items = items;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Map<String, Object> getAttributes() { return attributes; }
    public String getUsername() { return username; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<LocationResponseDto> getLocations() { return locations; }
    public List<FactionResponseDto> getFactions() { return factions; }
    public List<CharacterResponseDto> getCharacters() { return characters; }
    public List<ItemResponseDto> getItems() { return items; }
}