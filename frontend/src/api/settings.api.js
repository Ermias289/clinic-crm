import api from "./axios";

const BASE_PATH = "/api/Setting";

export const getClinicSettings = () => api.get(`${BASE_PATH}/clinic`);

export const updateClinicSettings = (data) => api.put(`${BASE_PATH}/clinic`, data);

export const getWorkingHours = () => api.get(`${BASE_PATH}/workingHours`);

export const updateWorkingHours = (data) => api.put(`${BASE_PATH}/workingHours`, data);