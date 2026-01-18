import apiClient from './client';

export interface UpdateWorkingDayDTO {
  id: number;
  day: string;
  openingTime: string; // Keep as string to match backend format
  closingTime: string; // Keep as string to match backend format  
  isWorkingDay: boolean;
}

export interface WorkingDayDTO {
  id: number;
  day: string;
  openingTime: string;
  closingTime: string;
  isWorkingDay: boolean;
  companySettingId: number;
}

export const workingDayService = {
  getAll: async (): Promise<WorkingDayDTO[]> => {
    const response = await apiClient.get<WorkingDayDTO[]>('/api/WorkingDaySetting');
    return response.data;
  },

  update: async (data: UpdateWorkingDayDTO): Promise<WorkingDayDTO> => {
    console.log("Sending workday update:", JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.put<WorkingDayDTO>('/api/WorkingDaySetting', data);
      console.log("Workday update response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Workday update error:", error);
      throw error;
    }
  },

  updateMultiple: async (workdays: UpdateWorkingDayDTO[]): Promise<WorkingDayDTO[]> => {
    // Update each workday individually since there's no bulk update endpoint
    const promises = workdays.map(workday => workingDayService.update(workday));
    return Promise.all(promises);
  },

  create: async (data: Omit<UpdateWorkingDayDTO, 'id'>): Promise<WorkingDayDTO> => {
    console.log("Sending workday creation:", JSON.stringify(data, null, 2));
    try {
      const response = await apiClient.post<WorkingDayDTO>('/api/WorkingDaySetting', data);
      console.log("Workday creation response:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("Workday creation error:", error);
      throw error;
    }
  },

  createMultiple: async (workdays: Array<Omit<UpdateWorkingDayDTO, 'id'>>): Promise<WorkingDayDTO[]> => {
    const promises = workdays.map(workday => workingDayService.create(workday));
    return Promise.all(promises);
  }
};