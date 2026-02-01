import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout"; 
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Wallet, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  appointmentService, 
  medicalServicesService, 
  paymentsService, 
  AppointmentDTO, 
  Payment, 
  MedicalService 
} from "@/lib/api";

// Interfaces
interface DayAppointmentData {
  scheduledAppointmentsCount: number;
  completedAppointmentsCount: number;
  canceledAppointmentsCount: number;
}

interface AppointmentReportResponse {
  [key: string]: DayAppointmentData;
}

interface MostBookedService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  color?: string;
}

interface ChartDataItem {
  name: string;
  day: string;
  dayName: string;
  actualDate: string;
  Scheduled: number;
  Completed: number;
  Canceled: number;
}

interface ServiceChartData {
  name: string;
  value: number;
  color: string;
  fullName: string; // For display in the list
}

const Index = () => {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentReport, setAppointmentReport] = useState<AppointmentReportResponse | null>(null);
  const [mostBookedServices, setMostBookedServices] = useState<MostBookedService[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [serviceData, setServiceData] = useState<ServiceChartData[]>([]);
  
  // Default to last 7 days
  const [dateRange, setDateRange] = useState<{ fromDate: string; toDate: string }>({
    fromDate: getLast7Days(),
    toDate: getTodayDate()
  });

  // Helper functions for dates
  function getTodayDate(): string {
    return formatDate(new Date());
  }

  function getLast7Days(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return formatDate(date);
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Get day name from date
  function getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  }

  // Format date for display
  function formatDateDisplay(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Truncate long service names for pie chart labels
  function truncateServiceName(name: string, maxLength: number = 15): string {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 3) + '...';
  }

  // Get dates for each day of week within the range
  function getDatesForDaysOfWeek(fromDate: string, toDate: string): Map<string, string> {
    const dateMap = new Map<string, string>();
    let [start, end] = [new Date(fromDate), new Date(toDate)];
    
    // Ensure start date is before end date
    if (start > end) {
      [start, end] = [end, start];
    }

    
    // For each day in the range, map the day name to the first occurrence
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = getDayName(d);
      const dateStr = formatDate(d);
      
      // Only set if not already set (we want the first occurrence of each day)
      if (!dateMap.has(dayName)) {
        dateMap.set(dayName, dateStr);
      }
    }
    
    return dateMap;
  }

  // Fetch appointment report from backend
  const fetchAppointmentReport = async (fromDate: string, toDate: string) => {
    try {
      console.log(`Fetching appointment report from ${fromDate} to ${toDate}`);
      
      const response = await fetch(
        `https://crmgate.nexabusinessgroup.com/api/DashBoard/AppointmentReport?fromDate=${fromDate}&toDate=${toDate}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AppointmentReportResponse = await response.json();
      console.log("Appointment report API response:", data);
      
      setAppointmentReport(data);
      
      // Transform the API data for the chart with actual dates
      transformAppointmentDataForChart(data, fromDate, toDate);
    } catch (err) {
      console.error("Error fetching appointment report:", err);
      generateFallbackAppointmentReport(fromDate, toDate);
    }
  };

  // Transform API data for the chart with actual dates
  const transformAppointmentDataForChart = (data: AppointmentReportResponse, fromDate: string, toDate: string) => {
    try {
      const chartData: ChartDataItem[] = [];
      
      // Get actual dates for each day of week
      const dateMap = getDatesForDaysOfWeek(fromDate, toDate);
      
      // Define the order of days
      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      // Process each day in order
      dayOrder.forEach(dayKey => {
        if (data[dayKey]) {
          const dayData = data[dayKey];
          const actualDate = dateMap.get(dayKey) || fromDate; // Fallback to fromDate if no specific date found
          const dateObj = new Date(actualDate);
          
          chartData.push({
            name: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Show date on X-axis
            day: dayKey,
            dayName: dayKey.charAt(0).toUpperCase() + dayKey.slice(1), // "Monday", "Tuesday", etc.
            actualDate: formatDateDisplay(dateObj), // Full date for tooltip
            Scheduled: dayData.scheduledAppointmentsCount || 0,
            Completed: dayData.completedAppointmentsCount || 0,
            Canceled: dayData.canceledAppointmentsCount || 0
          });
        }
      });
      
      console.log("Transformed chart data with dates:", chartData);
      setChartData(chartData);
    } catch (error) {
      console.error("Error transforming chart data:", error);
      setChartData([]);
    }
  };

  // Fetch most booked services from backend
  const fetchMostBookedServices = async () => {
    try {
      console.log("Fetching most booked services...");
      
      const response = await fetch(
        "https://crmgate.nexabusinessgroup.com/api/DashBoard/MostBookedServices"
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: any = await response.json();
      console.log("Most booked services API response:", data);
      
      let servicesData: MostBookedService[] = [];
      
      if (Array.isArray(data)) {
        servicesData = data;
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.topServices)) {
          servicesData = data.topServices;
        } else if (Array.isArray(data.data)) {
          servicesData = data.data;
        } else if (Array.isArray(data.services)) {
          servicesData = data.services;
        } else {
          const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
          if (arrayKey) {
            servicesData = data[arrayKey];
          }
        }
      }
      
      const palette = [
        'hsl(174, 72%, 40%)',
        'hsl(12, 76%, 61%)',
        'hsl(38, 92%, 50%)',
        'hsl(152, 69%, 40%)',
        'hsl(262, 60%, 55%)',
        'hsl(280, 65%, 60%)',
        'hsl(200, 75%, 50%)'
      ];
      
      const servicesWithColors = (servicesData || []).map((service: MostBookedService, index: number) => ({
        ...service,
        color: palette[index % palette.length]
      }));
      
      console.log("Processed services data:", servicesWithColors);
      setMostBookedServices(servicesWithColors);
      
      // Transform for pie chart
      transformServiceDataForChart(servicesWithColors);
    } catch (err) {
      console.error("Error fetching most booked services:", err);
      calculateMostBookedServicesFromLocal();
    }
  };

  // Transform service data for pie chart
  const transformServiceDataForChart = (services: MostBookedService[]) => {
    try {
      const chartData: ServiceChartData[] = services.map((service, index) => ({
        name: truncateServiceName(service.serviceName), // Truncated name for pie chart labels
        value: service.bookingCount || 0,
        color: service.color || '#8884d8',
        fullName: service.serviceName // Full name for the list below
      })).filter(item => item.value > 0);
      
      console.log("Transformed service data for chart:", chartData);
      setServiceData(chartData);
    } catch (error) {
      console.error("Error transforming service data:", error);
      setServiceData([]);
    }
  };

  // Fallback function for appointment report
  const generateFallbackAppointmentReport = (fromDate: string, toDate: string) => {
    try {
      let [start, end] = [new Date(fromDate), new Date(toDate)];
      
      if (start > end) {
        [start, end] = [end, start];
      }
      
      // Generate mock data for fallback
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const fallbackData: AppointmentReportResponse = {};
      
      daysOfWeek.forEach(day => {
        fallbackData[day] = {
          scheduledAppointmentsCount: Math.floor(Math.random() * 15),
          completedAppointmentsCount: Math.floor(Math.random() * 10),
          canceledAppointmentsCount: Math.floor(Math.random() * 3)
        };
      });
      
      setAppointmentReport(fallbackData);
      transformAppointmentDataForChart(fallbackData, fromDate, toDate);
      console.log("Generated fallback appointment report:", fallbackData);
    } catch (error) {
      console.error("Error generating fallback report:", error);
      setAppointmentReport(null);
      setChartData([]);
    }
  };

  // Fallback function for most booked services
  const calculateMostBookedServicesFromLocal = () => {
    try {
      const serviceCounts: Record<string, number> = {};
      
      appointments.forEach(a => {
        if (a.serviceName) {
          serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
        }
      });
      
      const palette = [
        'hsl(174, 72%, 40%)',
        'hsl(12, 76%, 61%)',
        'hsl(38, 92%, 50%)',
        'hsl(152, 69%, 40%)',
        'hsl(262, 60%, 55%)'
      ];
      
      const servicesData = Object.entries(serviceCounts)
        .map(([serviceName, bookingCount], i) => ({
          serviceId: `local-${i}`,
          serviceName,
          bookingCount,
          color: palette[i % palette.length]
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);
      
      console.log("Calculated local services data:", servicesData);
      setMostBookedServices(servicesData);
      transformServiceDataForChart(servicesData);
    } catch (error) {
      console.error("Error calculating local services:", error);
      setMostBookedServices([]);
      setServiceData([]);
    }
  };


  // Handle date change - automatically adjust to maintain 7-day range and fetch new data
  const handleDateChange = (type: 'from' | 'to', value: string) => {
    const newDate = new Date(value);
    let newDateRange = { ...dateRange };
    
    if (type === 'from') {
      // If From date changed, set To date to From + 6 days (total 7 days)
      const toDate = new Date(newDate);
      toDate.setDate(toDate.getDate() + 6);
      newDateRange = {
        fromDate: value,
        toDate: formatDate(toDate)
      };
    } else {
      // If To date changed, set From date to To - 6 days (total 7 days)
      const fromDate = new Date(newDate);
      fromDate.setDate(fromDate.getDate() - 6);
      newDateRange = {
        fromDate: formatDate(fromDate),
        toDate: value
      };
    }
    
    setDateRange(newDateRange);
    
    // Automatically fetch new data when date changes
    fetchAppointmentReport(newDateRange.fromDate, newDateRange.toDate);
  };

  // Format date for display in header
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting data fetch...");
        
        const [allAppointments, allPayments, allServices] = await Promise.all([
          appointmentService.getAll(),
          paymentsService.getAll(),
          medicalServicesService.getAll()
        ]);

        console.log("Fetched basic data:", {
          appointments: allAppointments.length,
          payments: allPayments.length,
          services: allServices.length
        });

        setAppointments(allAppointments);
        setPayments(allPayments);
        setServices(allServices);

        await Promise.all([
          fetchAppointmentReport(dateRange.fromDate, dateRange.toDate),
          fetchMostBookedServices()
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
        console.log("Data fetch completed");
      }
    };

    fetchData();
  }, []); // Removed dateRange from dependencies since we handle it separately

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // === KPI Stats ===
  const totalAppointmentsToday = appointments.filter(a => a.day === new Date().toISOString().split("T")[0]);
  const completedAppointmentsToday = totalAppointmentsToday.filter(a => a.status === "completed");
  const pendingAppointmentsToday = totalAppointmentsToday.filter(a => a.status !== "completed");

  const activePatients = Array.from(new Set(appointments.map(a => a.patientId))).length;

  const pendingPayments = payments.filter(p => p.status === "Requested" || p.status === "Checked");

  const expiredCards = payments.filter(p => {
    if (!p.card.expiredAt) return false;
    const expiredDate = new Date(p.card.expiredAt);
    return !isNaN(expiredDate.getTime()) && expiredDate < new Date();
  }).length;

  // === Today's Appointments ===
  const todaysAppointments = totalAppointmentsToday;

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening at your clinic today."
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Appointments Today"
          value={totalAppointmentsToday.length}
          subtitle={`${completedAppointmentsToday.length} completed, ${pendingAppointmentsToday.length} pending`}
          icon={Calendar}
          variant="primary"
        />
        <KPICard
          title="Active Patients"
          value={activePatients}
          subtitle={`${totalAppointmentsToday.length} appointments today`}
          icon={Users}
          variant="success"
        />
        <KPICard
          title="Pending Payments"
          value={pendingPayments.length}
          subtitle="Awaiting review"
          icon={Wallet}
          variant="warning"
        />
        <KPICard
          title="Expired Cards"
          value={expiredCards}
          subtitle="Need renewal"
          icon={CreditCard}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Appointment Overview Chart with Date Range */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appointment Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDisplayDate(dateRange.fromDate)} - {formatDisplayDate(dateRange.toDate)}
              </p>
            </div>
            
            {/* Date Range Selector - No Apply button needed */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="fromDate" className="text-sm font-medium text-muted-foreground">
                  From:
                </label>
                <input
                  id="fromDate"
                  type="date"
                  value={dateRange.fromDate}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="px-3 py-1.5 text-sm border border-input rounded-md bg-background w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="toDate" className="text-sm font-medium text-muted-foreground">
                  To:
                </label>
                <input
                  id="toDate"
                  type="date"
                  value={dateRange.toDate}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="px-3 py-1.5 text-sm border border-input rounded-md bg-background w-32"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart Legend - positioned above the chart */}
            <div className="flex items-center gap-4 text-sm mb-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Canceled</span>
              </div>
            </div>
            
            {/* Chart */}
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(210, 15%, 50%)" 
                    fontSize={12} 
                  />
                  <YAxis 
                    stroke="hsl(210, 15%, 50%)" 
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(200, 20%, 90%)',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} 
                    formatter={(value, name) => {
                      return [`${value} appointments`, name];
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]?.payload?.actualDate) {
                        return payload[0].payload.actualDate; // Show full date like "Sunday, Feb 1, 2026"
                      }
                      return label;
                    }}
                  />
                  <Bar 
                    dataKey="Scheduled" 
                    fill="#3b82f6" 
                    name="Scheduled" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                  <Bar 
                    dataKey="Completed" 
                    fill="#10b981" 
                    name="Completed" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                  <Bar 
                    dataKey="Canceled" 
                    fill="#ef4444" 
                    name="Canceled" 
                    radius={[4, 4, 0, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <p>No appointment data available for the selected period</p>
                <p className="text-sm mt-2">Try selecting a different date range</p>
                <p className="text-xs mt-1">Currently showing: {formatDisplayDate(dateRange.fromDate)} to {formatDisplayDate(dateRange.toDate)}</p>
              </div>
            )}
          </CardContent>
        </Card>

          {/* Most Booked Services */}
          <Card>
            <CardHeader>
              <CardTitle>Most Booked Services</CardTitle>
              <p className="text-sm text-muted-foreground">Overall most popular services</p>
            </CardHeader>
            <CardContent>
              {serviceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        // Removed the label prop to hide service names from pie chart
                        // label={(entry) => `${entry.name}\n${entry.value}`}
                        labelLine={false}
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const fullName = props.payload?.fullName || name;
                          return [`${value} bookings`, fullName];
                        }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(0, 0%, 100%)', 
                          border: '1px solid hsl(200, 20%, 90%)',
                          borderRadius: '8px',
                          maxWidth: '250px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {serviceData.map((service, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div 
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: service.color }} 
                          />
                          <span className="text-muted-foreground truncate">
                            {service.fullName}
                          </span>
                        </div>
                        <span className="font-medium flex-shrink-0 ml-2">{service.value} bookings</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <p>No service booking data available</p>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Appointments
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {todaysAppointments.length} appointments scheduled for today
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/appointments">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.slice(0, 5).map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <span className="text-sm font-semibold text-primary">{appointment.reservationTime}</span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.serviceName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={appointment.status} />
                      {appointment.status === 'scheduled' && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm" className="text-success hover:text-success hover:bg-success/10">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Payments
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {pendingPayments.length} payments awaiting review
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/payments">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingPayments.length > 0 ? (
              <div className="space-y-4">
                {pendingPayments.slice(0, 4).map((payment) => (
                  <div 
                    key={payment.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10">
                        <Wallet className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.requestedBy.fName} {payment.requestedBy.lName}</p>
                        <p className="text-sm text-muted-foreground">{payment.reference}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${payment.expectedAmount}</p>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending payments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;