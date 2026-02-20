package com.example.axiomata_backend.dto;

import java.time.LocalDateTime;
import java.util.Set;

public class CharacterResponseDto {

    private Long id;
    private Long worldId;
    private Long locationId;
    private String name;
    private String description;
    private Set<Long> factionIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getWorldId() {
        return worldId;
    }
    public void setWorldId(Long worldId) {
        this.worldId = worldId;
    }

    public Long getLocationId() {
        return locationId;
    }
    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Long> getFactionIds() {
        return factionIds;
    }
    public void setFactionIds(Set<Long> factionIds) {
        this.factionIds = factionIds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
