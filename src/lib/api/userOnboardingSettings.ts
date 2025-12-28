import apiClient from './client';

export interface AddUserOnBoardingSettingDTO {
  stepName: string;
  description?: string;
  order?: number;
  isRequired?: boolean;
}

export interface UpdateUserOnBoardingSettingDTO extends AddUserOnBoardingSettingDTO {
  id: number;
}

export interface UserOnBoardingSetting {
  id: number;
  stepName: string;
  description?: string;
  order?: number;
  isRequired?: boolean;
}

export const userOnboardingSettingsService = {
  getAll: async (): Promise<UserOnBoardingSetting[]> => {
    const response = await apiClient.get<UserOnBoardingSetting[]>('/api/UserOnBoardingSetting');
    return response.data;
  },

  getById: async (id: number): Promise<UserOnBoardingSetting> => {
    const response = await apiClient.get<UserOnBoardingSetting>(`/api/UserOnBoardingSetting/${id}`);
    return response.data;
  },

  create: async (data: AddUserOnBoardingSettingDTO): Promise<UserOnBoardingSetting> => {
    const response = await apiClient.post<UserOnBoardingSetting>('/api/UserOnBoardingSetting', data);
    return response.data;
  },

  update: async (data: UpdateUserOnBoardingSettingDTO): Promise<UserOnBoardingSetting> => {
    const response = await apiClient.put<UserOnBoardingSetting>('/api/UserOnBoardingSetting', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/UserOnBoardingSetting/${id}`);
  },
};
