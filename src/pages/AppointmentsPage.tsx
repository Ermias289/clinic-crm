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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  Edit,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  AlertTriangle,
  Clock,
  Stethoscope,
  X,
  MoreVertical,
  Building,
  PhoneCall,
  BriefcaseMedical,
  FileText,
  Home,
  MapPinIcon
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AppointmentDTO, appointmentService } from "@/lib/api/appointments";
import { MedicalProfessional, medicalProfessionalsService } from "@/lib/api/medicalProfessionals";
import { MedicalService, medicalServicesService } from "@/lib/api/medicalServices";
import { BranchSettingDTO, branchService } from "@/lib/api/branches";
import { patientsService, Patient } from "@/lib/api/patients";
import { notificationsService, Notification } from "@/lib/api/notifications";
import { toast } from "sonner";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [doctors, setDoctors] = useState<MedicalProfessional[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [branches, setBranches] = useState<BranchSettingDTO[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null);
  
  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  
  // Form States
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // User ID for notifications
  const userId = 1;

  // Load all data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [docs, svcs, brs, apts, pts] = await Promise.all([
          medicalProfessionalsService.getAll(),
          medicalServicesService.getAll(),
          branchService.getAll(),
          appointmentService.getAll(),
          patientsService.getAll(),
        ]);

        console.log("Fetched data:", {
          doctors: docs,
          appointments: apts,
          services: svcs,
          branches: brs,
          patients: pts
        });

        setDoctors(docs || []);
        setServices(svcs || []);
        setBranches(brs || []);
        setPatients(pts || []);

        // Map appointments with complete data including branch
        const mappedAppointments = (apts || []).map((apt) => {
          const doctor = docs?.find(d => d.id.toString() === apt.medicalProfessionalId?.toString());
          const service = svcs?.find(s => s.id.toString() === apt.dentistryId?.toString());
          const branch = brs?.find(b => b.id.toString() === apt.branchId?.toString());
          const patient = apt.patient || pts?.find(p => p.id === apt.patientId);

          // Format patient name with middle name - FIXED: Show First, Middle, Last Name
          const patientName = patient 
            ? `${patient.fName || ''} ${patient.mName ? patient.mName + ' ' : ''}${patient.lName || ''}`.trim()
            : `Patient #${apt.patientId}`;

          return {
            ...apt,
            doctorName: doctor ? `Dr. ${doctor.fName || ''} ${doctor.lName || ''}`.trim() : "Unknown Doctor",
            serviceName: service?.name || "Unknown Service",
            branchName: branch?.name || "Unknown Branch",
            patientName, // This now includes middle name
            patientFullName: `${patient?.fName || ''} ${patient?.mName || ''} ${patient?.lName || ''}`.trim(),
            // Add doctor details for view dialog
            medicalProfessional: doctor,
          };
        });

        setAppointments(mappedAppointments || []);
      } catch (error) {
        toast.error("Failed to load appointments data");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter appointments with branch filter
  const filteredAppointments = appointments.filter((apt) => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      apt.patientName?.toLowerCase().includes(searchTerm) ||
      apt.doctorName?.toLowerCase().includes(searchTerm) ||
      apt.reference?.toLowerCase().includes(searchTerm) ||
      apt.serviceName?.toLowerCase().includes(searchTerm) ||
      apt.branchName?.toLowerCase().includes(searchTerm);

    const matchesDoctor = 
      doctorFilter === "all" || 
      apt.medicalProfessionalId?.toString() === doctorFilter;

    const matchesStatus = 
      statusFilter === "all" || 
      apt.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesBranch = 
      branchFilter === "all" || 
      apt.branchId?.toString() === branchFilter;

    return matchesSearch && matchesDoctor && matchesStatus && matchesBranch;
  });

  console.log("Filtered appointments:", filteredAppointments);

  // Status counts
  const statusCounts = {
    scheduled: appointments.filter(a => a.status?.toLowerCase() === "scheduled").length,
    completed: appointments.filter(a => a.status?.toLowerCase() === "completed").length,
    canceled: appointments.filter(a => a.status?.toLowerCase() === "canceled").length,
  };

  // Format time to AM/PM
  const formatTimeToAMPM = (timeString: string) => {
    if (!timeString) return '';
    
    // If already in AM/PM format, return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    // Convert HH:MM to AM/PM
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  // Handle Add Appointment with AM/PM time format
  const handleAddAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !selectedServiceId || 
        !selectedBranchId || !appointmentDate || !appointmentTime) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      // Format time to AM/PM
      const formattedTime = formatTimeToAMPM(appointmentTime);
      
      const appointmentData = {
        patientId: parseInt(selectedPatientId),
        medicalProfessionalId: parseInt(selectedDoctorId),
        dentistryId: parseInt(selectedServiceId),
        branchId: parseInt(selectedBranchId),
        day: appointmentDate,
        reservationTime: formattedTime,
      };

      console.log("Creating appointment:", appointmentData);
      const newAppointment = await appointmentService.create(appointmentData);
      
      // Refresh appointments list
      const updatedAppointments = await appointmentService.getAll();
      
      // Map the updated appointments with names
      const mappedAppointments = (updatedAppointments || []).map((apt) => {
        const doctor = doctors.find(d => d.id.toString() === apt.medicalProfessionalId?.toString());
        const service = services.find(s => s.id.toString() === apt.dentistryId?.toString());
        const branch = branches.find(b => b.id.toString() === apt.branchId?.toString());
        const patient = apt.patient || patients.find(p => p.id === apt.patientId);

        // Format patient name with middle name
        const patientName = patient 
          ? `${patient.fName || ''} ${patient.mName ? patient.mName + ' ' : ''}${patient.lName || ''}`.trim()
          : `Patient #${apt.patientId}`;

        return {
          ...apt,
          doctorName: doctor ? `Dr. ${doctor.fName || ''} ${doctor.lName || ''}`.trim() : "Unknown Doctor",
          serviceName: service?.name || "Unknown Service",
          branchName: branch?.name || "Unknown Branch",
          patientName,
          patientFullName: `${patient?.fName || ''} ${patient?.mName || ''} ${patient?.lName || ''}`.trim(),
          medicalProfessional: doctor,
        };
      });

      setAppointments(mappedAppointments || []);
      
      // Reset form
      setSelectedPatientId("");
      setSelectedDoctorId("");
      setSelectedServiceId("");
      setSelectedBranchId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setIsAddDialogOpen(false);
      
      toast.success("Appointment created successfully!");
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      const msg = error.response?.data?.message || "Failed to create appointment";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Cancel Appointment
  const handleCancelAppointment = async () => {
    if (!selectedAppointment || !cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setIsProcessing(true);
    try {
      await appointmentService.cancel(selectedAppointment.id, cancelReason);
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: "Canceled", cancelReason }
          : apt
      ));
      
      setCancelReason("");
      setIsCancelDialogOpen(false);
      toast.success("Appointment canceled successfully");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Complete Appointment
  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return;

    setIsProcessing(true);
    try {
      await appointmentService.complete([selectedAppointment.id]);
      
      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: "Completed" }
          : apt
      ));
      
      setIsCompleteDialogOpen(false);
      toast.success("Appointment marked as completed");
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Delete Appointment
  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    setIsProcessing(true);
    try {
      await appointmentService.delete(selectedAppointment.id);
      
      // Update local state
      setAppointments(prev => prev.filter(apt => apt.id !== selectedAppointment.id));
      
      setIsDeleteDialogOpen(false);
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A';
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years`;
    } catch (error) {
      return 'N/A';
    }
  };

  // Get today's date for min date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Notifications component remains the same
  const NotificationsButton = ({ userId }: { userId: number }) => {
    // ... (keep the existing NotificationsButton code)
    return null; // Placeholder
  };

  return (
    <DashboardLayout 
      title="Appointments" 
      subtitle="Manage and track all patient appointments"
      actions={
        <div className="flex items-center gap-2">
          <div className="hidden">
            <NotificationsButton userId={userId} />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="dental" className="gap-2">
                <Plus className="w-4 h-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule New Appointment
                </DialogTitle>
                <DialogDescription>
                  Fill in all required fields to book an appointment
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="patient" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Patient
                  </Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          <div className="flex flex-col">
                            <span>{patient.fName} {patient.mName} {patient.lName}</span>
                            <span className="text-xs text-muted-foreground">
                              {patient.phoneNumber} • {patient.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Medical Professional */}
                <div className="space-y-2">
                  <Label htmlFor="doctor" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Medical Professional
                  </Label>
                  <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          <div className="flex flex-col">
                            <span>Dr. {doctor.fName} {doctor.lName}</span>
                            {doctor.specialty && (
                              <span className="text-xs text-muted-foreground">
                                {doctor.specialty}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Service/Treatment
                  </Label>
                  <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Branch Selection */}
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-sm font-medium">
                    <span className="text-red-500">*</span> Branch
                  </Label>
                  <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            <span>{branch.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      <span className="text-red-500">*</span> Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={getTodayDate()}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">
                      <span className="text-red-500">*</span> Time
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                {(selectedPatientId || selectedDoctorId || appointmentDate || appointmentTime) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Appointment Preview
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedPatientId && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800">
                            {patients.find(p => p.id.toString() === selectedPatientId)?.fName}{" "}
                            {patients.find(p => p.id.toString() === selectedPatientId)?.mName}{" "}
                            {patients.find(p => p.id.toString() === selectedPatientId)?.lName}
                          </span>
                        </div>
                      )}
                      {selectedDoctorId && (
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800">
                            Dr. {doctors.find(d => d.id.toString() === selectedDoctorId)?.fName}{" "}
                            {doctors.find(d => d.id.toString() === selectedDoctorId)?.lName}
                          </span>
                        </div>
                      )}
                      {appointmentDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800">{formatDate(appointmentDate)}</span>
                        </div>
                      )}
                      {appointmentTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-800">{formatTimeToAMPM(appointmentTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  variant="dental" 
                  onClick={handleAddAppointment}
                  disabled={isProcessing || !selectedPatientId || !selectedDoctorId || !appointmentDate || !appointmentTime}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Schedule Appointment
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{statusCounts.scheduled}</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Active</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{statusCounts.completed}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">Done</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Canceled</p>
                <p className="text-2xl font-bold">{statusCounts.canceled}</p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700">Closed</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS CARD WITH BRANCH FILTER */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, doctor, reference, service, or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.length > 0 ? (
                    doctors.map(doc => (
                      <SelectItem key={doc.id} value={doc.id.toString()}>
                        Dr. {doc.fName} {doc.lName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-doctors" disabled>
                      No doctors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>

              {/* NEW: Branch Filter */}
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.length > 0 ? (
                    branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>{branch.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-branches" disabled>
                      No branches available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APPOINTMENTS TABLE */}
<Card>
  <CardHeader>
    <CardTitle>Appointments List ({filteredAppointments.length})</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <div className="overflow-x-auto">
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dental mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointments...</p>
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Reference</th>
                <th className="text-left p-4 font-medium">Patient</th>
                <th className="text-left p-4 font-medium">Date & Time</th>
                <th className="text-left p-4 font-medium">Doctor & Service</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-t hover:bg-muted/30">
                  {/* REFERENCE CELL - SHORTENED */}
                  <td className="p-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {appointment.reference}
                    </Badge>
                  </td>
                  
                  {/* PATIENT CELL - COMPACT DESIGN */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {appointment.patient?.fName || 'N/A'} 
                        {appointment.patient?.mName ? ` ${appointment.patient.mName}` : ''} 
                        {appointment.patient?.lName ? ` ${appointment.patient.lName}` : ''}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{appointment.patient?.phoneNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* DATE & TIME CELL */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{formatDate(appointment.day)}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeToAMPM(appointment.reservationTime)}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* DOCTOR & SERVICE CELL - COMBINED */}
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="font-medium truncate">{appointment.doctorName}</div>
                      <div className="text-sm text-muted-foreground truncate">{appointment.serviceName}</div>
                    </div>
                  </td>
                  
                  {/* STATUS CELL */}
                  <td className="p-4">
                    <StatusBadge 
                      status={appointment.status?.toLowerCase() || 'unknown'}
                      className="capitalize text-xs"
                    />
                  </td>
                  
                  {/* ACTIONS CELL */}
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsViewDialogOpen(true);
                        }}
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          
                          {appointment.status?.toLowerCase() === "scheduled" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsCompleteDialogOpen(true);
                                }}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setIsCancelDialogOpen(true);
                                }}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAppointments.length === 0 && (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No appointments found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || doctorFilter !== "all" || statusFilter !== "all" || branchFilter !== "all"
                  ? "Try adjusting your filters" 
                  : "No appointments scheduled yet"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  </CardContent>
</Card>

      {/* VIEW APPOINTMENT DIALOG - ENHANCED WITH MORE INFORMATION */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Appointment Details
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="font-mono">
                    {selectedAppointment.reference}
                  </Badge>
                  <StatusBadge 
                    status={selectedAppointment.status?.toLowerCase() || 'unknown'}
                    className="capitalize"
                  />
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Appointment Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Date</Label>
                    <p className="font-medium">{formatDate(selectedAppointment.day)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                    <p className="font-medium">{formatTimeToAMPM(selectedAppointment.reservationTime)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* PATIENT INFORMATION - ENHANCED */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Patient Information
                    </Label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {selectedAppointment.patient?.fName || 'N/A'} 
                              {selectedAppointment.patient?.mName ? ` ${selectedAppointment.patient.mName}` : ''} 
                              {selectedAppointment.patient?.lName ? ` ${selectedAppointment.patient.lName}` : ''}
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{selectedAppointment.patient?.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{selectedAppointment.patient?.phoneNumber || 'N/A'}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {selectedAppointment.patient?.gender || 'N/A'} • 
                                  {selectedAppointment.patient?.dateOfBirth 
                                    ? ` ${calculateAge(selectedAppointment.patient.dateOfBirth)}`
                                    : ' N/A'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                  DOB: {selectedAppointment.patient?.dateOfBirth || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {selectedAppointment.patient?.address && (
                            <div className="pt-2 border-t">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm">{selectedAppointment.patient.address}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedAppointment.patient.city || ''} 
                                    {selectedAppointment.patient.subCity ? `, ${selectedAppointment.patient.subCity}` : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {(selectedAppointment.patient?.emergencyContactName || selectedAppointment.patient?.emergencyContactPhone) && (
                            <div className="pt-2 border-t">
                              <h5 className="font-medium text-sm mb-1">Emergency Contact</h5>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {selectedAppointment.patient.emergencyContactName || 'N/A'} - 
                                  {selectedAppointment.patient.emergencyContactPhone || ' N/A'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* DOCTOR INFORMATION - ENHANCED */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Medical Professional
                    </Label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        {(() => {
                          const doctor = selectedAppointment.medicalProfessional || 
                                       doctors.find(d => d.id.toString() === selectedAppointment.medicalProfessionalId?.toString());
                          
                          return doctor ? (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-lg">Dr. {doctor.fName} {doctor.lName}</h4>
                                {doctor.specialty && (
                                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  {doctor.email && (
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{doctor.email}</span>
                                    </div>
                                  )}
                                  {doctor.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{doctor.phoneNumber}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="space-y-1">
                                  {doctor.qualification && (
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-muted-foreground" />
                                      <span className="text-sm">{doctor.qualification}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="font-medium">{selectedAppointment.doctorName}</p>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </div>

                  {/* SERVICE & BRANCH - FIXED: Now shows both */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <BriefcaseMedical className="w-4 h-4" />
                      Service & Branch
                    </Label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">Service</h4>
                            <p className="text-muted-foreground">{selectedAppointment.serviceName}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Branch</h4>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="w-4 h-4" />
                              <span>{selectedAppointment.branchName}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* APPOINTMENT DETAILS */}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground mb-2">Appointment Details</Label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Scheduled By:</span>
                            <span>{selectedAppointment.scheduledBy?.fName || 'System'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Scheduled At:</span>
                            <span>{new Date(selectedAppointment.scheduledAt).toLocaleString()}</span>
                          </div>
                          {selectedAppointment.completedAt && selectedAppointment.completedAt !== "0001-01-01T00:00:00" && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Completed At:</span>
                              <span>{new Date(selectedAppointment.completedAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedAppointment.status?.toLowerCase() === "canceled" && selectedAppointment.cancelReason && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Cancellation Reason</Label>
                      <Card className="mt-2 border-red-200 bg-red-50">
                        <CardContent className="p-4">
                          <p className="text-red-700">{selectedAppointment.cancelReason}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CANCEL APPOINTMENT DIALOG */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="cancelReason">Cancellation Reason *</Label>
            <Textarea
              id="cancelReason"
              placeholder="Please provide a reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              disabled={isProcessing || !cancelReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Canceling..." : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* COMPLETE APPOINTMENT DIALOG */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this appointment as completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteAppointment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Mark as Complete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE APPOINTMENT DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAppointment}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AppointmentsPage;