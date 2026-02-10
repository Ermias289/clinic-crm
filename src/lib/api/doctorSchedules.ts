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
    const response = await apiClient.get<DoctorScheduleDTO[]>(`/api/DoctorSchedule/getByDocId${doctorId}`);
    return response.data;
  },

create: async (data: AddDoctorScheduleDTO): Promise<DoctorScheduleDTO> => {
  console.log("Creating doctor schedule:", data);
  try {
    const response = await apiClient.post<DoctorScheduleDTO>('/api/DoctorSchedule', data);
    console.log("Schedule created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Schedule creation FAILED. Full error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,  // <-- This contains the actual error message!
      headers: error.response?.headers,
      requestData: data,
      errorMessage: error.message,
      errorCode: error.code
    });
    
    // Also log the raw response for debugging
    console.error("Raw error response:", error.response);
    
    throw error;
  }
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
