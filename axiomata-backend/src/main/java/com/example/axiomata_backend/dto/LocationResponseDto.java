package com.example.axiomata_backend.dto;

import com.example.axiomata_backend.model.Location;
import java.time.LocalDateTime;

public class LocationResponseDto {
    private final Long id;
    private final Long worldId;
    private final Long regionId;
    private final String name;
    private final String type;
    private final String description;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // **New constructor taking a Location entity**
    public LocationResponseDto(Location location) {
        this.id = location.getId();
        this.worldId = location.getWorld().getId();
        this.regionId = location.getRegion() != null ? location.getRegion().getId() : null;
        this.name = location.getName();
        this.type = location.getType();
        this.description = location.getDescription();
        this.createdAt = location.getCreatedAt();
        this.updatedAt = location.getUpdatedAt();
    }

    public Long getId() { return id; }
    public Long getWorldId() { return worldId; }
    public Long getRegionId() { return regionId; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}