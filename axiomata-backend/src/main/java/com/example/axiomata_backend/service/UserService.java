package com.example.axiomata_backend.service;

import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // constructor injection
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String username, String email, String rawPassword) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalStateException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already exists");
        }

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email.trim());
        user.setPassword(passwordEncoder.encode(rawPassword));

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


     // Delete a user by ID.
     // CascadeType.ALL/orphanRemoval on worlds,
     // deleting the user deletes all worlds and their children.
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // This triggers cascade delete down the entity hierarchy
        userRepository.delete(user);
    }
}