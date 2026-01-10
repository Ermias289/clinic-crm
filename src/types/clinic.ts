// Dental Clinic CRM Types

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  registeredAt: string;
  cardId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  branchId: string;
  branchName: string;
}

export interface PatientCard {
  id: string;
  referenceNumber: string;
  patientId: string;
  patientName: string;
  cardTypeId: string;
  cardTypeName: string;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  issueDate: string;
  expiryDate: string;
  benefits: string[];
}

export interface MedicalProfessional {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone: string;
  licenseNumber: string;
  branches: Branch[];
  services: MedicalService[];
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  branchId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface MedicalService {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface CardType {
  id: number;
  name: string;
  description: string;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  cardId: string;
  cardReference: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  paymentMethod: string;
  paymentProofUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  taxId?: string;
}

export interface WorkingDay {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface DashboardStats {
  appointmentsToday: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  activePatients: number;
  newPatientsToday: number;
  upcomingAppointments: number;
  pendingPayments: number;
  expiredCards: number;
  totalPatients: number;
}
