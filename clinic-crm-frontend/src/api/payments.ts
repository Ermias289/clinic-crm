import { apiClient } from "./client";

export interface PaymentSummary {
  id: number;
  reference: string;
  status: string;
  cardId: number;
  expectedAmount: number;
  unpaidAmount: number;
  paidAmount: number;
  requestedAmount: number;
  paymentTypeId?: number;
}

export interface CreatePaymentPayload {
  id: number;
  requestedAmount: number;
  paymentProof?: string;
  isInsuranceCovered?: boolean;
  paymentTypeId?: number;
}

export const getAllPayments = async (): Promise<PaymentSummary[]> => {
  const res = await apiClient.get<PaymentSummary[]>("/Payment");
  return res.data;
};

export const getPaymentsByStatus = async (status: string): Promise<PaymentSummary[]> => {
  const res = await apiClient.get<PaymentSummary[]>(`/Payment/${status}`);
  return res.data;
};

export const getPaymentsByCardId = async (cardId: number): Promise<PaymentSummary[]> => {
  const res = await apiClient.get<PaymentSummary[]>(`/Payment/bycardId/${cardId}`);
  return res.data;
};

export const createPaymentRequest = async (payload: CreatePaymentPayload) => {
  await apiClient.put("/Payment/paymentRequest", payload);
};

