import apiClient from './client';

export interface Banner {
  id: number;
  image: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const bannersService = {
  getAll: async (): Promise<Banner[]> => {
    const response = await apiClient.get<Banner[]>('/api/Banner');
    return response.data;
  },

  getById: async (id: number): Promise<Banner> => {
    const response = await apiClient.get<Banner>(`/api/Banner/${id}`);
    return response.data;
  },

  add: async (image: string): Promise<Banner> => {
    console.log('Banner service add called with:', image, 'Type:', typeof image);
    const response = await apiClient.post<Banner>('/api/Banner/add', null, {
      params: { Image: image }
    });
    return response.data;
  },

  update: async (id: number, image: string, isActive: boolean): Promise<Banner> => {
    const response = await apiClient.put<Banner>(`/api/Banner/${id}`, null, {
      params: { image, isActive }
    });
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Banner/${id}`);
  },
};