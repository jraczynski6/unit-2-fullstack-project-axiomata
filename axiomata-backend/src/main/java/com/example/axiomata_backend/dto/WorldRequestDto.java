package com.example.axiomata_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

public class WorldRequestDto {

    @NotBlank(message = "World name cannot be blank")
    @Size(min = 1, max = 100, message = "World name must be 1-100 characters")
    private String name;

    @Size(max = 500, message = "Description must be at most 500 characters")
    private String description;

    private Map<String, Object> attributes; // <-- change here

    public WorldRequestDto() {}

    public WorldRequestDto(String name, String description, Map<String, Object> attributes) {
        this.name = name;
        this.description = description;
        this.attributes = attributes;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, Object> getAttributes() { return attributes; }
    public void setAttributes(Map<String, Object> attributes) { this.attributes = attributes; }
}