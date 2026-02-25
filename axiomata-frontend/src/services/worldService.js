import api from "/.api";

export const getWorldsForUser = async () => {
    const response = await api.get("/worlds");
    return response.data;
}

export const getWorldById = async () => {
    const response = await api.get(`/worlds/${worldId}`);
}