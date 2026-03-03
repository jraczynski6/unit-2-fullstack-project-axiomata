package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import com.example.axiomata_backend.model.GeneratorCategory;
import com.example.axiomata_backend.model.GeneratorEntity;
import com.example.axiomata_backend.repository.GeneratorCategoryRepository;
import com.example.axiomata_backend.repository.GeneratorEntityRepository;
import com.example.axiomata_backend.util.WeightedRandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CulturalPassService {

    @Autowired
    private GeneratorCategoryRepository generatorCategoryRepository;

    @Autowired
    private GeneratorEntityRepository generatorEntityRepository;

    // Species-to-culture influence (multiplicative)
    private static final Map<String, Map<String, Double>> SPECIES_TO_CULTURE_WEIGHT = Map.of(
            "human", Map.of("militaristic", 1.2, "agrarian", 1.5, "mercantile", 1.5, "nomadic", 1.0),
            "elf", Map.of("scholarly", 1.5, "mystical", 1.5, "artistic", 1.2),
            "dwarf", Map.of("industrial", 1.5, "mercantile", 1.2),
            "beast-folk", Map.of("tribal", 1.5, "nomadic", 1.2),
            "daemon", Map.of("militaristic", 1.5, "mystical", 1.2),
            "monsters", Map.of("militaristic", 1.2, "tribal", 1.2)
    );

    // Dominant resource-to-culture influence (stronger multiplier)
    private static final Map<String, Map<String, Double>> RESOURCE_TO_CULTURE_WEIGHT = Map.of(
            "iron", Map.of("militaristic", 2.0, "industrial", 1.5),
            "gold", Map.of("mercantile", 2.0, "artistic", 1.5),
            "agriculture", Map.of("agrarian", 2.0, "scholarly", 1.2),
            "timber", Map.of("tribal", 1.5, "nomadic", 1.2),
            "fish", Map.of("nomadic", 1.5, "mercantile", 1.2)
    );

    public ProtoWorldDto apply(ProtoWorldDto proto) {

        // 1. Load CULTURE category and entities from DB
        List<GeneratorEntity> cultures = fetchEntitiesByCategory("CULTURE");

        // 2. Adjust weights based on dominant species and dominant resource
        List<GeneratorEntity> adjustedCultures = adjustWeights(cultures, proto);

        // 3. Pick Dominant Culture using weightedRandomUtil.pickWeighted and store in proto.attributes
        GeneratorEntity dominantCulture = WeightedRandomUtil.pickWeighted(adjustedCultures);
        proto.getAttributes().put("DOMINANT_CULTURE", dominantCulture.getValue());

        return proto;
    }

    private List<GeneratorEntity> fetchEntitiesByCategory(String categoryName) {
        GeneratorCategory category = generatorCategoryRepository.findByName(categoryName);
        if (category == null) {
            throw new RuntimeException("Category " + categoryName + " not found");
        }

        List<GeneratorEntity> entities = generatorEntityRepository.findByCategory(category);
        if (entities.isEmpty()) {
            throw new RuntimeException("No entities found for category " + categoryName);
        }

        return entities;
    }

    private List<GeneratorEntity> adjustWeights(List<GeneratorEntity> cultures, ProtoWorldDto proto) {

        // 1. Get dominant species and resource from proto.attributes
        String dominantSpecies = (String) proto.getAttributes().get("DOMINANT_SPECIES");
        String dominantResource = (String) proto.getAttributes().get("DOMINANT_RESOURCE");

        // 2. Fetch override maps from static final maps
        Map<String, Double> speciesOverrides = dominantSpecies != null
                ? SPECIES_TO_CULTURE_WEIGHT.getOrDefault(dominantSpecies, Map.of())
                : Map.of();
        Map<String, Double> resourceOverrides = dominantResource != null
                ? RESOURCE_TO_CULTURE_WEIGHT.getOrDefault(dominantResource, Map.of())
                : Map.of();

        // 3. Apply multipliers and create copies
        List<GeneratorEntity> adjusted = new ArrayList<>();
        for (GeneratorEntity c : cultures) {
            double weight = c.getBaseWeight();
            weight *= speciesOverrides.getOrDefault(c.getValue(), 1.0);
            weight *= resourceOverrides.getOrDefault(c.getValue(), 1.0);
            if (weight <= 0.0) weight = 0.1;

            // Copy entity
            GeneratorEntity copy = new GeneratorEntity();
            copy.setId(c.getId());
            copy.setValue(c.getValue());
            copy.setCategory(c.getCategory());
            copy.setType(c.getType());
            copy.setBaseWeight(weight);

            adjusted.add(copy);
        }

        return adjusted;
    }

}