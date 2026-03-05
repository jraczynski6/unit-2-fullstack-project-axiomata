package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import com.example.axiomata_backend.model.GeneratorCategory;
import com.example.axiomata_backend.model.GeneratorEntity;
import com.example.axiomata_backend.repository.GeneratorCategoryRepository;
import com.example.axiomata_backend.repository.GeneratorEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class NarrativePassService {

    private static final Random RANDOM = new Random();

    private static final Map<String, String[]> SIZE_FRAGMENTS = Map.of(
            "tiny", new String[]{"a cramped and volatile world", "a fragile and compact world", "a constrained but lively world"},
            "small", new String[]{"a compact and bustling world", "a dense yet vibrant world", "a snug and active realm"},
            "medium", new String[]{"a balanced and diverse world", "a moderately flourishing world", "a world of mixed fortunes"},
            "large", new String[]{"a vast and sprawling world", "an expansive and rich world", "a broad and fertile land"},
            "giant", new String[]{"an enormous and majestic world", "a colossal and awe-inspiring realm", "a grand and legendary land"}
    );

    private static final Map<String, String[]> SPECIES_FRAGMENTS = Map.of(
            "human", new String[]{"dominated by adaptable humans", "ruled by ambitious humans", "home to industrious humans"},
            "dwarf", new String[]{"dominated by masterful miners and engineers", "home to stubborn yet skilled dwarves", "where dwarves craft wonders underground"},
            "elf", new String[]{"dominated by graceful and mystical elves", "where elves reign with elegance", "home to wise and ethereal elves"},
            "beast-folk", new String[]{"dominated by fierce beast-folk tribes", "where beast-folk roam freely", "land of savage yet honorable beast-folk"},
            "daemon", new String[]{"dominated by enigmatic daemons", "where daemons manipulate fate", "realm of mysterious daemonic forces"},
            "monsters", new String[]{"dominated by terrifying monsters", "land haunted by monstrous beings", "where creatures of nightmare thrive"},
            "neutral", new String[]{"dominated by varied and mysterious inhabitants", "a land of diverse, unpredictable peoples", "home to many enigmatic species"}
    );

    private static final Map<String, String[]> CONFLICT_FRAGMENTS = Map.of(
            "peaceful", new String[]{"where peace generally prevails","a land of harmony and calm","societies flourish without war"},
            "defensive", new String[]{"with societies on guard against threats","where vigilance defines daily life","fortresses and watchtowers dominate"},
            "expansionist", new String[]{"where civilizations strive to expand","lands of conquest and ambition"},
            "opportunistic", new String[]{"where cunning and chance shape survival","a world ruled by cunning strategies","opportunity defines the fate of many"},
            "chaotic", new String[]{"where disorder and conflict reign","a turbulent and unpredictable realm","conflict and upheaval are daily life"},
            "aggressive", new String[]{"where violence is common","a land of constant skirmishes","societies thrive through dominance"}
    );

    @Autowired
    private GeneratorCategoryRepository generatorCategoryRepository;

    @Autowired
    private GeneratorEntityRepository generatorEntityRepository;

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
        Map<String, Object> attributes = proto.getAttributes();
        Map<String, String> resourcePool = (Map<String, String>) attributes.get("RESOURCE_POOL");

        // --------------------------
        // Step 1: World size corrections / scaling
        // --------------------------
        if ("giant".equals(attributes.get("SPECIES")) &&
                "tiny".equals(attributes.get("WORLD_SIZE"))) {
            attributes.put("WORLD_SIZE", "medium");
        }

        // --------------------------
        // Step 2: Culture → resource base consistency
        // --------------------------
        if ("agrarian".equals(attributes.get("DOMINANT_CULTURE")) &&
                !"agriculture".equals(attributes.get("DOMINANT_RESOURCE")) &&
                !"livestock".equals(attributes.get("DOMINANT_RESOURCE"))) {
            attributes.put("DOMINANT_RESOURCE", "agriculture");
            resourcePool.put("agriculture", "Plentiful");
            resourcePool.put("livestock", "Abundant");
        }

        // --------------------------
        // Step 3: Tech ↔ culture consistency
        // --------------------------
        if ("technomagical".equals(attributes.get("TECHNOLOGICAL_LEVEL")) &&
                !"mystical".equals(attributes.get("DOMINANT_CULTURE"))) {
            attributes.put("DOMINANT_CULTURE", "mystical");
            resourcePool.put("crystals", "Abundant");
            resourcePool.put("herbs", "Abundant");
        }

        // --------------------------
        // Step 4: Religion-related conflict adjustments
        // --------------------------
        if ("ancestor worship".equals(attributes.get("RELIGION_OR_BELIEF_SYSTEM"))) {
            String conflict = (String) attributes.get("CONFLICT_TENDENCY");
            if ("chaotic".equals(conflict) || "aggressive".equals(conflict)) {
                attributes.put("CONFLICT_TENDENCY", "defensive");
            }
        }

        // --------------------------
        // Step 5: Species + culture + conflict rules
        // --------------------------
        String species = (String) attributes.get("SPECIES");
        String culture = (String) attributes.get("DOMINANT_CULTURE");
        String conflict = (String) attributes.get("CONFLICT_TENDENCY");
        String resource = (String) attributes.get("DOMINANT_RESOURCE");

        // Dwarf-heavy worlds
        if ("dwarf".equals(species) &&
                "tiny".equals(attributes.get("WORLD_SIZE")) &&
                "iron".equals(resource)) {
            attributes.put("CONFLICT_TENDENCY", "aggressive");
            attributes.put("TECHNOLOGICAL_LEVEL", "industrial");
            attributes.put("DOMINANT_CULTURE", "industrial");
            resourcePool.put("iron", "Abundant");
            resourcePool.put("stone", "Moderate");
            resourcePool.put("coal", "Abundant");
        }

        // Elf-heavy mystical worlds
        if ("elf".equals(species) && "mystical".equals(culture)) {
            attributes.put("TECHNOLOGICAL_LEVEL", "technomagical");
            attributes.put("CONFLICT_TENDENCY", "peaceful");
            resourcePool.put("herbs", "Abundant");
            resourcePool.put("crystals", "Abundant");
            resourcePool.put("silk", "Moderate");
            resourcePool.put("marble", "Abundant");
        }

        // Human mercantile expansionist worlds
        if ("human".equals(species) && "mercantile".equals(culture) &&
                "expansionist".equals(conflict)) {
            attributes.put("TECHNOLOGICAL_LEVEL", "industrial");
            resourcePool.put("gold", "Plentiful");
            resourcePool.put("timber", "Abundant");
            resourcePool.put("textiles", "Abundant");
            resourcePool.put("spices", "Moderate");
        }

        // Beast-folk tribal worlds
        if ("beast-folk".equals(species) && "tribal".equals(culture)) {
            attributes.put("CONFLICT_TENDENCY", "opportunistic");
            attributes.put("TECHNOLOGICAL_LEVEL", "primitive");
            resourcePool.put("livestock", "Abundant");
            resourcePool.put("stone", "Moderate");
            resourcePool.put("herbs", "Moderate");
            resourcePool.put("fish", "Abundant");
        }

        // Daemon industrial worlds
        if ("daemon".equals(species) && "industrial".equals(culture)) {
            attributes.put("CONFLICT_TENDENCY", "chaotic");
            attributes.put("TECHNOLOGICAL_LEVEL", "industrial");
            resourcePool.put("coal", "Abundant");
            resourcePool.put("iron", "Moderate");
            resourcePool.put("obsidian", "Abundant");
            resourcePool.put("crystals", "Moderate");
        }

        // commit back updated resource pool
        attributes.put("RESOURCE_POOL", resourcePool);
    }



    private String generateWorldName(ProtoWorldDto proto) {
        String dominantSpecies = (String) proto.getAttributes().get("DOMINANT_SPECIES");
        String worldSize = (String) proto.getAttributes().get("WORLD_SIZE");
        String dominantCulture = (String) proto.getAttributes().get("DOMINANT_CULTURE");

        // Step 1: Fetch all WORLD_NAME entities from DB
        GeneratorCategory category = generatorCategoryRepository.findByName("WORLD_NAME");
        if (category == null) throw new RuntimeException("Category WORLD_NAME not found");

        List<GeneratorEntity> allWorldNames = generatorEntityRepository.findByCategory(category);
        if (allWorldNames.isEmpty()) throw new RuntimeException("No WORLD_NAME entities found");

        // Step 2: Filter by DOMINANT_SPECIES
        List<String> namePool = new ArrayList<>();
        // Iterate over each GeneratorEntity to check if it matches the dominant species
        for (GeneratorEntity entity : allWorldNames) {
            if (dominantSpecies.equals(entity.getType())) {
                namePool.add(entity.getValue());
            }
        }
        // fallback if no names exist for this species
        if (namePool.isEmpty()) {
            namePool.add("Unknown");
        }

        // Step 3: selection of base name
        int index = Math.abs((dominantSpecies + worldSize + dominantCulture).hashCode()) % namePool.size();
        String baseName = namePool.get(index);

        // Step 4: Flavor pattern

        String[] patterns = {
                "The Realm of %s",
                "The Shattered Lands of %s",
                "The Ancient Realm of %s",
                "Lands of %s",
                "The Enchanted Domain of %s",
                "The Mystic Lands of %s",
                "The Verdant Lands of %s",
                "The Twilight Realm of %s",
                "The Eternal Domain of %s",
                "The Hidden World of %s"
        };

        int patternIndex = Math.abs((worldSize + dominantCulture + baseName).hashCode()) % patterns.length;

        String worldName = String.format(patterns[patternIndex], baseName);

        return worldName;
    }

    // Helper to pick a random fragment from an array of options
    private String pickRandom(String[] options) {
        return options[RANDOM.nextInt(options.length)];
    }

    // Generate a narrative summary based on key attributes
    private String generateWorldSummary(ProtoWorldDto proto) {
        String worldName = proto.getWorldName();

        String worldSize = (String) proto.getAttributes().get("WORLD_SIZE");
        String dominantSpecies = (String) proto.getAttributes().get("DOMINANT_SPECIES");
        String conflictTendency = (String) proto.getAttributes().get("CONFLICT_TENDENCY");

        String sizeFragment = pickRandom(SIZE_FRAGMENTS.getOrDefault(worldSize, new String[]{"an unknown size world"}));
        String speciesFragment = pickRandom(SPECIES_FRAGMENTS.getOrDefault(dominantSpecies, new String[]{"with mysterious inhabitants"}));
        String conflictFragment = pickRandom(CONFLICT_FRAGMENTS.getOrDefault(conflictTendency, new String[]{"with unpredictable conflicts"}));

        return String.format("%s, %s, %s, %s.", worldName, sizeFragment, speciesFragment, conflictFragment);
    }
}