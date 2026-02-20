package com.example.axiomata_backend.dto;

public class FactionRequestDto {
    private Long worldId;
    private String name;
    private String type;
    private String description;

    public FactionRequestDto() {}

    public FactionRequestDto(Long worldId, String name, String type, String description) {
        this.worldId = worldId;
        this.name = name;
        this.type = type;
        this.description = description;
    }

    public Long getWorldId() {
        return worldId;
    }

    public void setWorldId(Long worldId) {
        this.worldId = worldId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}