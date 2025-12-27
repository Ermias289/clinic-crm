import api from "./axios";

const BASE_PATH = "/api/UserRole";

export const getAllUserRoles = () => api.get(BASE_PATH);

export const createUserRole = (data) => api.post(BASE_PATH, data);

export const updateUserRole = (id, data) => api.put(`${BASE_PATH}/${id}`, data);