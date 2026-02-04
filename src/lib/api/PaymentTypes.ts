// lib/api/paymentTypes.ts
import { apiClient } from './client';

export interface PaymentType {
  id: number;
  name: string;
  description: string;
}

export interface AddPaymentTypeDTO {
  name: string;
  description: string;
}

export interface UpdatePaymentTypeDTO {
  id: number;
  name: string;
  description: string;
}

export const paymentTypeService = {
  getAll: async (): Promise<PaymentType[]> => {
    const response = await apiClient.get<PaymentType[]>('/api/PaymentType');
    return response.data;
  },

  getById: async (id: number): Promise<PaymentType> => {
    const response = await apiClient.get<PaymentType>(`/api/PaymentType/${id}`);
    return response.data;
  },

  create: async (data: AddPaymentTypeDTO): Promise<PaymentType> => {
    const response = await apiClient.post<PaymentType>('/api/PaymentType', data);
    return response.data;
  },

  update: async (data: UpdatePaymentTypeDTO): Promise<PaymentType> => {
    // ID is in the request body, not in the URL
    const response = await apiClient.put<PaymentType>('/api/PaymentType', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/PaymentType/${id}`);
  }
};