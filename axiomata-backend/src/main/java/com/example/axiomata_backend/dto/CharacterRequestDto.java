package com.example.axiomata_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class CharacterRequestDto {

    @NotNull(message = "World ID is required")
    private Long worldId;          // ID of the world the character belongs to

    private Long locationId;       // ID of the location (nullable)

    @NotBlank(message = "Character name is required")
    @Size(min = 1, max = 100, message = "Character name must be 1-100 characters")
    private String name;           // Character name

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;    // Character description

    private Set<Long> factionIds;  // Set of faction IDs (nullable or empty)

    // --- Getters and Setters ---
    public Long getWorldId() { return worldId; }
    public void setWorldId(Long worldId) { this.worldId = worldId; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Set<Long> getFactionIds() { return factionIds; }
    public void setFactionIds(Set<Long> factionIds) { this.factionIds = factionIds; }
}