import api from "./axios";

const BASE_PATH = "/api/MedicalProfessional";

export const getAllDoctors = () => api.get(BASE_PATH);

export const getDoctorById = (id) => api.get(`${BASE_PATH}/${id}`);

export const createDoctor = (data) => api.post(BASE_PATH, data);

export const updateDoctor = (id, data) => api.put(`${BASE_PATH}/${id}`, data);

export const deleteDoctor = (id) => api.delete(`${BASE_PATH}/${id}`);