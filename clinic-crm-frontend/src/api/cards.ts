import { apiClient } from "./client";

export interface Card {
  id: number;
  reference: string;
  cardTypeId: number;
  patientId: number;
  isActive?: boolean;
}

export interface RequestCardPayload {
  patientId: number;
  cardTypeId: number;
  requestRemark?: string;
}

export interface UpdateCardPayload {
  id: number;
  // partial shape – backend UpdateCardDTO can carry more
  requestRemark?: string;
}

export const getAllCards = async (): Promise<Card[]> => {
  const res = await apiClient.get<Card[]>("/Card");
  return res.data;
};

export const getCardByUserId = async (userId: number): Promise<Card[]> => {
  const res = await apiClient.get<Card[]>(`/Card/cardByUserId/${userId}`);
  return res.data;
};

export const requestCard = async (payload: RequestCardPayload) => {
  await apiClient.post("/Card", payload);
};

export const reactivateCard = async (id: number) => {
  await apiClient.put(`/Card/${id}`);
};

