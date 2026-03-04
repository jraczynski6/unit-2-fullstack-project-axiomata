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

    // Dominant culture-to-social structure influence (multiplicative)
    private static final Map<String, Map<String, Double>> CULTURE_TO_SOCIAL_WEIGHT = Map.of(
            "militaristic", Map.of("monarchy", 1.5, "feudal", 1.8, "Oligarchy", 1.3),
            "agrarian", Map.of("feudal", 2.0, "theocracy", 1.5, "communal", 1.3),
            "mercantile", Map.of("oligarchy", 2.0, "democracy", 1.5),
            "tribal", Map.of("tribal council", 2.5, "communal", 1.5),
            "industrial", Map.of("oligarchy", 1.8, "democracy", 1.5, "monarchy", 1.2),
            "scholarly", Map.of("magocracy", 2.0, "democracy", 1.3),
            "mystical", Map.of("theocracy", 2.0, "magocracy", 1.5),
            "artistic", Map.of("oligarchy", 1.3, "democracy", 1.5),
            "nomadic", Map.of("tribal council", 1.8, "communal", 1.5)
    );

    // Dominant social structure-to-tech level influence (multiplicative)
    private static final Map<String, Map<String, Double>> SOCIAL_TO_TECH_LEVEL_WEIGHT = Map.of(
            "monarchy", Map.of("primitive", 0.8, "medieval", 1.2, "industrial", 1.5, "technomagical", 1.0),
            "magocracy", Map.of("primitive", 0.5, "medieval", 1.0, "industrial", 1.3, "technomagical", 2.0),
            "oligarchy", Map.of("primitive", 0.5, "medieval", 1.2, "industrial", 2.0, "technomagical", 1.2),
            "democracy", Map.of("primitive", 0.6, "medieval", 1.3, "industrial", 1.5, "technomagical", 1.0),
            "theocracy", Map.of("primitive", 1.0, "medieval", 1.5, "industrial", 1.2, "technomagical", 0.8),
            "tribal council", Map.of("primitive", 2.0, "medieval", 1.0, "industrial", 0.5, "technomagical", 0.3),
            "feudal", Map.of("primitive", 1.0, "medieval", 1.5, "industrial", 1.3, "technomagical", 0.5),
            "communal", Map.of("primitive", 1.5, "medieval", 1.2, "industrial", 0.8, "technomagical", 0.3)
    );

    // Dominant resource-to-tech level influence (multiplicative)
    private static final Map<String, Map<String, Double>> RESOURCE_TO_TECH_LEVEL_WEIGHT = Map.of(
            "iron", Map.of("industrial", 2.0, "technomagical", 1.2),
            "gold", Map.of("technomagical", 1.5, "industrial", 1.2),
            "agriculture", Map.of("medieval", 1.5, "primitive", 1.2),
            "timber", Map.of("primitive", 1.5, "medieval", 1.2),
            "fish", Map.of("primitive", 1.2)
    );

    // Dominant social structure-to-religion influence (multiplicative)
    private static final Map<String, Map<String, Double>> SOCIAL_TO_RELIGION_WEIGHT = Map.of(
            "monarchy", Map.of("organized religion", 1.5, "mono-pantheon", 1.2, "polytheistic", 1.0,
                    "ancestor worship", 0.8, "animistic", 0.5, "philosophical", 0.5, "mystical", 0.8),
            "magocracy", Map.of("organized religion", 1.0, "mono-pantheon", 1.5, "polytheistic", 1.2,
                    "philosophical", 1.3, "mystical", 1.2),
            "oligarchy", Map.of("organized religion", 1.0, "polytheistic", 1.5,
                    "philosophical", 1.5, "mono-pantheon", 1.2),
            "democracy", Map.of("organized religion", 0.8, "polytheistic", 1.3,
                    "philosophical", 1.5, "mono-pantheon", 1.0),
            "theocracy", Map.of("organized religion", 2.0, "polytheistic", 1.5,
                    "ancestor worship", 1.3, "animistic", 1.2),
            "tribal council", Map.of("ancestor worship", 1.8, "animistic", 1.5, "polytheistic", 1.2),
            "feudal", Map.of("organized religion", 1.5, "mono-pantheon", 1.2, "ancestor worship", 1.2),
            "communal", Map.of("ancestor worship", 1.5, "animistic", 1.3, "philosophical", 1.2)
    );

    // Dominant Culture to Conflict Level influence (multiplicative)
    private static final Map<String, Map<String, Double>> CULTURE_TO_CONFLICT_WEIGHT = Map.of(
            "militaristic", Map.of("high", 2.0, "medium", 1.0, "low", 0.5),
            "agrarian", Map.of("medium", 1.5, "low", 1.2, "high", 0.5),
            "mercantile", Map.of("medium", 1.5, "low", 1.2, "high", 0.5),
            "tribal", Map.of("high", 1.5, "medium", 1.2, "low", 0.5),
            "industrial", Map.of("medium", 1.8, "high", 1.2, "low", 0.5),
            "scholarly", Map.of("low", 2.0, "medium", 1.0),
            "mystical", Map.of("medium", 1.5, "low", 1.2),
            "artistic", Map.of("low", 1.8, "medium", 1.0),
            "nomadic", Map.of("medium", 1.5, "high", 1.2)
    );

    // Dominant Social Structure to Conflict Level influence (multiplicative)
    private static final Map<String, Map<String, Double>> SOCIAL_TO_CONFLICT_WEIGHT = Map.of(
            "monarchy", Map.of("high", 1.5, "medium", 1.2, "low", 1.0),
            "magocracy", Map.of("medium", 1.5, "high", 1.2, "low", 1.0),
            "oligarchy", Map.of("medium", 1.5, "low", 1.2, "high", 1.0),
            "democracy", Map.of("low", 1.5, "medium", 1.2, "high", 1.0),
            "theocracy", Map.of("high", 1.8, "medium", 1.2, "low", 1.0),
            "tribal council", Map.of("high", 1.5, "medium", 1.2, "low", 1.0),
            "feudal", Map.of("high", 1.5, "medium", 1.2, "low", 1.0),
            "communal", Map.of("low", 1.5, "medium", 1.2, "high", 1.0)
    );

    public ProtoWorldDto apply(ProtoWorldDto proto) {

        applyDominantCulture(proto);
        applySocialStructure(proto);
        applyReligion(proto);
        applyTechnology(proto);
        applyConflict(proto);

        return proto;
    }

    // Fetch all generator entities for a given category
    private List<GeneratorEntity> fetchEntitiesByCategory(String categoryName) {
        // Step 1: Look up the category by name
        GeneratorCategory category = generatorCategoryRepository.findByName(categoryName);
        if (category == null) {
            throw new RuntimeException("Category " + categoryName + " not found");
        }

        // Step 2: Fetch all entities belonging to this category
        List<GeneratorEntity> entities = generatorEntityRepository.findByCategory(category);
        if (entities.isEmpty()) {
            throw new RuntimeException("No entities found for category " + categoryName);
        }

        // Step 3: Return the list of entities
        return entities;
    }

    // adjust weights based on primary and secondary attributes
    private List<GeneratorEntity> adjustWeights(List<GeneratorEntity> entities, ProtoWorldDto proto,
                                                Map<String, Map<String, Double>> primaryMap,
                                                Map<String, Map<String, Double>> secondaryMap,
                                                String primaryKey, String secondaryKey) {

        // Step 1: Initialize a list to store the adjusted entities
        List<GeneratorEntity> adjusted = new ArrayList<>();

        // Step 2: Get the primary attribute value from the ProtoWorld
        String primaryValue = primaryKey != null ? (String) proto.getAttributes().get(primaryKey) : null;

        // Step 3: Look up the weight overrides for the primary attribute from the provided map
        Map<String, Double> primaryOverrides = primaryValue != null ? primaryMap.getOrDefault(primaryValue, Map.of()) : Map.of();

        // Step 4: Get the secondary attribute value from the ProtoWorld
        String secondaryValue = secondaryKey != null ? (String) proto.getAttributes().get(secondaryKey) : null;

        // Step 5: Look up the weight overrides for the secondary attribute from the provided map
        Map<String, Double> secondaryOverrides = secondaryValue != null ? secondaryMap.getOrDefault(secondaryValue, Map.of()) : Map.of();

        // Step 6: Loop over each entity in the list to adjust its weight
        for (GeneratorEntity e : entities) {

            // Start with the entity's base weight from the database
            double weight = e.getBaseWeight();

            // Multiply by the primary override
            weight *= primaryOverrides.getOrDefault(e.getValue(), 1.0);

            // Multiply by the secondary override
            weight *= secondaryOverrides.getOrDefault(e.getValue(), 1.0);

            // Ensure no weight is zero
            if (weight <= 0.0) weight = 0.1;

            // Step 7: Create a copy of the entity so we don't modify the original database entity
            GeneratorEntity copy = new GeneratorEntity();
            copy.setId(e.getId());
            copy.setValue(e.getValue());
            copy.setCategory(e.getCategory());
            copy.setType(e.getType());

            // Assign the adjusted weight to the copy
            copy.setBaseWeight(weight);

            // Add the adjusted copy
            adjusted.add(copy);
        }

        // Step 8: Return adjusted list
        return adjusted;
    }

    private void applyDominantCulture(ProtoWorldDto proto) {
        // Step 1: Fetch all dominant culture entities from the database
        List<GeneratorEntity> cultures = fetchEntitiesByCategory("DOMINANT_CULTURE");

        // Step 2: Adjust weights based on dominant species and resource
        List<GeneratorEntity> adjusted = adjustWeights(cultures, proto, SPECIES_TO_CULTURE_WEIGHT, RESOURCE_TO_CULTURE_WEIGHT,
                "DOMINANT_SPECIES", "DOMINANT_RESOURCE");

        // Step 3: Select one entity using weighted random
        GeneratorEntity selected = WeightedRandomUtil.pickWeighted(adjusted);

        // Step 4: Store the selected dominant culture in proto
        proto.getAttributes().put("DOMINANT_CULTURE", selected.getValue());
    }

    private void applySocialStructure(ProtoWorldDto proto) {
        // Step 1: Fetch all social structure entities from the database
        List<GeneratorEntity> socialEntities = fetchEntitiesByCategory("SOCIAL_STRUCTURE");

        // Step 2: Adjust weights based on dominant culture
        List<GeneratorEntity> adjusted = adjustWeights(socialEntities, proto, CULTURE_TO_SOCIAL_WEIGHT, Map.of(),
                "DOMINANT_CULTURE", null);

        // Step 3: Select one entity using weighted random
        GeneratorEntity selected = WeightedRandomUtil.pickWeighted(adjusted);

        // Step 4: Store the selected social structure in proto
        proto.getAttributes().put("SOCIAL_STRUCTURE", selected.getValue());
    }

    private void applyReligion(ProtoWorldDto proto) {
        // Step 1: Fetch all religion entities from the database
        List<GeneratorEntity> religions = fetchEntitiesByCategory("RELIGION_OR_BELIEF_SYSTEM");

        // Step 2: Adjust weights based on social structure
        List<GeneratorEntity> adjusted = adjustWeights(religions, proto, SOCIAL_TO_RELIGION_WEIGHT, Map.of(),
                "SOCIAL_STRUCTURE", null);

        // Step 3: Select one entity using weighted random
        GeneratorEntity selected = WeightedRandomUtil.pickWeighted(adjusted);

        // Step 4: Store the selected religion in proto
        proto.getAttributes().put("RELIGION_OR_BELIEF_SYSTEM", selected.getValue());
    }

    private void applyTechnology(ProtoWorldDto proto) {
        // Step 1: Fetch all technological level entities from the database
        List<GeneratorEntity> techEntities = fetchEntitiesByCategory("TECHNOLOGICAL_LEVEL");

        // Step 2: Adjust weights based on social structure and dominant resource
        List<GeneratorEntity> adjustedTech = adjustWeights(techEntities, proto, SOCIAL_TO_TECH_LEVEL_WEIGHT, RESOURCE_TO_CULTURE_WEIGHT,
                "SOCIAL_STRUCTURE", "DOMINANT_RESOURCE");

        // Step 3: Select one entity using weighted random
        GeneratorEntity selectedTech = WeightedRandomUtil.pickWeighted(adjustedTech);

        // Step 4: Store the selected technological level in proto
        proto.getAttributes().put("TECHNOLOGICAL_LEVEL", selectedTech.getValue());
    }

    private void applyConflict(ProtoWorldDto proto) {
        // Step 1: Fetch all conflict tendency entities from the database
        List<GeneratorEntity> conflictEntities = fetchEntitiesByCategory("CONFLICT_TENDENCY");

        // Step 2: Adjust weights based on dominant culture and social structure
        List<GeneratorEntity> adjusted = adjustWeights(conflictEntities, proto, CULTURE_TO_CONFLICT_WEIGHT, SOCIAL_TO_CONFLICT_WEIGHT,
                "DOMINANT_CULTURE", "SOCIAL_STRUCTURE");

        // Step 3: Select one entity using weighted random
        GeneratorEntity selected = WeightedRandomUtil.pickWeighted(adjusted);

        // Step 4: Store the selected conflict tendency in proto
        proto.getAttributes().put("CONFLICT_TENDENCY", selected.getValue());
    }
}