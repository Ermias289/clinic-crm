import api from "./axios";

const BASE_PATH = "/api/Payment";

export const getAllPayments = () => api.get(BASE_PATH);

export const getPaymentById = (id) => api.get(`${BASE_PATH}/${id}`);

export const getPaymentByAppointment = (appointmentId) => 
  api.get(`${BASE_PATH}/byAppointment/${appointmentId}`);

export const processPayment = (data) => api.post(BASE_PATH, data);