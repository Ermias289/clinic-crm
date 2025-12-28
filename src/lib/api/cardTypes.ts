import apiClient from './client';

export interface AddCardTypeDTO {
  name: string;
  description: string;
  duration: number;
  price: number;
  benefits: string[];
  color: string;
  isActive?: boolean;
}

export interface UpdateCardTypeDTO {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  benefits: string[];
  color: string;
  isActive: boolean;
}

export interface CardTypeDTO {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  benefits: string[];
  color: string;
  isActive: boolean;
}

export const cardTypeService = {
  getAll: async (): Promise<CardTypeDTO[]> => {
    const response = await apiClient.get<CardTypeDTO[]>('/api/CardType');
    return response.data;
  },

  getById: async (id: number): Promise<CardTypeDTO> => {
    const response = await apiClient.get<CardTypeDTO>(`/api/CardType/${id}`);
    return response.data;
  },

  create: async (data: AddCardTypeDTO): Promise<CardTypeDTO> => {
    const response = await apiClient.post<CardTypeDTO>('/api/CardType', data);
    return response.data;
  },

  update: async (data: UpdateCardTypeDTO): Promise<CardTypeDTO> => {
    const response = await apiClient.put<CardTypeDTO>('/api/CardType', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/CardType/${id}`);
  },
};
