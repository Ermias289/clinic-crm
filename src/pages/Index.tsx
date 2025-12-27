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
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { mockDashboardStats, mockAppointments, mockPayments } from "@/data/mockData";
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

const weeklyData = [
  { name: 'Mon', appointments: 24, completed: 22 },
  { name: 'Tue', appointments: 18, completed: 16 },
  { name: 'Wed', appointments: 32, completed: 28 },
  { name: 'Thu', appointments: 26, completed: 24 },
  { name: 'Fri', appointments: 20, completed: 18 },
  { name: 'Sat', appointments: 14, completed: 12 },
  { name: 'Sun', appointments: 0, completed: 0 },
];

const serviceData = [
  { name: 'General Checkup', value: 35, color: 'hsl(174, 72%, 40%)' },
  { name: 'Teeth Cleaning', value: 25, color: 'hsl(12, 76%, 61%)' },
  { name: 'Root Canal', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'Whitening', value: 15, color: 'hsl(152, 69%, 40%)' },
  { name: 'Other', value: 10, color: 'hsl(262, 60%, 55%)' },
];

const Index = () => {
  const stats = mockDashboardStats;
  const todaysAppointments = mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending' || p.status === 'under-review');

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
          value={stats.appointmentsToday.total}
          subtitle={`${stats.appointmentsToday.completed} completed, ${stats.appointmentsToday.pending} pending`}
          icon={Calendar}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Patients"
          value={stats.activePatients}
          subtitle={`${stats.newPatientsToday} new today`}
          icon={Users}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Pending Payments"
          value={stats.pendingPayments}
          subtitle="Awaiting approval"
          icon={Wallet}
          variant="warning"
        />
        <KPICard
          title="Expired Cards"
          value={stats.expiredCards}
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

        {/* Services Breakdown */}
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
              {serviceData.slice(0, 4).map((service) => (
                <div key={service.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-muted-foreground">{service.name}</span>
                  </div>
                  <span className="font-medium">{service.value}%</span>
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
                      <span className="text-sm font-semibold text-primary">{appointment.time}</span>
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
                      <p className="font-medium">{payment.patientName}</p>
                      <p className="text-sm text-muted-foreground">{payment.cardReference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount}</p>
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
