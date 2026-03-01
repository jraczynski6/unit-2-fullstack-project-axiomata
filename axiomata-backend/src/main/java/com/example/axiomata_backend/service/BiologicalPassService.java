package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import com.example.axiomata_backend.model.GeneratorCategory;
import com.example.axiomata_backend.model.GeneratorEntity;
import com.example.axiomata_backend.repository.GeneratorCategoryRepository;
import com.example.axiomata_backend.repository.GeneratorEntityRepository;
import com.example.axiomata_backend.util.WeightedRandomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        GeneratorCategory speciesCategory = generatorCategoryRepository.findByName("SPECIES")
        return proto;
    }
}