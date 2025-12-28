import apiClient from './client';

export interface RequestCardDTO {
  patientId: number;
  cardTypeId: number;
}

export interface UpdateCardDTO {
  id: number;
  status: 'active' | 'expired' | 'pending' | 'suspended';
}

export interface CardDTO {
  id: number;
  referenceNumber: string;
  patientId: number;
  patientName: string;
  cardTypeId: number;
  cardTypeName: string;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  issueDate: string;
  expiryDate: string;
  benefits: string[];
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
