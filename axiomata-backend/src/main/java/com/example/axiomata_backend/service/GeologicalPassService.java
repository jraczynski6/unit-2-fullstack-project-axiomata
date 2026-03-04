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

    private static final Map<String, Map<String, Double>> TECTONICS_TO_RESOURCE = Map.ofEntries(

            // DEAD worlds – generally poor, lower overall abundance
            Map.entry("dead", Map.ofEntries(
                    Map.entry("iron", 2.0), Map.entry("gold", 1.5), Map.entry("copper", 1.5), Map.entry("gems", 1.0),
                    Map.entry("coal", 1.2), Map.entry("marble", 1.2), Map.entry("obsidian", 1.0), Map.entry("crystals", 1.0),
                    Map.entry("stone", 1.8), Map.entry("spices", 0.8), Map.entry("agriculture", 1.5), Map.entry("livestock", 1.5),
                    Map.entry("timber", 1.2), Map.entry("herbs", 1.2), Map.entry("fish", 1.0), Map.entry("silk", 1.0),
                    Map.entry("textiles", 1.2)
            )),

            // STABLE worlds – moderate abundance, more balanced
            Map.entry("stable", Map.ofEntries(
                    Map.entry("iron", 2.5), Map.entry("gold", 2.0), Map.entry("copper", 2.2), Map.entry("gems", 2.0),
                    Map.entry("coal", 1.5), Map.entry("marble", 1.5), Map.entry("obsidian", 2.0), Map.entry("crystals", 2.0),
                    Map.entry("stone", 2.5), Map.entry("spices", 1.5), Map.entry("agriculture", 2.2), Map.entry("livestock", 2.2),
                    Map.entry("timber", 2.0), Map.entry("herbs", 2.0), Map.entry("fish", 2.0), Map.entry("silk", 2.0),
                    Map.entry("textiles", 2.2)
            )),

            // ACTIVE worlds – abundant, but no extreme weights
            Map.entry("active", Map.ofEntries(
                    Map.entry("iron", 2.2), Map.entry("gold", 2.0), Map.entry("copper", 2.2), Map.entry("gems", 2.2),
                    Map.entry("coal", 1.8), Map.entry("marble", 1.8), Map.entry("obsidian", 2.2), Map.entry("crystals", 2.2),
                    Map.entry("stone", 2.2), Map.entry("spices", 1.5), Map.entry("agriculture", 2.0), Map.entry("livestock", 2.0),
                    Map.entry("timber", 2.0), Map.entry("herbs", 2.0), Map.entry("fish", 2.0), Map.entry("silk", 2.0),
                    Map.entry("textiles", 2.2)
            ))
    );

    // Apply geological pass to proto.attributes, rolling attributes in sequence with dependencies
    public ProtoWorldDto apply(ProtoWorldDto proto) {
        // Step 1: WORLD_SIZE
        GeneratorEntity worldSize = rollAttribute("WORLD_SIZE", null, null);
        proto.getAttributes().put("WORLD_SIZE", worldSize.getValue());

        // Step 2: TECTONIC_ACTIVITY depends on WORLD_SIZE
        GeneratorEntity tectonicActivity = rollAttribute("TECTONIC_ACTIVITY", worldSize, WORLD_SIZE_TO_TECTONICS);
        proto.getAttributes().put("TECTONIC_ACTIVITY", tectonicActivity.getValue());

        // Step 3: DOMINANT_RESOURCE depends on TECTONIC_ACTIVITY
        GeneratorEntity dominantResource = rollAttribute("RESOURCE", tectonicActivity, TECTONICS_TO_RESOURCE);
        proto.getAttributes().put("DOMINANT_RESOURCE", dominantResource.getValue());

        // Step 4: Populate RESOURCE_POOL with abundance descriptors
        Map<String, String> resourcePool = buildResourcePool(tectonicActivity);
        proto.getAttributes().put("RESOURCE_POOL", resourcePool);

        return proto;
    }

    // Build RESOURCE_POOL based on TECTONIC_ACTIVITY and rolled RESOURCE
    private Map<String, String> buildResourcePool(GeneratorEntity tectonicActivity) {
        GeneratorCategory category = generatorCategoryRepository.findByName("RESOURCE");
        if (category == null) throw new RuntimeException("Category RESOURCE not found");

        List<GeneratorEntity> resources = generatorEntityRepository.findByCategory(category);
        if (resources.isEmpty()) throw new RuntimeException("No entities found for RESOURCE");

        Map<String, Double> adjustedWeights = new HashMap<>();
        Map<String, Double> overrides = TECTONICS_TO_RESOURCE.getOrDefault(tectonicActivity.getValue(), Map.of());

        for (GeneratorEntity r : resources) {
            double weight = overrides.getOrDefault(r.getValue(), 1.0);
            adjustedWeights.put(r.getValue(), weight);
        }

        // Map weights to descriptors
        return mapWeightsToDescriptors(adjustedWeights);
    }

    private Map<String, String> mapWeightsToDescriptors(Map<String, Double> weights) {
        Map<String, String> descriptors = new HashMap<>();
        Random random = new Random();

        for (Map.Entry<String, Double> entry : weights.entrySet()) {
            double weight = entry.getValue();

            // Convert weight into probabilities for scarce/moderate/plentiful
            double p = random.nextDouble() * weight;

            if (p < 0.33) descriptors.put(entry.getKey(), "scarce");
            else if (p < 0.66) descriptors.put(entry.getKey(), "moderate");
            else descriptors.put(entry.getKey(), "plentiful");
        }

        return descriptors;
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
            double weight = overrides.getOrDefault(e.getValue(), 1.0); // default weight = 1.0
            GeneratorEntity copy = new GeneratorEntity();
            copy.setId(e.getId());
            copy.setValue(e.getValue());
            copy.setCategory(e.getCategory());
            copy.setType(e.getType());
            copy.setBaseWeight(weight); // <-- use double directly, no cast
            adjusted.add(copy);
        }
        return adjusted;
    }
}