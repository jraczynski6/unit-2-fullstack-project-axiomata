package com.example.axiomata_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "worlds")
public class World {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String attributes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    // Child entities - cascade delete

    @OneToMany(mappedBy = "world", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Location> locations;

    @OneToMany(mappedBy = "world", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Faction> factions;

    @OneToMany(mappedBy = "world", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Character> characters;

    @OneToMany(mappedBy = "world", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;


    // Automatically set timestamps

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAttributes() { return attributes; }
    public void setAttributes(String attributes) { this.attributes = attributes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<Location> getLocations() { return locations; }
    public void setLocations(List<Location> locations) { this.locations = locations; }

    public List<Faction> getFactions() { return factions; }
    public void setFactions(List<Faction> factions) { this.factions = factions; }

    public List<Character> getCharacters() { return characters; }
    public void setCharacters(List<Character> characters) { this.characters = characters; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}