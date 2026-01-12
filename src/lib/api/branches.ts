import apiClient from './client';

export interface BranchSettingDTO {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  subCity: string;
  city: string;
  location: string;
}

export interface AddBranchSettingDTO {
  name: string;
  address: string;
  phoneNumber: string;
  subCity: string;
  city: string;
  location: string;
}

export interface UpdateBranchSettingDTO {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  subCity: string;
  city: string;
  location: string;
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
  
  create: async (dto: AddBranchSettingDTO): Promise<BranchSettingDTO> => {
    const response = await apiClient.post<BranchSettingDTO>('/api/BranchSetting', dto);
    return response.data;
  },
  
  update: async (dto: UpdateBranchSettingDTO): Promise<BranchSettingDTO> => {
    const response = await apiClient.put<BranchSettingDTO>('/api/BranchSetting', dto);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/BranchSetting/${id}`);
  },
};
