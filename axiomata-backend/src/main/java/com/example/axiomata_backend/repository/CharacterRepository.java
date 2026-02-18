package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {

    List<Character> findByWorldId(Long worldId);

    List<Character> findByLocationId(Long locationId);
}
