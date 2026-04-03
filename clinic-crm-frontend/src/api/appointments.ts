import { apiClient } from "./client";

export interface AppointmentSummary {
  id: number;
  dentistryId: number;
  medicalProfessionalId: number;
  patientId: number | null;
  branchId: number | null;
  reservationTime: string;
  day: string;
  status?: string;
}

export interface AddAppointmentRequest {
  dentistryId: number;
  medicalProfessionalId: number;
  patientId?: number;
  branchId?: number;
  reservationTime: string; // HH:mm
  day: string; // yyyy-MM-dd
}

export const getAllAppointments = async (): Promise<AppointmentSummary[]> => {
  const res = await apiClient.get<AppointmentSummary[]>("/Appointment");
  return res.data;
};

export const createAppointment = async (payload: AddAppointmentRequest) => {
  await apiClient.post("/Appointment", payload);
};

