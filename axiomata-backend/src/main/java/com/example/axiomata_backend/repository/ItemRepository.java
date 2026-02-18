package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.Item;
import com.example.axiomata_backend.model.Location;
import com.example.axiomata_backend.model.World;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByWorld(World world);

    List<Item> findByLocation(Location location);

    List<Item> findByNameContainingIgnoreCase(String name);
}

