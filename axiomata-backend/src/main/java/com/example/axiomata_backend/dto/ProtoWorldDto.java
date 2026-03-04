package com.example.axiomata_backend.dto;

import java.util.Map;

public class ProtoWorldDto {

    private String worldName;
    private String description;
    private Map<String, Object> attributes;

    // Getters and setters
    public String getWorldName() { return worldName; }
    public void setWorldName(String worldName) { this.worldName = worldName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, Object> getAttributes() { return attributes; }
    public void setAttributes(Map<String, Object> attributes) { this.attributes = attributes; }
}
