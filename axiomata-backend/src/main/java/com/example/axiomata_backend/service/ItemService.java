package com.example.axiomata_backend.service;

import com.example.axiomata_backend.dto.ItemRequestDto;
import com.example.axiomata_backend.dto.ItemResponseDto;
import com.example.axiomata_backend.exception.ResourceNotFoundException;
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

    @Transactional
    public ItemResponseDto createItem(ItemRequestDto dto) {
        validateDto(dto);
        Item item = mapDtoToEntity(dto);
        return new ItemResponseDto(itemRepository.save(item));
    }

    @Transactional(readOnly = true)
    public ItemResponseDto getItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + id));
        return new ItemResponseDto(item);
    }

    @Transactional(readOnly = true)
    public List<ItemResponseDto> getItemsByWorld(Long worldId) {
        return itemRepository.findByWorldId(worldId)
                .stream()
                .map(ItemResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ItemResponseDto updateItem(Long id, ItemRequestDto dto) {
        validateDto(dto);
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + id));

        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getDescription() != null) item.setDescription(dto.getDescription());

        if (dto.getWorldId() != null && !dto.getWorldId().equals(item.getWorld().getId())) {
            World world = worldRepository.findById(dto.getWorldId())
                    .orElseThrow(() -> new ResourceNotFoundException("World not found with id " + dto.getWorldId()));
            item.setWorld(world);
        }

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + dto.getLocationId()));
            item.setLocation(location);
        } else {
            item.setLocation(null);
        }

        return new ItemResponseDto(itemRepository.save(item));
    }

    @Transactional
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id " + id));
        itemRepository.delete(item);
    }

    private void validateDto(ItemRequestDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Item name cannot be blank");
        }
        if (dto.getWorldId() == null) {
            throw new IllegalArgumentException("World ID is required");
        }
    }

    private Item mapDtoToEntity(ItemRequestDto dto) {
        Item item = new Item();

        World world = worldRepository.findById(dto.getWorldId())
                .orElseThrow(() -> new ResourceNotFoundException("World not found with id " + dto.getWorldId()));
        item.setWorld(world);

        if (dto.getLocationId() != null) {
            Location location = locationRepository.findById(dto.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found with id " + dto.getLocationId()));
            item.setLocation(location);
        }

        item.setName(dto.getName());
        item.setDescription(dto.getDescription());

        return item;
    }
}