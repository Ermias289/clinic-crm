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
import { Eye, Search, Plus, Calendar, Clock, User, Stethoscope, Building } from "lucide-react";

import { AppointmentDTO, appointmentService } from "@/lib/api/appointments";
import { MedicalProfessional, medicalProfessionalsService } from "@/lib/api/medicalProfessionals";
import { MedicalService, medicalServicesService } from "@/lib/api/medicalServices";
import { BranchSettingDTO, branchService } from "@/lib/api/branches";
import { patientsService, Patient } from "@/lib/api/patients";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);
  
  // Add Appointment Dialog State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Error Dialog State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const [docs, svcs, brs, apts, pts] = await Promise.all([
        medicalProfessionalsService.getAll(),
        medicalServicesService.getAll(),
        branchService.getAll(),
        appointmentService.getAll(),
        patientsService.getAll(),
      ]);

      setDoctors(docs);
      setServices(svcs);
      setBranches(brs);
      setPatients(pts);

      console.log("Doctors:", docs);
      console.log("Services:", svcs);
      console.log("Branches:", brs);
      console.log("Appointments:", apts);
      console.log("Patients:", pts);

      const mappedAppointments = apts.map((apt) => {
        const doctor = docs.find(d => d.id.toString() === apt.medicalProfessionalId.toString());
        const service = svcs.find(s => s.id.toString() === apt.dentistryId.toString());
        const branch = brs.find(b => b.id.toString() === apt.branchId.toString());
        const patient = pts.find(p => p.id === apt.patientId);

        return {
          ...apt,
          doctorName: doctor ? `${doctor.fName} ${doctor.mName ?? ''} ${doctor.lName}`.trim() : "Unknown",
          serviceName: service?.name ?? "Unknown",
          branchName: branch?.name ?? "Unknown",
          patientName: patient ? `${patient.fName} ${patient.lName}` : `Patient #${apt.patientId}`,
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

  // Handle Add Appointment
  const handleAddAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !selectedServiceId || 
        !selectedBranchId || !appointmentDate || !appointmentTime) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const appointmentData = {
        patientId: parseInt(selectedPatientId),
        medicalProfessionalId: parseInt(selectedDoctorId),
        dentistryId: parseInt(selectedServiceId),
        branchId: parseInt(selectedBranchId),
        day: appointmentDate,
        reservationTime: appointmentTime,
      };

      console.log("Creating appointment with data:", appointmentData);
      
      const newAppointment = await appointmentService.create(appointmentData);
      
      // Refresh appointments list
      const updatedAppointments = await appointmentService.getAll();
      
      // Map the updated appointments with names
      const mappedAppointments = updatedAppointments.map((apt) => {
        const doctor = doctors.find(d => d.id.toString() === apt.medicalProfessionalId.toString());
        const service = services.find(s => s.id.toString() === apt.dentistryId.toString());
        const branch = branches.find(b => b.id.toString() === apt.branchId.toString());
        const patient = patients.find(p => p.id === apt.patientId);

        return {
          ...apt,
          doctorName: doctor ? `${doctor.fName} ${doctor.mName ?? ''} ${doctor.lName}`.trim() : "Unknown",
          serviceName: service?.name ?? "Unknown",
          branchName: branch?.name ?? "Unknown",
          patientName: patient ? `${patient.fName} ${patient.lName}` : `Patient #${apt.patientId}`,
        };
      });

      setAppointments(mappedAppointments);
      
      // Reset form
      setSelectedPatientId("");
      setSelectedDoctorId("");
      setSelectedServiceId("");
      setSelectedBranchId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setIsAddDialogOpen(false);
      
      alert("Appointment created successfully!");
    } catch (error: any) {
        console.error("Error creating appointment:", error);

        // Get backend message if available, otherwise fallback
        const msg = error.response?.data?.message || "Failed to create appointment";
        setErrorMessage(msg);
        setIsErrorDialogOpen(true);
      } finally {
      setIsLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the date input
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <DashboardLayout 
      title="Appointments" 
      subtitle="Manage and track all patient appointments"
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="dental">
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule New Appointment
              </DialogTitle>
              <DialogDescription>
                Book an appointment for a patient with a medical professional
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Patient Selection */}
              <div className="grid gap-2">
                <Label htmlFor="patient" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Patient *
                </Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.fName} {patient.lName} 
                        {patient.phoneNumber ? ` (${patient.phoneNumber})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Doctor Selection */}
              <div className="grid gap-2">
                <Label htmlFor="doctor" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Medical Professional *
                </Label>
                <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        Dr. {doctor.fName} {doctor.lName}
                        {doctor.specialty ? ` (${doctor.specialty})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Selection */}
              <div className="grid gap-2">
                <Label htmlFor="service">Service/Treatment *</Label>
                <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name}
                        {/* {service.price ? ` ($${service.price})` : ''} */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Branch Selection */}
              <div className="grid gap-2">
                <Label htmlFor="branch" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Branch *
                </Label>
                <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                        {/* {branch.location ? ` (${branch.location})` : ''} */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={getTodayDate()}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Preview */}
              {(selectedPatientId || selectedDoctorId || appointmentDate || appointmentTime) && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Appointment Preview:</h4>
                  <div className="text-sm space-y-1">
                    {selectedPatientId && (
                      <p>
                        <span className="text-muted-foreground">Patient: </span>
                        {patients.find(p => p.id.toString() === selectedPatientId)?.fName} {patients.find(p => p.id.toString() === selectedPatientId)?.lName}
                      </p>
                    )}
                    {selectedDoctorId && (
                      <p>
                        <span className="text-muted-foreground">Doctor: </span>
                        Dr. {doctors.find(d => d.id.toString() === selectedDoctorId)?.fName} {doctors.find(d => d.id.toString() === selectedDoctorId)?.lName}
                      </p>
                    )}
                    {appointmentDate && (
                      <p>
                        <span className="text-muted-foreground">Date: </span>
                        {new Date(appointmentDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    )}
                    {appointmentTime && (
                      <p>
                        <span className="text-muted-foreground">Time: </span>
                        {appointmentTime}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="dental" 
                onClick={handleAddAppointment}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Schedule Appointment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
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
                  Dr. {doc.fName} {doc.lName}
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
                    <td>
                      <div className="font-medium">{appointment.day}</div>
                      <div className="text-sm text-muted-foreground">{appointment.reservationTime}</div>
                    </td>
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

      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button variant="dental" onClick={() => setIsErrorDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default AppointmentsPage;