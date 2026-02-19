package com.example.axiomata_backend.dto;

import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.model.World;

import java.time.LocalDateTime;

public class WorldDto {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String attributes; // JSON string
    private String username;

    // Constructor
    public WorldDto(Long id, String name, String description,
                    LocalDateTime createdAt, LocalDateTime updatedAt,
                    String attributes, String username) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.attributes = attributes;
        this.username = username;
    }

    // Getters & setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getAttributes() { return attributes; }
    public String getUsername() { return username; }

    // Convert DTO to Entity
    public World toEntity(User user) {
        World world = new World();
        world.setId(this.id);
        world.setName(this.name);
        world.setDescription(this.description);
        world.setCreatedAt(this.createdAt);
        world.setUpdatedAt(this.updatedAt);
        world.setAttributes(this.attributes); // keep JSON string
        world.setUser(user);
        return world;
    }
}
