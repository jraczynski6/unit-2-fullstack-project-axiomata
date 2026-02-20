package com.example.axiomata_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LocationRequestDto {

    @NotNull(message = "World ID is required")
    private Long worldId;

    private Long regionId; // optional parent region

    @NotBlank(message = "Location name is required")
    private String name;

    @NotBlank(message = "Location type is required")
    private String type;

    private String description; // optional

    public LocationRequestDto() {}

    // Getters & setters
    public Long getWorldId() { return worldId; }
    public void setWorldId(Long worldId) { this.worldId = worldId; }

    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}