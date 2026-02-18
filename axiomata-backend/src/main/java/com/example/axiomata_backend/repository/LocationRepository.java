package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByWorldId(Long worldId);

    List<Location> findByRegion(Location region);

    List<Location> findByWorldIdAndType(Long worldId, String type);
}
