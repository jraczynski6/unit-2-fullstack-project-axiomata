package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class NarrativePassService {

    public ProtoWorldDto apply(ProtoWorldDto proto) {

        // Step 1: Apply logical modifiers
        applyLogicalModifiers(proto);

        // Step 2: Generate world name
        String worldName = generateWorldName(proto);
        proto.setWorldName(worldName);

        // Step 3: Generate world summary
        String summary = generateWorldSummary(proto);
        proto.setDescription(summary);

        return proto;
    }

    private void applyLogicalModifiers(ProtoWorldDto proto) {
        // load attributes from proto
        Map<String, Object> attributes = proto.getAttributes();

        // --------------------------
        // Rule 1: Dwarf-dominant world on a tiny planet with iron as the main resource
        // --------------------------
        if ("dwarf".equals(attributes.get("SPECIES")) &&
                "tiny".equals(attributes.get("WORLD_SIZE")) &&
                "iron".equals(attributes.get("DOMINANT_RESOURCE"))) {

            // Update attributes to reflect the narrative modifiers
            attributes.put("CONFLICT_TENDENCY", "aggressive");
            attributes.put("TECHNOLOGICAL_LEVEL", "industrial");
            attributes.put("DOMINANT_CULTURE", "industrial");

            // Update RESOURCE_POOL
            Map<String, String> resourcePool = (Map<String, String>) attributes.get("RESOURCE_POOL");
            resourcePool.put("iron", "Nearly Depleted");
            attributes.put("RESOURCE_POOL", resourcePool);
        }
    }



    private String generateWorldName();


    private String generateWorldSummary();
}