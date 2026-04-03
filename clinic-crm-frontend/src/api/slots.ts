import { apiClient } from "./client";

export type FreeSlot = string; // e.g. "09:30"

export const getFreeSlots = async (params: {
  docId: number;
  day: string; // yyyy-MM-dd
  branchId: number;
}): Promise<FreeSlot[]> => {
  const res = await apiClient.get<FreeSlot[]>("/Appointment/getFreeSlots", {
    params
  });
  return res.data;
};

