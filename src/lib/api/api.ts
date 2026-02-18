import apiClient from "@/lib/api/client";

export interface AppointmentReportItem {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
}

export interface MostBookedService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  color?: string;
}

export interface DashboardReportResponse {
  topServices: MostBookedService[];
}

// Dashboard service
export const dashboardService = {
  getAppointmentReport: async (fromDate: string, toDate: string): Promise<AppointmentReportItem[]> => {
    try {
      const response = await apiClient.get('/api/DashBoard/AppointmentReport', {
        params: {
          fromDate: fromDate || '',
          toDate: toDate || ''
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch appointment report');
    }
  },

  getMostBookedServices: async (): Promise<{ topServices: MostBookedService[] }> => {
    try {
      const response = await apiClient.get('/api/DashBoard/MostBookedServices');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch most booked services');
    }
  },
};