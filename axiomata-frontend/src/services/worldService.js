// worldService.js
import api from "./api";

// ---------------- World CRUD ----------------

// Get all worlds for the user
export const getWorldsForUser = async () => {
  const response = await api.get("/worlds");
  return response.data;
};

// Get a specific world by ID
export const getWorldById = async (worldId) => {
  const response = await api.get(`/worlds/${worldId}`);
  return response.data;
};

// Create a new world
export const createWorld = async (worldData) => {
  const response = await api.post("/worlds", {
    name: worldData.name,
    description: worldData.description,
    attributes: worldData.attributes || {} // send as object
  });
  return response.data;
};

// Update an existing world
export const updateWorld = async (worldId, worldData) => {
  if (!worldData) throw new Error("worldData is undefined");

  const body = {
    name: worldData.name,
    description: worldData.description,
    attributes: worldData.attributes || {}
  };

  const response = await api.put(`/worlds/${worldId}`, body);
  return response.data;
};

// Delete an existing world
export const deleteWorld = async (worldId) => {
  const response = await api.delete(`/worlds/${worldId}`);
  return response.data;
};

// ---------------- Location CRUD ----------------
export const createLocation = async (locationData) => {
  const response = await api.post("/locations", locationData);
  return response.data;
};

export const updateLocation = async (locationId, locationData) => {
  const response = await api.put(`/locations/${locationId}`, locationData);
  return response.data;
};

export const deleteLocation = async (locationId) => {
  const response = await api.delete(`/locations/${locationId}`);
  return response.data;
};

// ---------------- Faction CRUD ----------------
export const createFaction = async (factionData) => {
  const response = await api.post("/factions", factionData);
  return response.data;
};

export const updateFaction = async (factionId, factionData) => {
  const response = await api.put(`/factions/${factionId}`, factionData);
  return response.data;
};

export const deleteFaction = async (factionId) => {
  const response = await api.delete(`/factions/${factionId}`);
  return response.data;
};

// ---------------- Character CRUD ----------------
export const createCharacter = async (characterData) => {
  const response = await api.post("/characters", characterData);
  return response.data;
};

export const updateCharacter = async (characterId, characterData) => {
  const response = await api.put(`/characters/${characterId}`, characterData);
  return response.data;
};

export const deleteCharacter = async (characterId) => {
  const response = await api.delete(`/characters/${characterId}`);
  return response.data;
};

// ---------------- Item CRUD ----------------
export const createItem = async (itemData) => {
  const response = await api.post("/items", itemData);
  return response.data;
};

export const updateItem = async (itemId, itemData) => {
  const response = await api.put(`/items/${itemId}`, itemData);
  return response.data;
};

export const deleteItem = async (itemId) => {
  const response = await api.delete(`/items/${itemId}`);
  return response.data;
};