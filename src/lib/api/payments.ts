import apiClient from './client';

/* ------------------ CARD ------------------ */
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
  requestedBy?: PaymentUser;
}

/* ------------------ USER ------------------ */
export interface PaymentUser {
  id: number;
  username: string;
  fName: string;
  mName?: string;
  lName: string;
  email?: string;
  phoneNumber?: string;
  userRoleId?: number;
  isEmailConfirmed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------ PAYMENT ------------------ */
export interface Payment {
  id: number;
  reference: string;
  status: 'Auto-Prepared' | 'Requested' | 'Checked' | 'Approved' | 'Rejected';
  card: PaymentCard;
  cardId: number;
  expectedAmount: number;
  unPaidAmount: number;
  paidAmount: number;
  requestedAmount: number;
  paymentProof?: string;
  isInsuranceCovered?: boolean;
  requestedBy: PaymentUser;
  requestedById: number;
  requestedAt: string;
  checkedAt?: string;
  checkedBy?: PaymentUser;
  checkRemark?: string;
  approvedAt?: string;
  approvedBy?: PaymentUser;
  approvalRemark?: string;
  rejectedAt?: string;
  rejectionRemark?: string;
  canceledAt?: string;
  canceledRemark?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------ SERVICE ------------------ */
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
  // CHECK
  checkPayment: async (data: { id: number; chekedAmount: number; checkRemark: string; paymentProof: string }): Promise<Payment> => {
    const response = await apiClient.put<Payment>("/api/Payment/checkPayment", data);
    return response.data;
  },

  // APPROVE
  approvePayment: async (data: { id: number; approvedAmount: number; approvalRemark: string }): Promise<void> => {
    await apiClient.put("/api/Payment/approvePayment", data);
  },

  // REJECT
  rejectPayment: async (data: { id: number; rejectionRemark: string }): Promise<void> => {
    await apiClient.put("/api/Payment/rejectPayment", data);
  },

  // CANCEL
  cancelPayment: async (data: { id: number; canceledRemark: string }): Promise<void> => {
    await apiClient.put("/api/Payment/cancelPayment", data);
  },
};

