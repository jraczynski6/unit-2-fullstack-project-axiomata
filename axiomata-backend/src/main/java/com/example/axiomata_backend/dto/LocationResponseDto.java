package com.example.axiomata_backend.dto;

import java.time.LocalDateTime;

public class LocationResponseDto {

    private Long id;
    private Long worldId;
    private Long regionId;
    private String name;
    private String type;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LocationResponseDto() {}

    public LocationResponseDto(Long id, Long worldId, Long regionId,
                               String name, String type, String description,
                               LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.worldId = worldId;
        this.regionId = regionId;
        this.name = name;
        this.type = type;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters only for read-only usage
    public Long getId() { return id; }
    public Long getWorldId() { return worldId; }
    public Long getRegionId() { return regionId; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}