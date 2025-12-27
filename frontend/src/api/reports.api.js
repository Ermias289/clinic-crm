import api from "./axios";

const BASE_PATH = "/api/Report";

export const getAppointmentsReport = (params) => 
  api.get(`${BASE_PATH}/appointments`, { params });

export const getRevenueReport = (params) => 
  api.get(`${BASE_PATH}/revenue`, { params });

export const getPatientHistoryReport = (patientId) => 
  api.get(`${BASE_PATH}/patientHistory/${patientId}`);