package com.example.axiomata_backend.dto;

import com.example.axiomata_backend.model.Item;
import java.time.LocalDateTime;

public class ItemResponseDto {

    private final Long id;
    private final Long worldId;
    private final Long locationId;
    private final String name;
    private final String description;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // Constructor from entity
    public ItemResponseDto(Item item) {
        this.id = item.getId();
        this.worldId = item.getWorld() != null ? item.getWorld().getId() : null;
        this.locationId = item.getLocation() != null ? item.getLocation().getId() : null;
        this.name = item.getName();
        this.description = item.getDescription();
        this.createdAt = item.getCreatedAt();
        this.updatedAt = item.getUpdatedAt();
    }

    // Getters only
    public Long getId() { return id; }
    public Long getWorldId() { return worldId; }
    public Long getLocationId() { return locationId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}