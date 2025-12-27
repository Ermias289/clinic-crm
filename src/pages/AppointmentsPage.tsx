import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";
import { mockAppointments, mockDoctors, mockServices, mockBranches } from "@/data/mockData";
import { Appointment } from "@/types/clinic";

const AppointmentsPage = () => {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === "all" || apt.doctorId === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <DashboardLayout 
      title="Appointments" 
      subtitle="Manage and track all patient appointments"
      actions={
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
              <DialogDescription>
                Schedule a new appointment for a patient
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">John Smith</SelectItem>
                    <SelectItem value="2">Maria Garcia</SelectItem>
                    <SelectItem value="3">David Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDoctors.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>
                        Dr. {doc.firstName} {doc.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" id="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button variant="dental" onClick={() => setIsCreateOpen(false)}>Create Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {mockDoctors.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>
                      Dr. {doc.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" className="w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Service</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {appointment.patientName}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        {appointment.doctorName}
                      </div>
                    </td>
                    <td>{appointment.serviceName}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.branchName}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button variant="ghost" size="icon-sm" className="text-success hover:text-success hover:bg-success/10">
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment information
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedAppointment.status} className="mt-1" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{selectedAppointment.date} at {selectedAppointment.time}</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium">{selectedAppointment.doctorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-medium">{selectedAppointment.serviceName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">{selectedAppointment.branchName}</p>
                  </div>
                </div>
              </div>
              
              {selectedAppointment.status === 'scheduled' && (
                <DialogFooter className="gap-2">
                  <Button variant="destructive" onClick={() => setSelectedAppointment(null)}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel Appointment
                  </Button>
                  <Button variant="success" onClick={() => setSelectedAppointment(null)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
