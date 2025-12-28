import apiClient from './client';

export interface CreatePaymentDTO {
  appointmentId: number;
  amount: number;
  paymentMethod?: string;
}

export interface CheckPaymentDTO {
  paymentId: number;
}

export interface ApprovePaymentDTO {
  paymentId: number;
  approvedBy?: number;
}

export interface CancelPaymentDTO {
  paymentId: number;
  reason?: string;
}

export interface RejectPaymentDTO {
  paymentId: number;
  reason?: string;
}

export interface Payment {
  id: number;
  appointmentId: number;
  amount: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

export const paymentsService = {
  getAll: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/api/Payment');
    return response.data;
  },

  getByStatus: async (status: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/Payment/${status}`);
    return response.data;
  },

  getById: async (id: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/${id}`);
    return response.data;
  },

  getByPatientId: async (patientId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/Payment/bypatientId/${patientId}`, {
      params: { patientId },
    });
    return response.data;
  },

  getByCardId: async (cardId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/Payment/bycardId/${cardId}`, {
      params: { cardId },
    });
    return response.data;
  },

  createPaymentRequest: async (data: CreatePaymentDTO): Promise<Payment> => {
    const response = await apiClient.put<Payment>('/api/Payment/paymentRequest', data);
    return response.data;
  },

  checkPayment: async (data: CheckPaymentDTO): Promise<Payment> => {
    const response = await apiClient.put<Payment>('/api/Payment/checkPayment', data);
    return response.data;
  },

  approvePayment: async (data: ApprovePaymentDTO): Promise<Payment> => {
    const response = await apiClient.put<Payment>('/api/Payment/approvePayment', data);
    return response.data;
  },

  cancelPayment: async (data: CancelPaymentDTO): Promise<void> => {
    await apiClient.put('/api/Payment/cancelPayment', data);
  },

  rejectPayment: async (data: RejectPaymentDTO): Promise<void> => {
    await apiClient.put('/api/Payment/rejectPayment', data);
  },
};
