package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.Faction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FactionRepository extends JpaRepository<Faction, Long> {

    List<Faction> findByWorldId(Long worldId);

    Faction findByWorldIdAndName(Long worldId, String name);

    void deleteByWorldId(Long worldId);
}
