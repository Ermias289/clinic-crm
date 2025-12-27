import api from "./axios";

const BASE_PATH = "/api/Patient";

export const getAllPatients = () => api.get(BASE_PATH);

export const getPatientById = (id) => api.get(`${BASE_PATH}/${id}`);

export const createPatient = (data) => api.post(BASE_PATH, data);

export const updatePatient = (id, data) => api.put(`${BASE_PATH}/${id}`, data);