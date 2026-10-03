import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((config) => {
  if (!import.meta.env.VITE_API_URL) { return Promise.reject(new Error("Local demo mode")); }
  try {
    const rawAuth = localStorage.getItem("campusbite_user");
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth);
      if (parsed.role) {
        config.headers["X-Role"] = parsed.role;
      }
      if (parsed.token) {
        config.headers["Authorization"] = `Bearer ${parsed.token}`;
      }
    }
  } catch (e) {
    console.error("Failed to parse auth header", e);
  }
  return config;
});

export default API;
