import api from "./axios";

const BASE_PATH = "/api/MedicalService";

export const getAllServices = () => api.get(BASE_PATH);

export const getServiceById = (id) => api.get(`${BASE_PATH}/${id}`);

export const getFilteredServices = (params) => 
  api.get(`${BASE_PATH}/filteredService`, { params });

export const createService = (data) => api.post(BASE_PATH, data);

export const deleteService = (id) => api.delete(`${BASE_PATH}/${id}`);