import apiClient from './client';

export interface UserRole {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
}

export const userRolesService = {
  getAll: async (): Promise<UserRole[]> => {
    const response = await apiClient.get<UserRole[]>('/api/UserRole');
    return response.data;
  },

  getById: async (id: number): Promise<UserRole> => {
    const response = await apiClient.get<UserRole>(`/api/UserRole/${id}`);
    return response.data;
  },

  getByName: async (name: string): Promise<UserRole> => {
    const response = await apiClient.get<UserRole>('/api/UserRole/getRoleByName', { params: { Name: name } });
    return response.data;
  },

  create: async (data: UserRole): Promise<UserRole> => {
    const response = await apiClient.post<UserRole>('/api/UserRole', data);
    return response.data;
  },

  update: async (data: UserRole): Promise<UserRole> => {
    const response = await apiClient.put<UserRole>('/api/UserRole', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/UserRole/${id}`);
  },
};
