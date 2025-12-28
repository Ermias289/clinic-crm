import apiClient from './client';

export interface UpdateCompanySettingDTO {
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  taxId?: string;
}

export interface CompanySettingDTO {
  id: number;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  taxId?: string;
}

export const companySettingService = {
  get: async (): Promise<CompanySettingDTO> => {
    const response = await apiClient.get<CompanySettingDTO>('/api/CompanySetting');
    return response.data;
  },

  update: async (data: UpdateCompanySettingDTO): Promise<CompanySettingDTO> => {
    const response = await apiClient.put<CompanySettingDTO>('/api/CompanySetting', data);
    return response.data;
  },
};
