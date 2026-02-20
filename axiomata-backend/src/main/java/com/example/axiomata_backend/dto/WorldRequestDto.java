package com.example.axiomata_backend.dto;

public class WorldRequestDto {
    private String name;
    private String description;
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