import apiClient from './client';

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
};
