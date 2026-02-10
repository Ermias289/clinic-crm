import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import TimeSlotSelector from "./TimeSlotSelector.tsx";

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
  MapPinIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AppointmentDTO, appointmentService, FreeSlotDTO } from "@/lib/api/appointments";
import { MedicalProfessional, medicalProfessionalsService } from "@/lib/api/medicalProfessionals";
import { MedicalService, medicalServicesService } from "@/lib/api/medicalServices";
import { BranchSettingDTO, branchService } from "@/lib/api/branches";
import { patientsService, Patient } from "@/lib/api/patients";
import { notificationsService, Notification } from "@/lib/api/notifications";
import { doctorScheduleService, DoctorScheduleDTO } from "@/lib/api/doctorSchedules";
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

  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);

  // Doctor availability states
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorScheduleDTO[]>([]);
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  // Custom Date Picker states
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch doctor schedules when doctor is selected
  useEffect(() => {
    const fetchDoctorSchedules = async () => {
      if (selectedDoctorId) {
        try {
          const schedules = await doctorScheduleService.getByDoctorId(parseInt(selectedDoctorId));
          setDoctorSchedules(schedules || []);
          
          // Extract unique available days from schedules
          const uniqueDays = Array.from(
            new Set(schedules.map(schedule => schedule.weekDay))
          );
          setAvailableDays(uniqueDays);
          
          
          // Reset date if current selection is not available
          if (appointmentDate) {
            const selectedDay = new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' });
            if (uniqueDays.length > 0 && !uniqueDays.includes(selectedDay)) {
              setAppointmentDate(""); // Clear date if not available
              toast.info("Selected date is not available for this doctor. Please choose another day.");
            }
          }
        } catch (error) {
          setDoctorSchedules([]);
          setAvailableDays([]);
        }
      } else {
        setDoctorSchedules([]);
        setAvailableDays([]);
      }
    };
    
    fetchDoctorSchedules();
  }, [selectedDoctorId]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowCustomDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  // Get day name from date
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // FIXED: Check if a date is selectable based on doctor's available days
  const isDateSelectable = (date: Date) => {
    if (!selectedDoctorId || availableDays.length === 0) return false;
    
    // Get today's date at midnight in local time
    const today = new Date();
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Get the date to check at midnight in local time
    const checkDateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Check if date is before today (not including today)
    if (checkDateAtMidnight < todayAtMidnight) {
      return false;
    }
    
    const dayName = getDayName(date);
    return availableDays.includes(dayName);
  };

  // FIXED: Handle custom date selection
  const handleCustomDateSelect = (date: Date) => {
    // Get today's date at midnight in local time
    const today = new Date();
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Get selected date at midnight in local time
    const selectedDateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Check if selected date is before today
    if (selectedDateAtMidnight < todayAtMidnight) {
      toast.error("Past dates are not selectable");
      return;
    }
    
    if (isDateSelectable(date)) {
      // Format date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      setAppointmentDate(dateString);
      setShowCustomDatePicker(false);
    } else {
      toast.error("This day is not available for the selected doctor");
    }
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Convert short day name to full day name
  const getFullDayName = (shortDay: string) => {
    const dayMap: { [key: string]: string } = {
      'Sun': 'Sunday',
      'Mon': 'Monday',
      'Tue': 'Tuesday',
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday'
    };
    return dayMap[shortDay] || shortDay;
  };

  // FIXED: Render custom date picker
  const renderCustomDatePicker = () => {
    const today = new Date();
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const days = [];
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateAtMidnight = new Date(year, month, day);
      
      const dayName = getDayName(date);
      const isAvailable = isDateSelectable(date);
      const isToday = dateAtMidnight.getTime() === todayAtMidnight.getTime();
      
      // Check if this date is selected
      const yearStr = date.getFullYear();
      const monthStr = String(date.getMonth() + 1).padStart(2, '0');
      const dayStr = String(date.getDate()).padStart(2, '0');
      const dateString = `${yearStr}-${monthStr}-${dayStr}`;
      const isSelected = appointmentDate === dateString;
      
      const isPast = dateAtMidnight < todayAtMidnight;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleCustomDateSelect(date)}
          disabled={!isAvailable}
          className={`
            h-10 w-10 flex items-center justify-center rounded-full text-sm
            transition-colors
            ${isSelected ? 'bg-dental text-white' : ''}
            ${!isSelected && isToday ? 'border-2 border-dental text-dental' : ''}
            ${!isSelected && !isToday && isAvailable ? 'hover:bg-gray-100 text-gray-900' : ''}
            ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400 opacity-50'}
            ${isPast ? 'line-through' : ''}
          `}
          title={isPast ? "Past dates are not selectable" : isAvailable ? "" : "This day is not available for the selected doctor"}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div ref={datePickerRef} className="absolute top-full left-0 mt-2 z-50 bg-white border rounded-lg shadow-lg p-4 w-64">
        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold text-sm">
            {monthNames[month]} {year}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Day names - Highlight available days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => {
            const fullDayName = getFullDayName(day);
            const isAvailableDay = availableDays.includes(fullDayName);
            
            return (
              <div 
                key={day} 
                className={`
                  text-center text-xs font-medium h-8 flex items-center justify-center
                  ${isAvailableDay ? 'text-blue-600 font-bold' : 'text-gray-500'}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-3 border-t text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-dental"></div>
            <span className="text-gray-600">Selected date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-dental rounded-full"></div>
            <span className="text-gray-600">Today</span>
          </div>
          {availableDays.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-blue-600 font-medium">Available day</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle Add Appointment
  const handleAddAppointment = async () => {
    if (!selectedPatientId || !selectedDoctorId || !selectedServiceId || 
        !selectedBranchId || !appointmentDate || !appointmentTime) {
      toast.error("Please fill all required fields");
      return;
    }

    // Check if selected date is available for the doctor
    const selectedDate = new Date(appointmentDate);
    if (!isDateSelectable(selectedDate)) {
      const today = new Date();
      const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const selectedDateAtMidnight = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      if (selectedDateAtMidnight < todayAtMidnight) {
        toast.error("Past dates are not selectable. Please choose a future date.");
      } else {
        toast.error("Selected date is not available for this doctor. Please choose another day.");
      }
      return;
    }

    setIsProcessing(true);
    try {
      // Convert IDs to numbers
      const patientId = parseInt(selectedPatientId);
      const medicalProfessionalId = parseInt(selectedDoctorId);
      const dentistryId = parseInt(selectedServiceId);
      const branchId = parseInt(selectedBranchId);
      
      
      // Check if any ID is NaN
      if (isNaN(patientId) || isNaN(medicalProfessionalId) || 
          isNaN(dentistryId) || isNaN(branchId)) {
        throw new Error("Invalid ID detected. Please reselect all fields.");
      }
      
      const appointmentData = {
        patientId: patientId,
        medicalProfessionalId: medicalProfessionalId,
        dentistryId: dentistryId,
        branchId: branchId,
        day: appointmentDate,
        reservationTime: appointmentTime, // Use as-is (24-hour format)
      };

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
      setAvailableDays([]);
      setDoctorSchedules([]);
      setShowCustomDatePicker(false);
      setIsAddDialogOpen(false);
      
      toast.success("Appointment created successfully!");
    } catch (error: any) {
      
      let errorMessage = "Failed to create appointment";
      
      if (error.response) {
        const { data, status } = error.response;
        
        
        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && typeof data === 'string') {
          errorMessage = data;
        } else if (data && data.errors) {
          const validationErrors = Object.values(data.errors).flat().join(', ');
          errorMessage = `Validation errors: ${validationErrors}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Check your network connection.";
      } else {
        errorMessage = error.message || "Failed to create appointment";
      }
      
      toast.error(errorMessage);
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
                          <div className="flex flex-col text-left">
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
                  <Select 
                    value={selectedDoctorId} 
                    onValueChange={(value) => {
                      setSelectedDoctorId(value);
                      // Reset date when doctor changes
                      setAppointmentDate("");
                      setShowCustomDatePicker(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          <div className="flex flex-col text-left">
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

                {/* Date and Time with Custom Date Picker */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="date" className="text-sm font-medium">
                      <span className="text-red-500">*</span> Date
                    </Label>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                        onClick={() => {
                          if (selectedDoctorId) {
                            setShowCustomDatePicker(!showCustomDatePicker);
                          } else {
                            toast.error("Please select a doctor first");
                          }
                        }}
                        disabled={!selectedDoctorId}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {appointmentDate ? formatDate(appointmentDate) : "Select a date"}
                      </Button>
                      
                      {showCustomDatePicker && selectedDoctorId && renderCustomDatePicker()}
                    </div>
                    
                    {/* Info message */}
                    {selectedDoctorId && availableDays.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Only {availableDays.join(", ")} are available
                      </p>
                    )}
                    
                    {/* Warning if doctor has no schedule */}
                    {selectedDoctorId && availableDays.length === 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center gap-2 text-yellow-800 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>No schedule set for this doctor</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">
                      <span className="text-red-500">*</span> Time
                    </Label>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-10"
                        disabled={!selectedDoctorId || !selectedBranchId || !appointmentDate}
                        onClick={() => setIsTimeSlotDialogOpen(true)} 
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {appointmentTime ? formatTimeToAMPM(appointmentTime) : "Select time slot"}
                      </Button>
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
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    // Reset doctor availability data
                    setAvailableDays([]);
                    setDoctorSchedules([]);
                    setShowCustomDatePicker(false);
                  }}
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


      {/* TIME SLOT SELECTOR DIALOG - SEPARATE DIALOG */}
      <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
        <DialogContent 
            className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Available Time Slot
            </DialogTitle>
            <DialogDescription>
              Available time slots for {appointmentDate ? formatDate(appointmentDate) : 'selected date'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDoctorId && selectedBranchId && appointmentDate ? (
            <TimeSlotSelector
              doctorId={selectedDoctorId}
              branchId={selectedBranchId}
              date={appointmentDate}
              onTimeSelect={(time) => {
                setAppointmentTime(time);
                setIsTimeSlotDialogOpen(false); // Close dialog after selection
              }}
              selectedTime={appointmentTime}
            />
          ) : (
            <div className="py-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Select doctor, branch, and date first</h3>
              <p className="text-muted-foreground mt-2">
                Please select a doctor, branch, and date to see available time slots.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AppointmentsPage;