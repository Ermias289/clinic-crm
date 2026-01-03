import apiClient from "./client";

export interface MedicalService {
  id: number;
  name: string;
  doctorId: number;
  branchId: number;
  price: number;
}

export const servicesService = {
  getAll: async (): Promise<MedicalService[]> => {
    const res = await apiClient.get("/api/MedicalService");
    return res.data;
  },

  create: async (data: Partial<MedicalService>) => {
    return apiClient.post("/api/MedicalService", data);
  },

  update: async (id: number, data: Partial<MedicalService>) => {
    return apiClient.put(`/api/MedicalService/${id}`, data);
  },
};
