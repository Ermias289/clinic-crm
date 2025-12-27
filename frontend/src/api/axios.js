import axios from "axios";

const api = axios.create({
  baseURL: "https://crmgate.nexabusinessgroup.com", // Your .NET backend URL (local IP)
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
