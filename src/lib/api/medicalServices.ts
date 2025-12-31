import apiClient from './client';

export interface AddMedicalServiceDTO {
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  branchId?: number;
  doctorId?: number;
}

export interface UpdateMedicalServiceDTO extends AddMedicalServiceDTO {
  id: number;
}

export interface MedicalService {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  branchId?: number;
  doctorId?: number;
}

export const medicalServicesService = {
  getAll: async (): Promise<MedicalService[]> => {
    const response = await apiClient.get<MedicalService[]>('/api/MedicalService');
    return response.data;
  },
  getById: async (id: number): Promise<MedicalService> => {
    const response = await apiClient.get<MedicalService>(`/api/MedicalService/${id}`);
    return response.data;
  },
  create: async (data: AddMedicalServiceDTO): Promise<MedicalService> => {
    const response = await apiClient.post<MedicalService>('/api/MedicalService', data);
    return response.data;
  },
  update: async (data: UpdateMedicalServiceDTO): Promise<MedicalService> => {
    const response = await apiClient.put<MedicalService>('/api/MedicalService', data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/MedicalService/${id}`);
  },
};
