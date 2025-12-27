import axios from "axios";

const api = axios.create({
  baseURL: "http://10.100.17.164:5246", // Your .NET backend URL (local IP)
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
