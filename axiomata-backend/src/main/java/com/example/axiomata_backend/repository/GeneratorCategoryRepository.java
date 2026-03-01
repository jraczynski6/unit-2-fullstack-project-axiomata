package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.GeneratorCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GeneratorCategoryRepository extends JpaRepository<GeneratorCategory, Long> {

    GeneratorCategory findByName(String name);
}
