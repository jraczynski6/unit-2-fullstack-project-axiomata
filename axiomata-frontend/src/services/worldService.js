import api from "./api";

// worldService only speaks with back end
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