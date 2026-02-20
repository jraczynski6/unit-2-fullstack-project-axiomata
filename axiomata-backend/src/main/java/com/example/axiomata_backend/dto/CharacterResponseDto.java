package com.example.axiomata_backend.dto;

import com.example.axiomata_backend.model.Character;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public class CharacterResponseDto {

    private final Long id;
    private final Long worldId;
    private final Long locationId;
    private final String name;
    private final String description;
    private final Set<Long> factionIds;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // Constructor from entity
    public CharacterResponseDto(Character character) {
        this.id = character.getId();
        this.worldId = character.getWorld() != null ? character.getWorld().getId() : null;
        this.locationId = character.getLocation() != null ? character.getLocation().getId() : null;
        this.name = character.getName();
        this.description = character.getDescription();
        this.factionIds = character.getFactions() != null ?
                character.getFactions().stream().map(f -> f.getId()).collect(Collectors.toSet())
                : Set.of();
        this.createdAt = character.getCreatedAt();
        this.updatedAt = character.getUpdatedAt();
    }

    // Getters only
    public Long getId() { return id; }
    public Long getWorldId() { return worldId; }
    public Long getLocationId() { return locationId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Set<Long> getFactionIds() { return factionIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}