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
        return itemService.createItem(dto);
    }

    // Read an item by ID
    @GetMapping("/{id}")
    public ItemResponseDto getItem(@PathVariable Long id) {
        return itemService.getItem(id);
    }

    // Read items by world ID
    @GetMapping("/world/{worldId}")
    public List<ItemResponseDto> getItemsByWorld(@PathVariable Long worldId) {
        return itemService.getItemsByWorld(worldId);
    }

    // Update an existing item
    @PutMapping("/{id}")
    public ItemResponseDto updateItem(@PathVariable Long id, @RequestBody ItemRequestDto dto) {
        return itemService.updateItem(id, dto);
    }

    // Delete an item
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }
}
