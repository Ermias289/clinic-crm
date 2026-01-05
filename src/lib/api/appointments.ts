import apiClient from './client';

export interface AppointmentDTO {
  id: number;
  reference: string;
  dentistryId: number;
  medicalProfessionalId: number;
  patientId: number;
  patient: {
    id: number;
    fName: string;
    mName: string;
    lName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    city: string;
    subCity: string;
  };
  reservationTime: string;
  day: string;
  status: string;
  scheduledBy: {
    id: number;
    username: string;
    fName: string;
    lName: string;
    email: string;
  };
  scheduledById: number;
  scheduledAt: string;
  completedAt: string;
  canceledAt: string;
  cancelReason: string;
  createdAt: string;
  updateAt: string;
  // Additional fields for UI
  doctorName?: string;
  serviceName?: string;
  branchName?: string;
  patientName?: string;
}

export interface CreateAppointmentDTO {
  dentistryId: number;
  medicalProfessionalId: number;
  patientId: number;
  branchId: number;
  reservationTime: string;
  day: string;
}

export interface CancelAppointmentDTO {
  Id: number;
  reason: string;
}

export interface AppointmentFilters {
  doctorId?: number;
  patientId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
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

  getByUserId: async (userId: number): Promise<AppointmentDTO[]> => {
    const response = await apiClient.get<AppointmentDTO[]>(`/api/Appointment/byuserId/${userId}`);
    return response.data;
  },

  create: async (data: CreateAppointmentDTO): Promise<AppointmentDTO> => {
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

  complete: async (id: number): Promise<void> => {
    await apiClient.put('/api/Appointment/completeAppointments', null, {
      params: { Id: id },
    });
  },

  update: async (id: number, data: Partial<CreateAppointmentDTO>): Promise<AppointmentDTO> => {
    const response = await apiClient.put<AppointmentDTO>(`/api/Appointment/${id}`, data);
    return response.data;
  },
};