import api from "./api";

// worldService only speaks with back end
export const getWorldsForUser = async () => {
    const response = await api.get("/worlds");
    return response.data;
}

export const getWorldById = async (worldId) => {
  const response = await api.get(`/worlds/${worldId}`);
  console.log("API response:", response); // <- add this
  return response.data;
};