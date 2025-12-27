import api from "./axios";

const BASE_PATH = "/api/Appointment";

export const getAllAppointments = () => api.get(BASE_PATH);

export const getAppointmentById = (id) => api.get(`${BASE_PATH}/${id}`);

export const getAppointmentsByPatientId = (patientId) => 
  api.get(`${BASE_PATH}/bypatientId/${patientId}`);

export const createAppointment = (data) => api.post(BASE_PATH, data);

export const cancelAppointment = (id, reason) => 
  api.put(`${BASE_PATH}/cancelAppointment`, null, { params: { Id: id, reason } });

export const completeAppointment = (id) => 
  api.put(`${BASE_PATH}/completeAppointments`, null, { params: { Id: id } });

export const deleteAppointment = (id) => api.delete(`${BASE_PATH}/${id}`);