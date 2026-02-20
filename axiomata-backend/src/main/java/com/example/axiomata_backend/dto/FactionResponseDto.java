package com.example.axiomata_backend.dto;

import com.example.axiomata_backend.model.Faction;
import java.time.LocalDateTime;

public class FactionResponseDto {

    private final Long id;
    private final Long worldId;
    private final String name;
    private final String type;
    private final String description;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // Constructor from entity
    public FactionResponseDto(Faction faction) {
        this.id = faction.getId();
        this.worldId = faction.getWorld().getId();
        this.name = faction.getName();
        this.type = faction.getType();
        this.description = faction.getDescription();
        this.createdAt = faction.getCreatedAt();
        this.updatedAt = faction.getUpdatedAt();
    }

    // Getters only
    public Long getId() { return id; }
    public Long getWorldId() { return worldId; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}