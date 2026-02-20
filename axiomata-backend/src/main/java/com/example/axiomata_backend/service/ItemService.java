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

    // Create a new item
    public ItemResponseDto createItem(ItemRequestDto dto) {
        Item item = mapDtoToEntity(dto);
        itemRepository.save(item);
        return mapEntityToDto(item);
    }

    // Get an item by ID
    public ItemResponseDto getItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id " + id));
        return mapEntityToDto(item);
    }

    // Get items by world ID
    public List<ItemResponseDto> getItemsByWorld(Long worldId) {
        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new RuntimeException("World not found with id " + worldId));
        return itemRepository.findByWorld(world)
                .stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    // Update an existing item
    public ItemResponseDto updateItem(Long id, ItemRequestDto dto) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id " + id));

        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getDescription() != null) item.setDescription(dto.getDescription());

        // Update world if different
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

        itemRepository.save(item);
        return mapEntityToDto(item);
    }

    // Delete an item
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id " + id);
        }
        itemRepository.deleteById(id);
    }

    // Mapping methods
    public Item mapDtoToEntity(ItemRequestDto dto) {
        Item item = new Item();

        // world is required
        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new RuntimeException("World not found with id " + dto.getWorldId()));
        item.setWorld(world);

        // location is optional
        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new RuntimeException("Location not found with id " + dto.getLocationId()));
            item.setLocation(location);
        }

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());

        return item;
    }

    public ItemResponseDto mapEntityToDto(Item item) {
        ItemResponseDto dto = new ItemResponseDto();
        dto.setId(item.getId());
        dto.setWorldId(item.getWorld().getId());
        dto.setLocationId(item.getLocation() != null ? item.getLocation().getId() : null);
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
