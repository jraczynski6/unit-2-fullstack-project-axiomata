package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.GeneratorEntity;
import com.example.axiomata_backend.model.GeneratorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneratorEntityRepository extends JpaRepository<GeneratorEntity, Long> {

    // Fetch all entities for a given category
    List<GeneratorEntity> findByCategory(GeneratorCategory category);

    // Fetch all entities for a category filtered by type
    List<GeneratorEntity> findByCategoryAndType(GeneratorCategory category, String type);

}