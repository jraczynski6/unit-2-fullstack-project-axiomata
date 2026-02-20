package com.example.axiomata_backend.dto;

public class ItemRequestDto {

    private Long worldId;
    private Long locationId;
    private String name;
    private String description;

    // Getters and setters
    public Long getWorldId() { return worldId; }
    public void setWorldId(Long worldId) { this.worldId = worldId; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
