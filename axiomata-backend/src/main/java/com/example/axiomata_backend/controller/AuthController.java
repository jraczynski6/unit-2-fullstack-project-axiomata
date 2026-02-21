package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.LoginRequest;
import com.example.axiomata_backend.dto.RegisterRequest;
import com.example.axiomata_backend.model.User;
import com.example.axiomata_backend.security.JwtUtil;
import com.example.axiomata_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Map;

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

    // POST /api/auth/register - Register a new user
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED) // 201 Created
    public Map<String, String> register(@RequestBody @Valid RegisterRequest request) {
        // Create the user
        userService.register(request.getUsername(), request.getEmail(), request.getPassword());

        // Generate JWT for the new user
        String token = jwtUtil.generateToken(request.getUsername());

        // Return token in the same format as login
        return Collections.singletonMap("token", token);
    }

    // POST /api/auth/login - Authenticate a user and return JWT
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody @Valid LoginRequest request) {
        User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return Collections.singletonMap("token", token); // 200 OK
    }

    // DELETE /api/auth/me - Delete currently authenticated user
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void deleteCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }

        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        userService.deleteUser(user.getId());
    }
}