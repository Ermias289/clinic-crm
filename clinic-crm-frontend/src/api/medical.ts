import { apiClient } from "./client";

export interface MedicalProfessional {
  id: number;
  fName: string;
  mName: string;
  lName: string;
  specialty: string;
  jobTitle: string;
}

export interface MedicalService {
  id: number;
  name: string;
  description: string;
  durationInMinutes: number;
}

export interface DocService {
  id: number;
  medicalProfessionalId: number;
  medicalServiceId: number;
  branchSettingId: number;
}

export const getMedicalProfessionals = async (): Promise<MedicalProfessional[]> => {
  const res = await apiClient.get<MedicalProfessional[]>("/MedicalProfessional");
  return res.data;
};

export const getMedicalServices = async (): Promise<MedicalService[]> => {
  const res = await apiClient.get<MedicalService[]>("/MedicalService");
  return res.data;
};

export const getDocServicesForAppointment = async (params: {
  serviceId?: number;
  branchId?: number;
  docId?: number;
}): Promise<DocService[]> => {
  const res = await apiClient.get<DocService[]>("/DocService/docService", {
    params
  });
  return res.data;
};

