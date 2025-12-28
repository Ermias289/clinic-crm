import apiClient from './client';

export interface AddDoctorScheduleDTO {
  doctorId: number;
  branchId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface UpdateDoctorScheduleDTO {
  id: number;
  doctorId: number;
  branchId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorScheduleDTO {
  id: number;
  doctorId: number;
  branchId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export const doctorScheduleService = {
  getAll: async (): Promise<DoctorScheduleDTO[]> => {
    const response = await apiClient.get<DoctorScheduleDTO[]>('/api/DoctorSchedule');
    return response.data;
  },

  getById: async (id: number): Promise<DoctorScheduleDTO> => {
    const response = await apiClient.get<DoctorScheduleDTO>(`/api/DoctorSchedule/${id}`);
    return response.data;
  },

  create: async (data: AddDoctorScheduleDTO): Promise<DoctorScheduleDTO> => {
    const response = await apiClient.post<DoctorScheduleDTO>('/api/DoctorSchedule', data);
    return response.data;
  },

  update: async (data: UpdateDoctorScheduleDTO): Promise<DoctorScheduleDTO> => {
    const response = await apiClient.put<DoctorScheduleDTO>('/api/DoctorSchedule', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/DoctorSchedule/${id}`);
  },
};
