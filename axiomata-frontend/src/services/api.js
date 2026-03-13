import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

// Axios instance for all API requests
const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend URL
});

// request interceptor: attach JWT token if present
api.interceptors.request.use((config) => {
  const token = getToken();

  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response interceptor: handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Clearing token and redirecting to /auth");
      clearToken();
      window.location.href = "/auth"; // force logout
    }
    return Promise.reject(error);
  }
);

export default api;