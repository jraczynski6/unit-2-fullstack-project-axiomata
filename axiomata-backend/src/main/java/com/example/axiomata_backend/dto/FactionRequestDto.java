package com.example.axiomata_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class FactionRequestDto {

    @NotNull(message = "World ID is required")
    private Long worldId;

    @NotBlank(message = "Faction name is required")
    @Size(min = 1, max = 100, message = "Faction name must be 1-100 characters")
    private String name;

    @NotBlank(message = "Faction type is required")
    @Size(min = 1, max = 50, message = "Faction type must be 1-50 characters")
    private String type;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    public FactionRequestDto() {}

    public FactionRequestDto(Long worldId, String name, String type, String description) {
        this.worldId = worldId;
        this.name = name;
        this.type = type;
        this.description = description;
    }

    public Long getWorldId() { return worldId; }
    public void setWorldId(Long worldId) { this.worldId = worldId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}