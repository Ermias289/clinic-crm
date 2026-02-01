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
  AlertCircle,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  AreaChart, 
  Area, 
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
interface AppointmentReportItem {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
}

interface MostBookedService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  color?: string;
}

interface AppointmentReportResponse {
  [key: string]: AppointmentReportItem[] | string;
}

const Index = () => {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentReport, setAppointmentReport] = useState<AppointmentReportItem[]>([]);
  const [mostBookedServices, setMostBookedServices] = useState<MostBookedService[]>([]);
  const [dateRange, setDateRange] = useState<{ fromDate: string; toDate: string; label: string }>({
    fromDate: getLast7Days(),
    toDate: getTodayDate(),
    label: "week"
  });

  // Helper functions for dates
  function getFirstDayOfMonth(): string {
    const date = new Date();
    date.setDate(1);
    return formatDate(date);
  }

  function getFirstDayOfYear(): string {
    const date = new Date();
    date.setMonth(0, 1);
    return formatDate(date);
  }

  function getTodayDate(): string {
    return formatDate(new Date());
  }

  function getLast7Days(): string {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return formatDate(date);
  }

  function getLast30Days(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return formatDate(date);
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
      
      const data: any = await response.json();
      console.log("Appointment report API response:", data);
      
      // Handle different response formats
      let reportData: AppointmentReportItem[] = [];
      
      if (Array.isArray(data)) {
        // If response is already an array
        reportData = data;
      } else if (data && typeof data === 'object') {
        // If response is an object with data property
        if (Array.isArray(data.data)) {
          reportData = data.data;
        } else if (Array.isArray(data.appointments)) {
          reportData = data.appointments;
        } else if (Array.isArray(data.results)) {
          reportData = data.results;
        } else {
          // Convert object to array if needed
          reportData = Object.values(data).filter(item => 
            item && typeof item === 'object' && 'date' in item
          ) as AppointmentReportItem[];
        }
      }
      
      console.log("Processed appointment report data:", reportData);
      setAppointmentReport(reportData || []);
    } catch (err) {
      console.error("Error fetching appointment report:", err);
      // Fallback to local data if API fails
      generateFallbackAppointmentReport(fromDate, toDate);
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
      
      // Handle different response formats
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
          // Try to find array in object
          const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
          if (arrayKey) {
            servicesData = data[arrayKey];
          }
        }
      }
      
      // Add colors to the services for the pie chart
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
    } catch (err) {
      console.error("Error fetching most booked services:", err);
      // Fallback to local calculation if API fails
      calculateMostBookedServicesFromLocal();
    }
  };

  // Fallback function for appointment report
  const generateFallbackAppointmentReport = (fromDate: string, toDate: string) => {
    try {
      let [start, end] = [new Date(fromDate), new Date(toDate)];
      const days: AppointmentReportItem[] = [];

      // Make sure start date is before end date
      if (start > end) {
        [start, end] = [end, start];
      }
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = formatDate(d);
        const dayAppointments = appointments.filter(a => a.day === dateStr);
        
        days.push({
          date: dateStr,
          totalAppointments: dayAppointments.length,
          completedAppointments: dayAppointments.filter(a => a.status === "completed").length
        });
      }
      
      console.log("Generated fallback appointment report:", days);
      setAppointmentReport(days);
    } catch (error) {
      console.error("Error generating fallback report:", error);
      setAppointmentReport([]);
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
      
      const serviceData = Object.entries(serviceCounts)
        .map(([serviceName, bookingCount], i) => ({
          serviceId: `local-${i}`,
          serviceName,
          bookingCount,
          color: palette[i % palette.length]
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);
      
      console.log("Calculated local services data:", serviceData);
      setMostBookedServices(serviceData);
    } catch (error) {
      console.error("Error calculating local services:", error);
      setMostBookedServices([]);
    }
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

        // Fetch dashboard-specific data
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
  }, [dateRange]);

  // Update date range handler
  const handleDateRangeChange = (range: 'week' | 'month' | 'year' | '30days') => {
    let fromDate: string;
    let label = range;
    
    switch (range) {
      case 'week':
        fromDate = getLast7Days();
        break;
      case 'month':
        fromDate = getFirstDayOfMonth();
        break;
      case 'year':
        fromDate = getFirstDayOfYear();
        break;
      case '30days':
        fromDate = getLast30Days();
        label = '30days';
        break;
      default:
        fromDate = getLast7Days();
        label = 'week';
    }
    
    setDateRange({
      fromDate,
      toDate: getTodayDate(),
      label
    });
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

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

  // Format appointment report data for the chart - with safety checks
  const weeklyData = Array.isArray(appointmentReport) 
    ? appointmentReport.map(item => {
        const date = new Date(item.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          name: dayName,
          date: item.date,
          appointments: item.totalAppointments || 0,
          completed: item.completedAppointments || 0,
          fullDate: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  console.log("Weekly data for chart:", weeklyData);

  // Format most booked services for the pie chart - with safety checks
  const serviceData = Array.isArray(mostBookedServices)
    ? mostBookedServices.map(service => ({
        name: service.serviceName || 'Unknown',
        value: service.bookingCount || 0,
        color: service.color
      })).filter(item => item.value > 0) // Only show services with bookings
    : [];

  console.log("Service data for pie chart:", serviceData);

  // === Today's Appointments ===
  const todaysAppointments = totalAppointmentsToday;

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening at your clinic today."
    >
      {/* Date Range Selector */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          <Button 
            variant={dateRange.label === 'week' ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleDateRangeChange('week')}
          >
            Last 7 Days
          </Button>
          <Button 
            variant={dateRange.label === '30days' ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleDateRangeChange('30days')}
          >
            Last 30 Days
          </Button>
          <Button 
            variant={dateRange.label === 'month' ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleDateRangeChange('month')}
          >
            This Month
          </Button>
          <Button 
            variant={dateRange.label === 'year' ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleDateRangeChange('year')}
          >
            This Year
          </Button>
          <div className="text-xs text-muted-foreground px-2">
            {formatDisplayDate(dateRange.fromDate)} - {formatDisplayDate(dateRange.toDate)}
          </div>
        </div>
      </div>

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
        {/* Weekly Overview - using backend data */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appointment Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {dateRange.label === 'week' && 'Last 7 days '}
                {dateRange.label === '30days' && 'Last 30 days '}
                {dateRange.label === 'month' && 'This month '}
                {dateRange.label === 'year' && 'This year '}
                {formatDisplayDate(dateRange.fromDate)} - {formatDisplayDate(dateRange.toDate)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Completed</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
                  <XAxis 
                    dataKey="fullDate" 
                    stroke="hsl(210, 15%, 50%)" 
                    fontSize={12} 
                  />
                  <YAxis stroke="hsl(210, 15%, 50%)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(200, 20%, 90%)',
                      borderRadius: '8px'
                    }} 
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]?.payload?.date) {
                        return new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                      }
                      return label;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="hsl(174, 72%, 40%)" 
                    fillOpacity={1} 
                    fill="url(#colorAppointments)" 
                    strokeWidth={2}
                    name="Scheduled Appointments"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="hsl(152, 69%, 40%)" 
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                    strokeWidth={2}
                    name="Completed Appointments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <p>No appointment data available for the selected period</p>
                <p className="text-sm mt-2">Try selecting a different date range</p>
                <p className="text-xs mt-1">Currently showing: {formatDisplayDate(dateRange.fromDate)} to {formatDisplayDate(dateRange.toDate)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Booked Services -  using backend data */}
        <Card>
          <CardHeader>
            <CardTitle>Most Booked Services</CardTitle>
            <p className="text-sm text-muted-foreground">
              {dateRange.label === 'week' && 'Last 7 days'}
              {dateRange.label === '30days' && 'Last 30 days'}
              {dateRange.label === 'month' && 'This month'}
              {dateRange.label === 'year' && 'This year'}
            </p>
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
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {serviceData.map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: service.color }} 
                        />
                        <span className="text-muted-foreground truncate max-w-[120px]">
                          {service.name}
                        </span>
                      </div>
                      <span className="font-medium">{service.value} bookings</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <p>No service booking data available</p>
                <p className="text-sm mt-2">
                  {dateRange.label === 'week' && 'Last 7 days'}
                  {dateRange.label === '30days' && 'Last 30 days'}
                  {dateRange.label === 'month' && 'This month'}
                  {dateRange.label === 'year' && 'This year'}
                </p>
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
                {todaysAppointments.length} appointments scheduled for {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
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