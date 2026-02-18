package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.LoginRequest;
import com.example.axiomata_backend.dto.RegisterRequest;
import com.example.axiomata_backend.security.JwtUtil;
import com.example.axiomata_backend.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        // TODO: Implement login logic (e.g., authenticate user and generate JWT token)
        return "Login successful";
    }
}

//TODO: Implement the login method to authenticate the user and generate a JWT token using the JwtUtil class.