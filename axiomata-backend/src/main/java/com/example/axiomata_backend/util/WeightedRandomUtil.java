package com.example.axiomata_backend.util;

import com.example.axiomata_backend.model.GeneratorEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class WeightedRandomUtil {

    private static final Random RANDOM = new Random();

    public static GeneratorEntity pickWeighted(List<GeneratorEntity> entities) {
        if (entities.isEmpty()) throw new IllegalArgumentException("Entity list cannot be empty");

        // Build cumulative weights
        List<Integer> cumulative = new ArrayList<>();
        int sum = 0;
        for (GeneratorEntity e : entities) {
            sum += e.getBaseWeight();
            cumulative.add(sum);
        }

        if (sum == 0) throw new RuntimeException("Total weight cannot be zero");

        // Roll random number
        int roll = RANDOM.nextInt(sum) + 1;

        // Binary search
        int left = 0, right = cumulative.size() - 1;
        while (left < right) {
            int mid = (left + right) / 2;
            if (roll <= cumulative.get(mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        return entities.get(left);
    }
}