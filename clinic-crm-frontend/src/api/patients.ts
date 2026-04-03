import { apiClient } from "./client";

export interface PatientSummary {
  id: number;
  fName: string;
  mName: string;
  lName: string;
  phoneNumber: string;
  email: string;
}

export interface AddPatientRequest {
  fName: string;
  mName?: string;
  lName: string;
  phoneNumber: string;
  email?: string;
  gender?: string;
  address?: string;
  city?: string;
  subCity?: string;
  country?: string;
  dateOfBirth?: string;
  requiresUserAccount?: boolean;
}

export const getAllPatients = async (): Promise<PatientSummary[]> => {
  const res = await apiClient.get<PatientSummary[]>("/Patient");
  return res.data;
};

export const createPatient = async (payload: AddPatientRequest) => {
  await apiClient.post("/Patient", payload);
};

