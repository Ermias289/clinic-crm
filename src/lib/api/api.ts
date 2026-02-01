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
    const response = await fetch(
      `https://crmgate.nexabusinessgroup.com/api/DashBoard/AppointmentReport?fromDate=${fromDate}&toDate=${toDate}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add auth if needed
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointment report');
    }
    
    return response.json();
  },

  getMostBookedServices: async (): Promise<{ topServices: MostBookedService[] }> => {
    const response = await fetch(
      'https://crmgate.nexabusinessgroup.com/api/DashBoard/MostBookedServices',
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add auth if needed
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch most booked services');
    }
    
    return response.json();
  },
};