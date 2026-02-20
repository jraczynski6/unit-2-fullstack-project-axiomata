package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.World;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorldRepository extends JpaRepository<World, Long> {

    // Find all worlds for a specific user
    List<World> findByUserId(Long userId);

    // Optional: find by name for a specific user
    World findByUserIdAndName(Long userId, String name);
}