package com.example.axiomata_backend.repository;

import com.example.axiomata_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // query methods for finding users by username or email
    Optional<User> findByUsername(String username);

    Optional <User> findByEmail(String email);

    // query methods for checking if a user exists by username or email
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
