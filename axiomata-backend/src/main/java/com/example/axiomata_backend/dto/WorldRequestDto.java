package com.example.axiomata_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class WorldRequestDto {

    @NotBlank(message = "World name cannot be blank")
    @Size(min = 1, max = 100, message = "World name must be 1-100 characters")
    private String name;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    @Size(max = 5000, message = "Attributes JSON must be at most 5000 characters")
    private String attributes; // JSON string

    public WorldRequestDto() {}

    public WorldRequestDto(String name, String description, String attributes) {
        this.name = name;
        this.description = description;
        this.attributes = attributes;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAttributes() { return attributes; }
    public void setAttributes(String attributes) { this.attributes = attributes; }
}