package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import com.example.axiomata_backend.model.GeneratorCategory;
import com.example.axiomata_backend.model.GeneratorEntity;
import com.example.axiomata_backend.repository.GeneratorCategoryRepository;
import com.example.axiomata_backend.repository.GeneratorEntityRepository;
import com.example.axiomata_backend.util.WeightedRandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeologicalPassService {

    @Autowired
    private GeneratorCategoryRepository generatorCategoryRepository;

    @Autowired
    private GeneratorEntityRepository generatorEntityRepository;

    // Weight override maps
    private static final Map<String, Map<String, Double>> WORLD_SIZE_TO_TECTONICS = Map.of(
            "tiny", Map.of("stable", 3.0),
            "small", Map.of("stable", 1.5),
            "large", Map.of("active", 2.0),
            "giant", Map.of("active", 1.5)
    );

    private static final Map<String, Map<String, Double>> TECTONICS_TO_RESOURCE = Map.of(
            "dead", Map.of(
                    "iron", 3.0, "agriculture", 0.5, "livestock", 0.5, "timber", 0.8,
                    "herbs", 0.5, "fish", 0.5, "silk", 0.2, "textiles", 0.5
            ),
            "stable", Map.of(
                    "gold", 2.0, "agriculture", 3.0, "livestock", 3.0, "timber", 1.5,
                    "herbs", 2.0, "fish", 1.5, "silk", 1.5, "textiles", 2.0
            ),
            "active", Map.of(
                    "gems", 3.0, "agriculture", 1.0, "livestock", 1.0, "timber", 2.5,
                    "herbs", 1.5, "fish", 1.5, "silk", 2.0, "textiles", 2.0
            )
    );

    // Apply geological pass to proto.attributes, rolling attributes in sequence with dependencies
    public ProtoWorldDto apply(ProtoWorldDto proto) {
        // Step 1: WORLD_SIZE
        GeneratorEntity worldSize = rollAttribute("WORLD_SIZE", null, null);
        proto.getAttributes().put("WORLD_SIZE", worldSize.getValue());

        // Step 2: TECTONIC_ACTIVITY depends on WORLD_SIZE
        GeneratorEntity tectonicActivity = rollAttribute("TECTONIC_ACTIVITY", worldSize, WORLD_SIZE_TO_TECTONICS);
        proto.getAttributes().put("TECTONIC_ACTIVITY", tectonicActivity.getValue());

        // Step 3: RESOURCE depends on TECTONIC_ACTIVITY
        GeneratorEntity resource = rollAttribute("RESOURCE", tectonicActivity, TECTONICS_TO_RESOURCE);
        proto.getAttributes().put("RESOURCE", resource.getValue());

        return proto;
    }

    // Roll an attribute for a given category
    private GeneratorEntity rollAttribute(String categoryName, GeneratorEntity previous, Map<String, Map<String, Double>> weightMap) {
        GeneratorCategory category = generatorCategoryRepository.findByName(categoryName);
        if (category == null) {
            throw new RuntimeException("Category " + categoryName + " not found");
        }

        List<GeneratorEntity> entities = generatorEntityRepository.findByCategory(category);
        if (entities.isEmpty()) {
            throw new RuntimeException("No entities found for category " + categoryName);
        }

        // Adjust weights based on previous attribute and weight map
        List<GeneratorEntity> adjustedEntities = adjustWeights(entities, previous, weightMap);

        // weighted random selection
        return WeightedRandomUtil.pickWeighted(adjustedEntities);
    }

    private List<GeneratorEntity> adjustWeights(List<GeneratorEntity> entities, GeneratorEntity previous, Map<String, Map<String, Double>> weightMap) {
        if (previous == null || weightMap == null) return entities;

        List<GeneratorEntity> adjusted = new ArrayList<>();
        Map<String, Double> overrides = weightMap.getOrDefault(previous.getValue(), Map.of());

        for (GeneratorEntity e : entities) {
            double weight = overrides.getOrDefault(e.getValue(), 1.0); // default weight = 1
            GeneratorEntity copy = new GeneratorEntity();
            copy.setId(e.getId());
            copy.setValue(e.getValue());
            copy.setBaseWeight((int) weight);
            adjusted.add(copy);
        }
        return adjusted;
    }
}