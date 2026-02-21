import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

// create new instance with base url for brevity
const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

// run before every request
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// run after response ? error
api.interceptors.response.use(
    (reponse) => reponse,
    (error) => {
        if (error.reponse?.status === 401) {
            clearToken();
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

export default api;