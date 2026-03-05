package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.ProtoWorldDto;
import com.example.axiomata_backend.service.GeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/proto-world")
public class GeneratorController {

    @Autowired
    private GeneratorService generatorService;

    @PostMapping("/generate")
    public ProtoWorldDto generateWorld() {
        return generatorService.generateWorld();
    }
}