import apiClient from './client';

export interface AddBranchSettingDTO {
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive?: boolean;
}

export interface UpdateBranchSettingDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface BranchSettingDTO {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export const branchService = {
  getAll: async (): Promise<BranchSettingDTO[]> => {
    const response = await apiClient.get<BranchSettingDTO[]>('/api/BranchSetting');
    return response.data;
  },

  getById: async (id: number): Promise<BranchSettingDTO> => {
    const response = await apiClient.get<BranchSettingDTO>(`/api/BranchSetting/${id}`);
    return response.data;
  },

  create: async (data: AddBranchSettingDTO): Promise<BranchSettingDTO> => {
    const response = await apiClient.post<BranchSettingDTO>('/api/BranchSetting', data);
    return response.data;
  },

  update: async (data: UpdateBranchSettingDTO): Promise<BranchSettingDTO> => {
    const response = await apiClient.put<BranchSettingDTO>('/api/BranchSetting', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/BranchSetting/${id}`);
  },
};
