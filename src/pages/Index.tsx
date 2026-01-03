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
import { appointmentService, medicalServicesService, paymentsService, AppointmentDTO, Payment, MedicalService } from "@/lib/api";

const Index = () => {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allAppointments, allPayments, allServices] = await Promise.all([
          appointmentService.getAll(),
          paymentsService.getAll(),
          medicalServicesService.getAll()
        ]);

        setAppointments(allAppointments);
        setPayments(allPayments);
        setServices(allServices);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

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

  // === Weekly Overview ===
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const weeklyData = weekDates.map((date, i) => {
    const dayAppointments = appointments.filter(a => a.day === date);
    return {
      name: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
      appointments: dayAppointments.length,
      completed: dayAppointments.filter(a => a.status === "completed").length,
    };
  });

// Popular Services
  const serviceCounts: Record<string, number> = {};
  services.forEach(s => serviceCounts[s.name] = 0); // initialize all services

  appointments.forEach(a => {
    if (a.serviceName) {
      serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
    } else {
      serviceCounts["Other"] = (serviceCounts["Other"] || 0) + 1;
    }
  });

  const palette = ['hsl(174, 72%, 40%)','hsl(12, 76%, 61%)','hsl(38, 92%, 50%)','hsl(152, 69%, 40%)','hsl(262, 60%, 55%)'];

  const serviceData = Object.entries(serviceCounts)
    .map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // === Today's Appointments ===
  const todaysAppointments = totalAppointmentsToday;

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening at your clinic today."
      actions={
        <Button variant="dental">
          <Plus className="w-4 h-4" />
          New Appointment
        </Button>
      }
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
        {/* Weekly Overview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Appointment trends this week</p>
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
                <XAxis dataKey="name" stroke="hsl(210, 15%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(210, 15%, 50%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(200, 20%, 90%)',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="hsl(174, 72%, 40%)" 
                  fillOpacity={1} 
                  fill="url(#colorAppointments)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(152, 69%, 40%)" 
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <p className="text-sm text-muted-foreground">This month's bookings</p>
          </CardHeader>
          <CardContent>
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
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {serviceData.map((service) => (
                <div key={service.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: service.color }} />
                    <span className="text-muted-foreground">{service.name}</span>
                  </div>
                  <span className="font-medium">{service.value}</span>
                </div>
              ))}
            </div>
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
                {todaysAppointments.length} appointments scheduled
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/appointments">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
