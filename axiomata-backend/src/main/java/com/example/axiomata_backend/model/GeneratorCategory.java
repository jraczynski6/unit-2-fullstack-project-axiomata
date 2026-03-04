package com.example.axiomata_backend.model;


import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "generator_category")
public class GeneratorCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // One category can have many entities, cascade delete
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.example.axiomata_backend.model.GeneratorEntity> entities;

    // Constructors

    public GeneratorCategory() {}

    public GeneratorCategory(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<com.example.axiomata_backend.model.GeneratorEntity> getEntities() {
        return entities;
    }

    public void setEntities(List<com.example.axiomata_backend.model.GeneratorEntity> entities) {
        this.entities = entities;
    }
}
