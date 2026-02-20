package com.example.axiomata_backend.dto;

import java.util.Set;

public class CharacterRequestDto {

    private Long worldId;          // ID of the world the character belongs to
    private Long locationId;       // ID of the location (nullable)
    private String name;           // Character name
    private String description;    // Character description
    private Set<Long> factionIds;  // Set of faction IDs (nullable or empty)

    // --- Getters and Setters ---
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
}