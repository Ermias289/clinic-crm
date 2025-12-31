import apiClient from './client';

export interface AddMedicalProfessionalDTO {
  firstName: string;
  lastName: string;
  specialization?: string;
  email?: string;
  phone?: string;
  branchId?: number;
}

export interface UpdateMedicalProfessionalDTO extends AddMedicalProfessionalDTO {
  id: number;
}

export interface MedicalProfessional {
  id: number;
  firstName: string;
  lastName: string;
  specialization?: string;
  email?: string;
  phone?: string;
  branchId?: number;
}

export const medicalProfessionalsService = {
  getAll: async (): Promise<MedicalProfessional[]> => {
    const response = await apiClient.get<MedicalProfessional[]>('/api/MedicalProfessional');
    return response.data;
  },
  getById: async (id: number): Promise<MedicalProfessional> => {
    const response = await apiClient.get<MedicalProfessional>(`/api/MedicalProfessional/${id}`);
    return response.data;
  },
  create: async (data: AddMedicalProfessionalDTO): Promise<MedicalProfessional> => {
    const response = await apiClient.post<MedicalProfessional>('/api/MedicalProfessional', data);
    return response.data;
  },
  update: async (data: UpdateMedicalProfessionalDTO): Promise<MedicalProfessional> => {
    const response = await apiClient.put<MedicalProfessional>('/api/MedicalProfessional', data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/MedicalProfessional/${id}`);
  },
};
