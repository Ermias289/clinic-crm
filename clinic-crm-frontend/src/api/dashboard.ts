import { apiClient } from "./client";

export interface DashBoardData {
  scheduledAppointmentsCount: number;
  completedAppointmentsCount: number;
  canceledAppointmentsCount: number;
}

export interface DashboardDTO {
  monday: DashBoardData;
  tuesday: DashBoardData;
  wednesday: DashBoardData;
  thursday: DashBoardData;
  friday: DashBoardData;
  saturday: DashBoardData;
  sunday: DashBoardData;
}

export interface ServiceUsageDTO {
  id: number;
  serviceName: string;
  bookingCount: number;
}

export interface MostBookedServicesDTO {
  topServices: ServiceUsageDTO[];
}

export const getAppointmentReport = async (params: {
  fromDate?: string;
  toDate?: string;
}): Promise<DashboardDTO> => {
  const res = await apiClient.get<DashboardDTO>("/DashBoard/AppointmentReport", { params });
  return res.data;
};

export const getMostBookedServices = async (): Promise<MostBookedServicesDTO> => {
  const res = await apiClient.get<MostBookedServicesDTO>("/DashBoard/MostBookedServices");
  return res.data;
};

