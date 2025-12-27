import api from "./axios";

const BASE_PATH = "/api/User";

export const getAllUsers = () => api.get(BASE_PATH);

export const getUserById = (id) => api.get(`${BASE_PATH}/${id}`);

export const createUser = (data) => api.post(BASE_PATH, data);

export const updateUser = (id, data) => api.put(`${BASE_PATH}/${id}`, data);

export const deleteUser = (id) => api.delete(`${BASE_PATH}/${id}`);

export const confirmUserAccount = (data) => api.put(`${BASE_PATH}/confirmAccount`, data);