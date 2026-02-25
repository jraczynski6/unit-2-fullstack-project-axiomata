// worldService.js
import api from "./api";

// existing functions remain the same
export const getWorldsForUser = async () => {
    const response = await api.get("/worlds");
    return response.data;
}

export const getWorldById = async (worldId) => {
  const response = await api.get(`/worlds/${worldId}`);
  return response.data;
};

export const getWorldEntities = async (worldId) => {
  const response = await api.get(`/worlds/${worldId}/entities`);
  return response.data;
};

export async function createWorld(worldData) {
  try {
    const response = await api.post("/worlds", worldData);
    return response.data;
  } catch (err) {
    console.error("Failed to create world:", err.response || err);
    throw err;
  }
}