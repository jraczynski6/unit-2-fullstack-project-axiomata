package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ItemRequestDto;
import com.example.axiomata_backend.dto.ItemResponseDto;
import com.example.axiomata_backend.model.Item;
import com.example.axiomata_backend.model.Location;
import com.example.axiomata_backend.model.World;
import com.example.axiomata_backend.repository.ItemRepository;
import com.example.axiomata_backend.repository.LocationRepository;
import com.example.axiomata_backend.repository.WorldRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final WorldRepository worldRepository;
    private final LocationRepository locationRepository;

    public ItemService(ItemRepository itemRepository,
                       WorldRepository worldRepository,
                       LocationRepository locationRepository) {
        this.itemRepository = itemRepository;
        this.worldRepository = worldRepository;
        this.locationRepository = locationRepository;
    }

    // --- CRUD Operations ---

    @Transactional
    public ItemResponseDto createItem(ItemRequestDto dto) {
        Item item = mapDtoToEntity(dto);
        Item saved = itemRepository.save(item);
        return new ItemResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public ItemResponseDto getItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id " + id));
        return new ItemResponseDto(item);
    }

    @Transactional(readOnly = true)
    public List<ItemResponseDto> getItemsByWorld(Long worldId) {
        List<Item> items = itemRepository.findByWorldId(worldId);
        return items.stream()
                .map(ItemResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ItemResponseDto updateItem(Long id, ItemRequestDto dto) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id " + id));

        // Update fields
        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getDescription() != null) item.setDescription(dto.getDescription());

        // Update world if changed
        if (dto.getWorldId() != null && !dto.getWorldId().equals(item.getWorld().getId())) {
            World world = worldRepository.findById(dto.getWorldId())
                    .orElseThrow(() -> new RuntimeException("World not found with id " + dto.getWorldId()));
            item.setWorld(world);
        }

        // Update location (nullable)
        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found with id " + dto.getLocationId()));
            item.setLocation(location);
        } else {
            item.setLocation(null);
        }

        Item updated = itemRepository.save(item);
        return new ItemResponseDto(updated);
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id " + id);
        }
        itemRepository.deleteById(id); // cascades if configured in Location/World relationships
    }

    // --- Mapper: DTO → Entity ---
    private Item mapDtoToEntity(ItemRequestDto dto) {
        Item item = new Item();

        // Required world
        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new RuntimeException("World not found with id " + dto.getWorldId()));
        item.setWorld(world);

        // Optional location
        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found with id " + dto.getLocationId()));
            item.setLocation(location);
        }

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());

        return item;
    }
}