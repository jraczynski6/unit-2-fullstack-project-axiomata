package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.LoginRequest;
import com.example.axiomata_backend.dto.RegisterRequest;
import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.security.JwtUtil;
import com.example.axiomata_backend.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        userService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalStateException("Invalid password");
        }

        // Generate JWT token
        return jwtUtil.generateToken(user.getUsername());
    }

    @DeleteMapping("/me")
    public String deleteCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User not authenticated");
        }

        String username = authentication.getName(); // gets the logged-in username
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        userService.deleteUser(user.getId());

        return "User and all associated worlds deleted successfully";
    }
}
