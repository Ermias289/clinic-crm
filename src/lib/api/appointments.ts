import apiClient from './client';

export interface AppointmentDTO {
  id: number;
  reference: string;
  dentistryId: number;
  medicalProfessionalId: number;
  patientId: number;
  branchId: number;
  reservationTime: string;
  day: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
  completedAt: string;
  canceledAt: string;
  cancelReason: string;
  createdAt: string;
  updateAt: string;

  //fields for frontend display
  patientName?: string;
  doctorName?: string;
  serviceName?: string;
  branchName?: string;
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

  create: async (data: {
    patientId: number;
    medicalProfessionalId: number;
    serviceId: number;
    branchId: number;
    day: string;
    reservationTime: string;
  }): Promise<AppointmentDTO> => {
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
};
