package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import com.example.axiomata_backend.repository.GeneratorCategoryRepository;
import com.example.axiomata_backend.repository.GeneratorEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class GeneratorService {

    @Autowired
    private GeneratorCategoryRepository categoryRepository;

    @Autowired
    private GeneratorEntityRepository entityRepository;

    @Autowired
    private GeologicalPassService geologicalPassService;

    @Autowired
    private BiologicalPassService biologicalPassService;

    @Autowired
    private CulturalPassService culturalPassService;

    @Autowired
    private NarrativePassService narrativePassService;

    // Generate ProtoWorldDto
    public ProtoWorldDto generateWorld() {
        ProtoWorldDto proto = new ProtoWorldDto();
        proto.setAttributes(new HashMap<>()); // Initialize empty attributes map

        // Call each pass in sequence
        proto = geologicalPassService.apply(proto);
        proto = biologicalPassService.apply(proto);
        proto = culturalPassService.apply(proto);
        proto = narrativePassService.apply(proto);

        // Return the generated ProtoWorldDto
        return proto;
    }
}