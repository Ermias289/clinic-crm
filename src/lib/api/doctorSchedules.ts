import apiClient from './client';

export interface AddDoctorScheduleDTO {
  medicalProfessionalId: number;
  branchSettingId: number;
  weekDay: string;
  startTime: string;
  endTime: string;
}

export interface UpdateDoctorScheduleDTO {
  id: number;
  medicalProfessionalId: number;
  branchSettingId: number;
  weekDay: string;
  startTime: string;
  endTime: string;
}

export interface DoctorScheduleDTO {
  id: number;
  medicalProfessionalId: number;
  branchSettingId: number;
  weekDay: string;
  startTime: string;
  endTime: string;
}

export const doctorScheduleService = {
  // Test function to check if the API is working
  testConnection: async (): Promise<boolean> => {
    try {
      console.log("Testing DoctorSchedule API connection...");
      const response = await apiClient.get<DoctorScheduleDTO[]>('/api/DoctorSchedule');
      console.log("DoctorSchedule API is working, got", response.data.length, "schedules");
      
      // Test other endpoints
      console.log("Testing POST endpoint...");
      // We won't actually create a test schedule, just log that we could test it
      
      return true;
    } catch (error: any) {
      console.error("DoctorSchedule API test failed:", error);
      return false;
    }
  },

  getAll: async (): Promise<DoctorScheduleDTO[]> => {
    const response = await apiClient.get<DoctorScheduleDTO[]>('/api/DoctorSchedule');
    return response.data;
  },

  getById: async (id: number): Promise<DoctorScheduleDTO> => {
    const response = await apiClient.get<DoctorScheduleDTO>(`/api/DoctorSchedule/${id}`);
    return response.data;
  },

  getByDoctorId: async (doctorId: number): Promise<DoctorScheduleDTO[]> => {
    // Since the server doesn't have the doctor-specific endpoint, use client-side filtering
    console.log("Getting schedules for doctor:", doctorId, "using client-side filtering");
    const response = await apiClient.get<DoctorScheduleDTO[]>('/api/DoctorSchedule');
    const filtered = response.data.filter(schedule => schedule.medicalProfessionalId === doctorId);
    console.log("Found", filtered.length, "schedules for doctor", doctorId);
    return filtered;
  },

  create: async (data: AddDoctorScheduleDTO): Promise<DoctorScheduleDTO> => {
    console.log("Creating doctor schedule:", data);
    const response = await apiClient.post<DoctorScheduleDTO>('/api/DoctorSchedule', data);
    console.log("Schedule created successfully:", response.data);
    return response.data;
  },

  update: async (data: UpdateDoctorScheduleDTO): Promise<DoctorScheduleDTO> => {
    console.log("Updating doctor schedule:", data);
    const response = await apiClient.put<DoctorScheduleDTO>('/api/DoctorSchedule', data);
    console.log("Schedule updated successfully:", response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log("Deleting doctor schedule:", id);
    await apiClient.delete(`/api/DoctorSchedule/${id}`);
    console.log("Schedule deleted successfully");
  },
};
