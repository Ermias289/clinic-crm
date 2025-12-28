import apiClient from './client';

export interface CreateUserAccountDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LogInDTO {
  email: string;
  password: string;
}

export interface LogInReturnDTO {
  token: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ChangePasswordDTO {
  currentPassword?: string;
  newPassword: string;
  otp?: string;
  reset?: boolean;
  email?: string;
}

export const authService = {
  register: async (data: CreateUserAccountDTO) => {
    const response = await apiClient.post('/api/Auth/register', data);
    return response.data;
  },

  login: async (data: LogInDTO): Promise<LogInReturnDTO> => {
    const response = await apiClient.post<LogInReturnDTO>('/api/Auth/login', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  changePassword: async (data: ChangePasswordDTO) => {
    const response = await apiClient.post('/api/Auth/changePassword', data);
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await apiClient.post('/api/Auth/changePassword', {
      email,
      otp,
      newPassword,
      reset: true,
      currentPassword: '',
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};
