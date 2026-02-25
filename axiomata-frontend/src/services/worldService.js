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

// Location Crud

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

