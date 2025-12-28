import apiClient from './client';

export interface AddWorkingDaySettingDTO {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay?: boolean;
  branchId?: number;
}

export interface UpdateWorkingDaySettingDTO extends AddWorkingDaySettingDTO {
  id: number;
}

export interface WorkingDaySetting {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay?: boolean;
  branchId?: number;
}

export const workingDaySettingsService = {
  getAll: async (): Promise<WorkingDaySetting[]> => {
    const response = await apiClient.get<WorkingDaySetting[]>('/api/WorkingDaySetting');
    return response.data;
  },

  getById: async (id: number): Promise<WorkingDaySetting> => {
    const response = await apiClient.get<WorkingDaySetting>(`/api/WorkingDaySetting/${id}`);
    return response.data;
  },

  create: async (data: AddWorkingDaySettingDTO): Promise<WorkingDaySetting> => {
    const response = await apiClient.post<WorkingDaySetting>('/api/WorkingDaySetting', data);
    return response.data;
  },

  update: async (data: UpdateWorkingDaySettingDTO): Promise<WorkingDaySetting> => {
    const response = await apiClient.put<WorkingDaySetting>('/api/WorkingDaySetting', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/WorkingDaySetting/${id}`);
  },
};
