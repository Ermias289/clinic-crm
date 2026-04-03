import axios from "axios";

const BASE_URL = "/api";
const TOKEN_KEY = "clinic_crm_token";

export const apiClient = axios.create({
  baseURL: BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


