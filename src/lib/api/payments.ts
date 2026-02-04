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

/* ------------------ PAYMENT TYPE ------------------ */
export interface PaymentType {
  id: number;
  name: string;
  description: string;
}

/* ------------------ PAYMENT ------------------ */
export interface Payment {
  id: number;
  reference: string;
  status: 'Auto-Prepared' | 'Partially-Paid' | 'Requested' | 'Checked' | 'Approved' | 'Rejected';
  card: PaymentCard;
  cardId: number;
  expectedAmount: number;
  unPaidAmount: number;
  paidAmount: number;
  requestedAmount: number;
  paymentProof?: string;
  paymentTypeId?: number;
  paymentType?: PaymentType;
  isInsuranceCovered?: boolean;
  requestedBy: PaymentUser;
  requestedById: number;
  requestedAt: string;
  checkedAt?: string;
  checkedBy?: PaymentUser;
  checkedById?: number;
  checkRemark?: string;
  approvedAt?: string;
  approvedBy?: PaymentUser;
  approvedById?: number;
  approvedAmount?: number;
  approvalRemark?: string;
  rejectedAt?: string;
  rejectionRemark?: string;
  canceledAt?: string;
  canceledRemark?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------ REQUEST BODIES ------------------ */
export interface CheckPaymentRequest {
  id: number;
  chekedAmount: number;
  checkRemark: string;
  paymentProof: string;
}

export interface ApprovePaymentRequest {
  id: number;
  approvedAmount: number;
  approvalRemark: string;
}

export interface RejectPaymentRequest {
  id: number;
  rejectionRemark: string;
}

export interface CancelPaymentRequest {
  id: number;
  canceledRemark: string;
}

export interface RequestPaymentRequest {
  id: number;
  paymentTypeId: number;
  paymentProof?: string;
}

export interface UploadFileResponse {
  fileName: string;
  filePath: string;
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

  getByPatientId: async (id: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/Payment/bypatientId/${id}`);
    return response.data;
  },

  getByCardId: async (id: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/api/Payment/bycardId/${id}`);
    return response.data;
  },

  getPaymentTypes: async (): Promise<PaymentType[]> => {
    const response = await apiClient.get<PaymentType[]>('/api/PaymentType');
    return response.data;
  },

  checkPayment: async (data: CheckPaymentRequest): Promise<Payment> => {
    const response = await apiClient.put<Payment>("/api/Payment/checkPayment", data);
    return response.data;
  },

  approvePayment: async (data: ApprovePaymentRequest): Promise<Payment> => {
    const response = await apiClient.put<Payment>("/api/Payment/approvePayment", data);
    return response.data;
  },

  rejectPayment: async (data: RejectPaymentRequest): Promise<Payment> => {
    const response = await apiClient.put<Payment>("/api/Payment/rejectPayment", data);
    return response.data;
  },

  cancelPayment: async (data: CancelPaymentRequest): Promise<Payment> => {
    const response = await apiClient.put<Payment>("/api/Payment/cancelPayment", data);
    return response.data;
  },

  requestPayment: async (data: RequestPaymentRequest): Promise<Payment> => {
    const response = await apiClient.put<Payment>("/api/Payment/paymentRequest", data);
    return response.data;
  },

  uploadFile: async (file: File): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<UploadFileResponse>('/api/FileUpload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};