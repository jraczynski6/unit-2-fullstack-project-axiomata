import api from "./api";

export const generateWorld = async () => {
    const response = await api.post("/proto-world/generate");
    return response.data;
};