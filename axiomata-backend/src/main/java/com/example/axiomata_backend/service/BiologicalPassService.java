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
public class BiologicalPassService {

    @Autowired
    private GeneratorCategoryRepository generatorCategoryRepository;

    @Autowired
    private GeneratorEntityRepository generatorEntityRepository;

    // Weight modifiers based on world size
    private static final Map<String, Map<String, Double>> WORLD_SIZE_TO_SPECIES_WEIGHT = Map.of(
            "tiny", Map.of("human", 2.0, "dwarf", 1.5, "elf", 1.0, "beast-folk", 1.0, "daemon", 0.5, "monsters", 0.5),
            "small", Map.of("human", 2.0, "dwarf", 2.0, "elf", 1.5, "beast-folk", 1.0, "daemon", 1.0, "monsters", 0.5),
            "medium", Map.of("human", 1.5, "dwarf", 2.0, "elf", 2.0, "beast-folk", 1.5, "daemon", 1.0, "monsters", 1.0),
            "large", Map.of("human", 1.0, "dwarf", 1.5, "elf", 2.0, "beast-folk", 2.0, "daemon", 1.5, "monsters", 2.0),
            "giant", Map.of("human", 1.0, "dwarf", 1.0, "elf", 1.5, "beast-folk", 2.0, "daemon", 2.0, "monsters", 3.0)
    );

    // Weight modifiers based on resource availability
    private static final Map<String, Map<String, Double>> RESOURCE_TO_SPECIES_WEIGHT = Map.ofEntries(
            Map.entry("iron", Map.ofEntries(
                    Map.entry("dwarf", 3.0), Map.entry("human", 1.5), Map.entry("elf", 1.0),
                    Map.entry("beast-folk", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("gold", Map.ofEntries(
                    Map.entry("human", 2.0), Map.entry("elf", 1.5), Map.entry("dwarf", 1.0),
                    Map.entry("beast-folk", 1.0), Map.entry("daemon", 1.0), Map.entry("monsters", 0.5)
            )),
            Map.entry("copper", Map.ofEntries(
                    Map.entry("dwarf", 3.0), Map.entry("human", 1.0), Map.entry("elf", 1.0),
                    Map.entry("beast-folk", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("gems", Map.ofEntries(
                    Map.entry("elf", 3.0), Map.entry("dwarf", 2.0), Map.entry("human", 1.5),
                    Map.entry("beast-folk", 1.0), Map.entry("daemon", 1.5), Map.entry("monsters", 1.0)
            )),
            Map.entry("coal", Map.ofEntries(
                    Map.entry("dwarf", 3.0), Map.entry("human", 1.0), Map.entry("elf", 1.0),
                    Map.entry("beast-folk", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("stone", Map.ofEntries(
                    Map.entry("dwarf", 3.0), Map.entry("human", 1.5), Map.entry("elf", 1.0),
                    Map.entry("beast-folk", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("agriculture", Map.ofEntries(
                    Map.entry("human", 3.0), Map.entry("beast-folk", 2.5), Map.entry("dwarf", 1.0),
                    Map.entry("elf", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("livestock", Map.ofEntries(
                    Map.entry("beast-folk", 3.0), Map.entry("human", 2.5), Map.entry("dwarf", 1.0),
                    Map.entry("elf", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("timber", Map.ofEntries(
                    Map.entry("elf", 3.0), Map.entry("beast-folk", 2.0), Map.entry("human", 1.5),
                    Map.entry("dwarf", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("fish", Map.ofEntries(
                    Map.entry("human", 2.5), Map.entry("beast-folk", 2.0), Map.entry("dwarf", 1.0),
                    Map.entry("elf", 1.0), Map.entry("daemon", 0.5), Map.entry("monsters", 0.5)
            )),
            Map.entry("crystals", Map.ofEntries(
                    Map.entry("elf", 3.0), Map.entry("daemon", 2.5), Map.entry("human", 1.0),
                    Map.entry("dwarf", 1.0), Map.entry("beast-folk", 1.0), Map.entry("monsters", 1.0)
            ))
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

        // Adjust weights based on WORLD_SIZE and RESOURCE (multiplicative)
        Map<String, Double> adjustedWeights = adjustWeights(speciesEntities, proto);

        // Populate SPECIES_POOL as key-value pairs with population descriptors (high/medium/low)
        Map<String, String> speciesPopulation = populationDescriptors(adjustedWeights);
        proto.getAttributes().put("SPECIES_POOL", speciesPopulation);

        // Pick Dominant Species separately using weighted RNG
        GeneratorEntity dominant = WeightedRandomUtil.pickWeighted(
                speciesEntities.stream().map(e -> {
                    GeneratorEntity copy = new GeneratorEntity();
                    copy.setId(e.getId());
                    copy.setValue(e.getValue());
                    copy.setBaseWeight((int) Math.round(adjustedWeights.getOrDefault(e.getValue(), 1.0)));
                    return copy;
                }).toList()
        );
        proto.getAttributes().put("DOMINANT_SPECIES", dominant.getValue());

        return proto;
    }

    // Adjust species weights multiplicatively based on world size and resource
    private Map<String, Double> adjustWeights(List<GeneratorEntity> speciesEntities, ProtoWorldDto proto) {
        Map<String, Double> adjusted = new HashMap<>();

        String worldSize = (String) proto.getAttributes().get("WORLD_SIZE");
        String resource = (String) proto.getAttributes().get("DOMINANT_RESOURCE");

        Map<String, Double> sizeOverrides = worldSize != null ? WORLD_SIZE_TO_SPECIES_WEIGHT.getOrDefault(worldSize, Map.of()) : Map.of();
        Map<String, Double> resourceOverrides = resource != null ? RESOURCE_TO_SPECIES_WEIGHT.getOrDefault(resource, Map.of()) : Map.of();

        for (GeneratorEntity e : speciesEntities) {
            double weight = 1.0; // base weight
            weight *= sizeOverrides.getOrDefault(e.getValue(), 1.0);
            weight *= resourceOverrides.getOrDefault(e.getValue(), 1.0);
            adjusted.put(e.getValue(), weight);
        }

        return adjusted;
    }

    // Convert numeric weights to population descriptors
    private Map<String, String> populationDescriptors(Map<String, Double> adjustedWeights) {
        Map<String, String> descriptors = new HashMap<>();
        List<Double> sortedWeights = new ArrayList<>(adjustedWeights.values());
        Collections.sort(sortedWeights);

        double min = sortedWeights.get(0);
        double max = sortedWeights.get(sortedWeights.size() - 1);
        double range = max - min;

        for (Map.Entry<String, Double> entry : adjustedWeights.entrySet()) {
            double w = entry.getValue();
            String descriptor;
            if (range == 0) {
                descriptor = "medium";
            } else if (w >= min + 0.66 * range) {
                descriptor = "high";
            } else if (w >= min + 0.33 * range) {
                descriptor = "medium";
            } else {
                descriptor = "low";
            }
            descriptors.put(entry.getKey(), descriptor);
        }
        return descriptors;
    }
}