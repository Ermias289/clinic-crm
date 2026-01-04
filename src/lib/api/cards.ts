import apiClient from './client';

export interface RequestCardDTO {
  patientId?: number;           
  cardTypeId: number;         
  requestRemark?: string;     
  patient?: {                   
    fName: string;
    mName?: string;
    lName: string;
    email?: string;
    phoneNumber?: string;
    gender?: string;
    alergies?: string;
    chronicConditions?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    address?: string;
    subCity?: string;
    country?: string;
    city?: string;
    userId?: number;
    dateOfBirth?: string;
    requiresUserAccount?: boolean;
    createdAt?: string;
  };
}

export interface UpdateCardDTO {
  id: number;
  status: 'Active' | 'Expired' | 'Pending' | 'Suspended';
  
  patientId?: number;
  cardTypeId?: number;
  requestRemark?: string;
  activationRemark?: string;
  patientDTO?: {
    id: number;
    fName: string;
    mName: string;
    lName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    alergies: string;
    chronicConditions: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    address: string;
    subCity: string;
    country: string;
    city: string;
    userId: number;
    dateOfBirth: string;
    requiresUserAccount: boolean;
    updatedAt: string;
  };
}

export interface CardDTO {
  id: number;
  cardNumber: string;           
  patientId: number;
  cardTypeId: number;
  status: 'Active' | 'Pending' | 'Expired' | 'Suspended';
  requestRemark?: string;
  activatedAt?: string;
  activationRemark?: string;
  createdAt: string;
  expiredAt?: string;
  updatedAt?: string;
  requestedAt?: string;
  requestedById?: number;
  benefits?: string[];          
}

export const cardService = {
  getAll: async (): Promise<CardDTO[]> => {
    const response = await apiClient.get<CardDTO[]>('/api/Card');
    return response.data;
  },

  getById: async (id: number): Promise<CardDTO> => {
    const response = await apiClient.get<CardDTO>(`/api/Card/${id}`);
    return response.data;
  },

  getByReference: async (reference: string): Promise<CardDTO> => {
    const response = await apiClient.get<CardDTO>(`/api/Card/getByRef/${reference}`);
    return response.data;
  },

  create: async (data: RequestCardDTO): Promise<CardDTO> => {
    const response = await apiClient.post<CardDTO>('/api/Card', data);
    return response.data;
  },

  update: async (data: UpdateCardDTO): Promise<CardDTO> => {
    const response = await apiClient.put<CardDTO>('/api/Card', data);
    return response.data;
  },

  activate: async (id: number): Promise<void> => {
    await apiClient.put(`/api/Card/${id}`);
  },
};