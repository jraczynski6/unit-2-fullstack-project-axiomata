// worldService.js
import api from "./api";

// WORLD CRUD

// Get all worlds for the user
export const getWorldsForUser = async () => {
    const response = await api.get("/worlds");
    return response.data;
}

// Get a specific world by ID
export const getWorldById = async (worldId) => {
  const response = await api.get(`/worlds/${worldId}`);
  return response.data;
};

// Get entities for section panel
export const getWorldEntities = async (worldId) => {
  const response = await api.get(`/worlds/${worldId}/entities`);
  return response.data;
};

// Create a new world
export async function createWorld(worldData) {
  try {
    const response = await api.post("/worlds", worldData);
    return response.data;
  } catch (err) {
    console.error("Failed to create world:", err.response || err);
    throw err;
  }
};

// Update an existing world
export const updateWorld = async (worldId, worldData) => {
  const response = await api.put(`/worlds/${worldId}`, worldData);
  return response.data;
};

// Delete an existing world
export const deleteWorld = async (worldId) => {
  const response = await api.delete(`/worlds/${worldId}`);
  return response.data;
};

// Location CRUD

// create location
export const createLocation = async (locationData) => {
  const response = await api.post("/locations", locationData);
  return response.data;
};

// update location
export const updateLocation = async (locationId, locationData) => {
  const response = await api.put(`/locations/${locationId}`, locationData);
  return response.data;
};

// delete location
export const deleteLocation = async (locationId) => {
  const response = await api.delete(`/locations/${locationId}`);
  return response.data;
};

// Faction CRUD

// create faction
export const createFaction = async (factionData) => {
  const response = await api.post("/factions", factionData);
  return response.data;
};

// update faction
export const updateFaction = async (factionId, factionData) => {
  const response = await api.put(`/factions/${factionId}`, factionData);
  return response.data;
};

// delete faction
export const deleteFaction = async (factionId) => {
  const response = await api.delete(`/factions/${factionId}`);
  return response.data;
};

// Character CRUD

// create character
export const createCharacter = async (characterData) => {
  const response = await api.post("/characters", characterData);
  return response.data;
};

// update character
export const updateCharacter = async (characterId, characterData) => {
  const response = await api.put(`/characters/${characterId}`, characterData);
  return response.data;
};

// delete character
export const deleteCharacter = async (characterId) => {
  const response = await api.delete(`/characters/${characterId}`);
  return response.data;
};

// Item CRUD

// create Item
export const createItem = async (itemData) => {
  const response = await api.post("/items", itemData);
  return response.data;
};

// update item
export const updateItem = async (itemId, itemData) => {
  const response = await api.put(`/items/${itemId}`, itemData);
  return response.data;
};

// delete item
export const deleteItem = async (itemId) => {
  const response = await api.delete(`/items/${itemId}`);
  return response.data;
};