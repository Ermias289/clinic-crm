import apiClient from './client';

export interface AddAppointmentDTO {
  patientId: number;
  doctorId: number;
  serviceId: number;
  branchId: number;
  date: string;
  time: string;
  notes?: string;
}

export interface AppointmentDTO {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  serviceId: number;
  serviceName: string;
  branchId: number;
  branchName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export const appointmentService = {
  getAll: async (): Promise<AppointmentDTO[]> => {
    const response = await apiClient.get<AppointmentDTO[]>('/api/Appointment');
    return response.data;
  },

  getById: async (id: number): Promise<AppointmentDTO> => {
    const response = await apiClient.get<AppointmentDTO>(`/api/Appointment/${id}`);
    return response.data;
  },

  getByPatientId: async (patientId: number): Promise<AppointmentDTO[]> => {
    const response = await apiClient.get<AppointmentDTO[]>(`/api/Appointment/bypatientId/${patientId}`);
    return response.data;
  },

  create: async (data: AddAppointmentDTO): Promise<AppointmentDTO> => {
    const response = await apiClient.post<AppointmentDTO>('/api/Appointment', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Appointment/${id}`);
  },

  cancel: async (id: number, reason: string): Promise<void> => {
    await apiClient.put('/api/Appointment/cancelAppointment', null, {
      params: { Id: id, reason },
    });
  },

  completeMultiple: async (ids: number[]): Promise<void> => {
    await apiClient.put('/api/Appointment/completeAppointments', ids);
  },
};
