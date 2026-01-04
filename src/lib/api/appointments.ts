import apiClient from './client';

export interface AppointmentDTO {
  id: number;
  medicalProfessionalId: number;
  dentistryId: number;
  branchId: number;
  patientId: number;
  day: string;
  reservationTime: string;
  status: string;
  doctorName?: string;
  serviceName?: string;
  branchName?: string;
  patientName?: string;
}

export interface CreateAppointmentDTO {
  dentistryId: number;        // This is the service/treatment ID
  medicalProfessionalId: number;
  patientId: number;
  branchId: number;
  reservationTime: string;
  day: string;
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

  create: async (data: CreateAppointmentDTO): Promise<AppointmentDTO> => {
    // Ensure the data structure matches the API exactly
    const requestData = {
      dentistryId: data.dentistryId,
      medicalProfessionalId: data.medicalProfessionalId,
      patientId: data.patientId,
      branchId: data.branchId,
      reservationTime: data.reservationTime,
      day: data.day,
    };
    
    console.log("Sending appointment data:", requestData);
    const response = await apiClient.post<AppointmentDTO>('/api/Appointment', requestData);
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
  
  // Optional: Update appointment
  update: async (id: number, data: Partial<CreateAppointmentDTO>): Promise<AppointmentDTO> => {
    const response = await apiClient.put<AppointmentDTO>(`/api/Appointment/${id}`, data);
    return response.data;
  },
};