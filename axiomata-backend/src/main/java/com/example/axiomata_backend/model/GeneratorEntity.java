package com.example.axiomata_backend.model;

import com.example.axiomata_backend.model.GeneratorCategory;
import jakarta.persistence.*;

@Entity
@Table(name = "generator_entity")
public class GeneratorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many entities belong to one category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private GeneratorCategory category;

    @Column(nullable = false)
    private String value;

    @Column(nullable = false)
    private String type;

    @Column(name = "base_weight", nullable = false)
    private double baseWeight = 1;

    // Constructors
    public GeneratorEntity() {}

    public GeneratorEntity(GeneratorCategory category, String value, String type, Integer baseWeight) {
        this.category = category;
        this.value = value;
        this.type = type;
        this.baseWeight = baseWeight;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GeneratorCategory getCategory() { return category; }
    public void setCategory(GeneratorCategory category) { this.category = category; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getBaseWeight() { return baseWeight; }
    public void setBaseWeight(double baseWeight) { this.baseWeight = baseWeight; }
}