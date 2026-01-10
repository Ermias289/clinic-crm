import apiClient from './client';

export interface CreateUserDTO {
  username: string;
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  userRoleId?: number;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface User {
  id: number;
  username: string;
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  roleName: string;
  phoneNumber?: string;
  userRoleId: number;
}

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/User');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/api/User/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDTO): Promise<User> => {
    const response = await apiClient.post<User>('/api/User', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserDTO): Promise<User> => {
    const response = await apiClient.put<User>(`/api/User/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/User/${id}`);
  },

  confirmAccount: async (email: string, otp: string): Promise<void> => {
    await apiClient.put('/api/User/confirmAccount', null, { params: { email, OTP: otp } });
  },
};
