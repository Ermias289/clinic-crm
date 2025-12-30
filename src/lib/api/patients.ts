import apiClient from './client';

export interface AddPatientDTO {
  fName: string;
  mName?: string;
  lName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  subCity?: string;
  country?: string;
  city?: string;
  alergies?: string;
  chronicConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  requiresUserAccount?: boolean;
}

export interface UpdatePatientDTO extends AddPatientDTO {
  id: number;
}

export interface Patient extends AddPatientDTO {
  id: number;
  createdAt?: string;
}

export const patientsService = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get<Patient[]>('/api/Patient');
    return response.data;
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/api/Patient/${id}`);
    return response.data;
  },

  create: async (data: AddPatientDTO): Promise<Patient> => {
    const response = await apiClient.post<Patient>('/api/Patient', data);
    return response.data;
  },

  update: async (data: UpdatePatientDTO): Promise<Patient> => {
    const response = await apiClient.put<Patient>('/api/Patient', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Patient/${id}`);
  },
};
