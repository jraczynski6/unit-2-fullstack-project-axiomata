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
public class BiologicalPassService {

    @Autowired
    private GeneratorCategoryRepository generatorCategoryRepository;

    @Autowired
    private GeneratorEntityRepository generatorEntityRepository;

    private static final Map<String, Map<String, Double>> WORLD_SIZE_TO_SPECIES_WEIGHT = Map.of(
            "tiny", Map.of(
                    "human", 2.0, "dwarf", 1.5, "elf", 1.0, "beast-folk", 1.0, "daemon", 0.5, "monsters", 0.5
            ),
            "small", Map.of(
                    "human", 2.0, "dwarf", 2.0, "elf", 1.5, "beast-folk", 1.0, "daemon", 1.0, "monsters", 0.5
            ),
            "medium", Map.of(
                    "human", 1.5, "dwarf", 2.0, "elf", 2.0, "beast-folk", 1.5, "daemon", 1.0, "monsters", 1.0
            ),
            "large", Map.of(
                    "human", 1.0, "dwarf", 1.5, "elf", 2.0, "beast-folk", 2.0, "daemon", 1.5, "monsters", 2.0
            ),
            "giant", Map.of(
                    "human", 1.0, "dwarf", 1.0, "elf", 1.5, "beast-folk", 2.0, "daemon", 2.0, "monsters", 3.0
            )
    );

    private static final Map<String, Map<String, Double>> RESOURCE_TO_SPECIES_WEIGHT = Map.of(
            "iron", Map.of("dwarf", 3.0, "human", 1.5, "elf", 1.0, "beast-folk", 1.0, "daemon", 0.5, "monsters", 0.5),
            "gold", Map.of("human", 2.0, "elf", 1.5, "dwarf", 1.0, "beast-folk", 1.0, "daemon", 1.0, "monsters", 0.5),
            "copper", Map.of("dwarf", 2.0, "human", 1.0, "elf", 1.0, "beast-folk", 1.0, "daemon", 0.5, "monsters", 0.5),
            "gems", Map.of("elf", 3.0, "beast-folk", 1.5, "human", 1.5, "dwarf", 1.0, "daemon", 1.0, "monsters", 1.0),
            "coal", Map.of("dwarf", 2.0, "beast-folk", 1.0, "human", 1.0, "elf", 1.0, "daemon", 0.5, "monsters", 0.5),
            "stone", Map.of("dwarf", 1.5, "beast-folk", 1.5, "human", 1.0, "elf", 1.0, "daemon", 0.5, "monsters", 0.5)
    );




    public ProtoWorldDto apply(ProtoWorldDto proto) {

        // Load SPECIES category and entities
        GeneratorCategory speciesCategory = generatorCategoryRepository.findByName("SPECIES");
        if (speciesCategory == null) {
            throw new RuntimeException("Category SPECIES not found");
        }

        List<GeneratorEntity> speciesEntities = generatorEntityRepository.findByCategory(speciesCategory);
        if (speciesEntities.isEmpty()) {
            throw new RuntimeException("No entities found for category SPECIES");
        }

        // Populate SPECIES_POOL (adjust to exclude species that are incompatible with geological attributes)
        proto.getAttributes().put("SPECIES_POOL", speciesEntities.stream()
                .map(GeneratorEntity::getValue)
                .toList()
        );

        // Adjust weights based on WORLD_SIZE and RESOURCE (Add more dependencies as needed)
        List<GeneratorEntity> adjustedSpecies = adjustWeights(speciesEntities, proto);

        // Pick Dominant Species based on adjusted weights
        GeneratorEntity dominant = WeightedRandomUtil.pickWeighted(adjustedSpecies);
        proto.getAttributes().put("DOMINANT_SPECIES", dominant.getValue());

        return proto;
    }

    private List<GeneratorEntity> adjustWeights(List<GeneratorEntity> speciesEntities, ProtoWorldDto proto) {
        List<GeneratorEntity> adjusted = new ArrayList<>();

        String worldSize = (String) proto.getAttributes().get("WORLD_SIZE");
        String resource = (String) proto.getAttributes().get("RESOURCE");

        Map<String, Double> sizeOverrides = worldSize != null ? WORLD_SIZE_TO_SPECIES_WEIGHT.getOrDefault(worldSize, Map.of()) : Map.of();
        Map<String, Double> resourceOverrides = resource != null ? RESOURCE_TO_SPECIES_WEIGHT.getOrDefault(resource, Map.of()) : Map.of();

        for (GeneratorEntity e : speciesEntities) {
            double weight = 1.0; // base weight

            // Apply WORLD_SIZE modifier
            weight *= sizeOverrides.getOrDefault(e.getValue(), 1.0);

            // Apply RESOURCE modifier
            weight *= resourceOverrides.getOrDefault(e.getValue(), 1.0);

            // Create lightweight copy with runtime-only effective weight
            GeneratorEntity copy = new GeneratorEntity();
            copy.setId(e.getId());
            copy.setValue(e.getValue());
            copy.setBaseWeight((int) weight);
            adjusted.add(copy);
        }

        return adjusted;
    }
}