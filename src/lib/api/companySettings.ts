import apiClient from './client';

export interface UpdateCompanySettingDTO {
  id: number;
  name: string;
  logo?: string;
  prefix?: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  country?: string;
  subCity?: string;
  locationOnMap?: string;
  emergencyPhoneNumber?: string;
}

export interface CompanySettingDTO {
  id: number;
  name: string;
  logo?: string;
  prefix?: string;
  email: string;
  phoneNumber: string;
  emergencyPhoneNumber?: string;
  address: string;
  city?: string;
  country?: string;
  subCity?: string;
  locationOnMap?: string;
  createdAt: string;
  updatedAt: string;
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
