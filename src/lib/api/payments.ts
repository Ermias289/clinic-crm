import apiClient from './client';

export interface PaymentCard {
  id: number;
  cardNumber: string;
  patientId: number;
  cardTypeId: number;
  status: string;
  requestedById: number;
  requestRemark: string;
  requestedAt: string;
  activationRemark: string;
  activatedAt: string;
  expiredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentUser {
  id: number;
  username: string;
  fName: string;
  mName?: string;
  lName: string;
  email?: string;
  phoneNumber?: string;
}

export interface Payment {
  id: number;
  reference: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'UnderReview';
  card: PaymentCard;
  cardId: number;
  expectedAmount: number;
  unPaidAmount: number;
  paidAmount: number;
  paymentProof?: string;
  isInsuranceCovered?: boolean;
  requestedAmount: number;
  requestedBy: PaymentUser;
  requestedById: number;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: PaymentUser;
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

  paymentRequest: async (data: Partial<Payment>): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/api/Payment/paymentRequest', data);
    return response.data;
  },

  checkPayment: async (paymentId: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/api/Payment/checkPayment`, {
      params: { paymentId },
    });
    return response.data;
  },

  approvePayment: async (paymentId: number): Promise<void> => {
    await apiClient.put(`/api/Payment/approvePayment`, { paymentId });
  },

  cancelPayment: async (paymentId: number): Promise<void> => {
    await apiClient.put(`/api/Payment/cancelPayment`, { paymentId });
  },

  rejectPayment: async (paymentId: number): Promise<void> => {
    await apiClient.put(`/api/Payment/rejectPayment`, { paymentId });
  },
};
