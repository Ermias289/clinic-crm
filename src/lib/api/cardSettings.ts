import apiClient from './client';

export interface AddCardSettingDTO {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateCardSettingDTO {
  id: number;
  key: string;
  value: string;
  description?: string;
}

export interface CardSettingDTO {
  id: number;
  key: string;
  value: string;
  description?: string;
}

export const cardSettingService = {
  getAll: async (): Promise<CardSettingDTO[]> => {
    const response = await apiClient.get<CardSettingDTO[]>('/api/CardSetting');
    return response.data;
  },

  getById: async (id: number): Promise<CardSettingDTO> => {
    const response = await apiClient.get<CardSettingDTO>(`/api/CardSetting/${id}`);
    return response.data;
  },

  create: async (data: AddCardSettingDTO): Promise<CardSettingDTO> => {
    const response = await apiClient.post<CardSettingDTO>('/api/CardSetting', data);
    return response.data;
  },

  update: async (data: UpdateCardSettingDTO): Promise<CardSettingDTO> => {
    const response = await apiClient.put<CardSettingDTO>('/api/CardSetting', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/CardSetting/${id}`);
  },
};
