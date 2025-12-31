import { useState, useEffect } from "react";
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
import { Eye, Search } from "lucide-react";

import { AppointmentDTO, appointmentService } from "@/lib/api/appointments";
import { MedicalProfessional, medicalProfessionalsService } from "@/lib/api/medicalProfessionals";
import { MedicalService, medicalServicesService } from "@/lib/api/medicalServices";
import { BranchSettingDTO, branchService } from "@/lib/api/branches";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [docs, svcs, brs, apts] = await Promise.all([
        medicalProfessionalsService.getAll(),
        medicalServicesService.getAll(),
        branchService.getAll(),
        appointmentService.getAll(),
      ]);

      setDoctors(docs);
      setServices(svcs);
      setBranches(brs);

   
      const mappedAppointments = apts.map((apt) => {
        const doctor = docs.find(d => d.id === apt.medicalProfessionalId);
        const service = svcs.find(s => s.id === apt.dentistryId);
        const branch = brs.find(b => b.id === apt.branchId);

        return {
          ...apt,
          doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : "Unknown",
          serviceName: service?.name ?? "Unknown",
          branchName: branch?.name ?? "Unknown",
          patientName: `Patient #${apt.patientId}`, // replace if you have patient API
        };
      });

      setAppointments(mappedAppointments);
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDoctor =
      doctorFilter === "all" || apt.medicalProfessionalId?.toString() === doctorFilter;

    return matchesSearch && matchesDoctor;
  });

  return (
    <DashboardLayout 
      title="Appointments" 
      subtitle="Manage and track all patient appointments"
    >
      {/* FILTERS */}
      <Card className="mb-6">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={doctorFilter} onValueChange={setDoctorFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map(doc => (
                <SelectItem key={doc.id} value={doc.id.toString()}>
                  Dr. {doc.firstName} {doc.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TABLE */}
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
                    <td>{appointment.day} {appointment.reservationTime}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.serviceName}</td>
                    <td>{appointment.branchName}</td>
                    <td>
                      <StatusBadge status={appointment.status.toLowerCase()} />
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AppointmentsPage;
