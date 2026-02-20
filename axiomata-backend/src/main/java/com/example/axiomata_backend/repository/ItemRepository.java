package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.Item;
import com.example.axiomata_backend.model.World;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    // Fetch all items belonging to a specific world
    List<Item> findByWorld(World world);

    // Optional: fetch all items by world ID (if you prefer using IDs instead of entity)
    List<Item> findByWorldId(Long worldId);
}
