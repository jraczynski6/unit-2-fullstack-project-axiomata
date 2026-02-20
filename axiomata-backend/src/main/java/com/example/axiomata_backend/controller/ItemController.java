package com.example.axiomata_backend.controller;

import com.example.axiomata_backend.dto.ItemRequestDto;
import com.example.axiomata_backend.dto.ItemResponseDto;
import com.example.axiomata_backend.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // Create a new item
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponseDto createItem(@RequestBody ItemRequestDto dto) {
        return itemService.createItem(dto); // 201 Created
    }

    // Read an item by ID
    @GetMapping("/{id}")
    public ItemResponseDto getItem(@PathVariable Long id) {
        return itemService.getItem(id); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Read items by world ID
    @GetMapping("/world/{worldId}")
    public List<ItemResponseDto> getItemsByWorld(@PathVariable Long worldId) {
        return itemService.getItemsByWorld(worldId); // 200 OK
    }

    // Update an existing item
    @PutMapping("/{id}")
    public ItemResponseDto updateItem(@PathVariable Long id, @RequestBody ItemRequestDto dto) {
        return itemService.updateItem(id, dto); // 200 OK
        // ResourceNotFoundException will be thrown in service if not found
    }

    // Delete an item
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204 No Content
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id); // ResourceNotFoundException if item not found
    }
}