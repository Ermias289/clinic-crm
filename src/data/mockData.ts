import { 
  Patient, 
  Appointment, 
  PatientCard, 
  MedicalProfessional, 
  MedicalService, 
  Branch, 
  CardType, 
  Payment,
  DashboardStats,
  WorkingDay,
  Company
} from '@/types/clinic';

export const mockCompany: Company = {
  id: '1',
  name: 'Lucid Dental Clinic',
  email: 'info@brightsmile.com',
  phone: '+1 (555) 123-4567',
  address: '123 Healthcare Avenue, Medical District, City 12345',
  website: 'https://brightsmile.com',
  taxId: 'TAX-12345678',
};

export const mockBranches: Branch[] = [
  { id: '1', name: 'Main Branch - Downtown', address: '123 Healthcare Ave, Downtown', phone: '+1 (555) 111-1111', email: 'downtown@brightsmile.com', isActive: true },
  { id: '2', name: 'Westside Branch', address: '456 Wellness St, Westside', phone: '+1 (555) 222-2222', email: 'westside@brightsmile.com', isActive: true },
  { id: '3', name: 'North Campus', address: '789 Medical Blvd, North', phone: '+1 (555) 333-3333', email: 'north@brightsmile.com', isActive: true },
];

export const mockWorkingDays: WorkingDay[] = [
  { dayOfWeek: 0, dayName: 'Sunday', isOpen: false, openTime: '09:00', closeTime: '17:00' },
  { dayOfWeek: 1, dayName: 'Monday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 2, dayName: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 3, dayName: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 4, dayName: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '18:00' },
  { dayOfWeek: 5, dayName: 'Friday', isOpen: true, openTime: '08:00', closeTime: '16:00' },
  { dayOfWeek: 6, dayName: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '14:00' },
];

export const mockCardTypes: CardType[] = [
  { 
    id: '1', 
    name: 'Basic Care', 
    description: 'Essential dental care coverage', 
    duration: 12, 
    price: 199, 
    benefits: ['Free checkups', '10% off treatments', 'Priority booking'], 
    color: '#14b8a6',
    isActive: true 
  },
  { 
    id: '2', 
    name: 'Premium Care', 
    description: 'Comprehensive dental coverage', 
    duration: 12, 
    price: 399, 
    benefits: ['Free checkups', '25% off treatments', 'Priority booking', 'Free X-rays', 'Emergency care'], 
    color: '#f59e0b',
    isActive: true 
  },
  { 
    id: '3', 
    name: 'Family Plan', 
    description: 'Coverage for the whole family', 
    duration: 12, 
    price: 699, 
    benefits: ['Free checkups for all', '30% off treatments', 'Priority booking', 'Free X-rays', 'Emergency care', 'Kids dental free'], 
    color: '#8b5cf6',
    isActive: true 
  },
];

export const mockServices: MedicalService[] = [
  { id: '1', name: 'General Checkup', description: 'Routine dental examination', category: 'Preventive', duration: 30, price: 75, isActive: true },
  { id: '2', name: 'Teeth Cleaning', description: 'Professional dental cleaning', category: 'Preventive', duration: 45, price: 120, isActive: true },
  { id: '3', name: 'Tooth Extraction', description: 'Surgical tooth removal', category: 'Surgery', duration: 60, price: 250, isActive: true },
  { id: '4', name: 'Root Canal', description: 'Endodontic therapy', category: 'Endodontics', duration: 90, price: 800, isActive: true },
  { id: '5', name: 'Teeth Whitening', description: 'Professional whitening treatment', category: 'Cosmetic', duration: 60, price: 350, isActive: true },
  { id: '6', name: 'Dental Filling', description: 'Cavity treatment and filling', category: 'Restorative', duration: 45, price: 180, isActive: true },
  { id: '7', name: 'Dental Crown', description: 'Custom crown placement', category: 'Restorative', duration: 60, price: 950, isActive: true },
  { id: '8', name: 'Braces Consultation', description: 'Orthodontic evaluation', category: 'Orthodontics', duration: 45, price: 150, isActive: true },
  { id: '9', name: 'Dental X-Ray', description: 'Full mouth radiographs', category: 'Diagnostic', duration: 15, price: 85, isActive: true },
  { id: '10', name: 'Gum Treatment', description: 'Periodontal therapy', category: 'Periodontics', duration: 60, price: 300, isActive: true },
];

export const mockDoctors: MedicalProfessional[] = [
  { 
    id: '1', 
    firstName: 'Sarah', 
    lastName: 'Johnson', 
    specialization: 'General Dentistry', 
    email: 'sarah.johnson@brightsmile.com', 
    phone: '+1 (555) 100-0001',
    licenseNumber: 'DEN-2019-001',
    branches: [mockBranches[0], mockBranches[1]],
    services: [mockServices[0], mockServices[1], mockServices[5]],
    status: 'active'
  },
  { 
    id: '2', 
    firstName: 'Michael', 
    lastName: 'Chen', 
    specialization: 'Orthodontics', 
    email: 'michael.chen@brightsmile.com', 
    phone: '+1 (555) 100-0002',
    licenseNumber: 'DEN-2018-045',
    branches: [mockBranches[0]],
    services: [mockServices[7]],
    status: 'active'
  },
  { 
    id: '3', 
    firstName: 'Emily', 
    lastName: 'Williams', 
    specialization: 'Endodontics', 
    email: 'emily.williams@brightsmile.com', 
    phone: '+1 (555) 100-0003',
    licenseNumber: 'DEN-2017-089',
    branches: [mockBranches[0], mockBranches[2]],
    services: [mockServices[3], mockServices[6]],
    status: 'active'
  },
  { 
    id: '4', 
    firstName: 'James', 
    lastName: 'Rodriguez', 
    specialization: 'Oral Surgery', 
    email: 'james.rodriguez@brightsmile.com', 
    phone: '+1 (555) 100-0004',
    licenseNumber: 'DEN-2015-012',
    branches: [mockBranches[1], mockBranches[2]],
    services: [mockServices[2]],
    status: 'active'
  },
  { 
    id: '5', 
    firstName: 'Lisa', 
    lastName: 'Thompson', 
    specialization: 'Cosmetic Dentistry', 
    email: 'lisa.thompson@brightsmile.com', 
    phone: '+1 (555) 100-0005',
    licenseNumber: 'DEN-2020-067',
    branches: [mockBranches[0]],
    services: [mockServices[4], mockServices[6]],
    status: 'active'
  },
];

export const mockPatients: Patient[] = [
  { id: '1', firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '+1 (555) 200-0001', dateOfBirth: '1985-03-15', gender: 'male', registeredAt: '2024-01-15', cardId: '1' },
  { id: '2', firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@email.com', phone: '+1 (555) 200-0002', dateOfBirth: '1990-07-22', gender: 'female', registeredAt: '2024-02-20', cardId: '2' },
  { id: '3', firstName: 'David', lastName: 'Brown', email: 'david.brown@email.com', phone: '+1 (555) 200-0003', dateOfBirth: '1978-11-08', gender: 'male', registeredAt: '2024-03-10' },
  { id: '4', firstName: 'Jennifer', lastName: 'Wilson', email: 'jennifer.wilson@email.com', phone: '+1 (555) 200-0004', dateOfBirth: '1995-01-30', gender: 'female', registeredAt: '2024-03-25', cardId: '3' },
  { id: '5', firstName: 'Robert', lastName: 'Taylor', email: 'robert.taylor@email.com', phone: '+1 (555) 200-0005', dateOfBirth: '1982-09-12', gender: 'male', registeredAt: '2024-04-05', cardId: '4' },
  { id: '6', firstName: 'Amanda', lastName: 'Lee', email: 'amanda.lee@email.com', phone: '+1 (555) 200-0006', dateOfBirth: '1988-06-18', gender: 'female', registeredAt: '2024-12-27' },
  { id: '7', firstName: 'Christopher', lastName: 'Martinez', email: 'chris.martinez@email.com', phone: '+1 (555) 200-0007', dateOfBirth: '1975-04-25', gender: 'male', registeredAt: '2024-12-26' },
  { id: '8', firstName: 'Jessica', lastName: 'Anderson', email: 'jessica.anderson@email.com', phone: '+1 (555) 200-0008', dateOfBirth: '1992-12-03', gender: 'female', registeredAt: '2024-12-27' },
];

export const mockCards: PatientCard[] = [
  { id: '1', referenceNumber: 'BSC-2024-0001', patientId: '1', patientName: 'John Smith', cardTypeId: '1', cardTypeName: 'Basic Care', status: 'active', issueDate: '2024-01-15', expiryDate: '2025-01-15', benefits: ['Free checkups', '10% off treatments'] },
  { id: '2', referenceNumber: 'BSC-2024-0002', patientId: '2', patientName: 'Maria Garcia', cardTypeId: '2', cardTypeName: 'Premium Care', status: 'active', issueDate: '2024-02-20', expiryDate: '2025-02-20', benefits: ['Free checkups', '25% off treatments', 'Free X-rays'] },
  { id: '3', referenceNumber: 'BSC-2024-0003', patientId: '4', patientName: 'Jennifer Wilson', cardTypeId: '3', cardTypeName: 'Family Plan', status: 'pending', issueDate: '2024-03-25', expiryDate: '2025-03-25', benefits: ['Free checkups for all', '30% off treatments'] },
  { id: '4', referenceNumber: 'BSC-2023-0015', patientId: '5', patientName: 'Robert Taylor', cardTypeId: '1', cardTypeName: 'Basic Care', status: 'expired', issueDate: '2023-04-05', expiryDate: '2024-04-05', benefits: ['Free checkups', '10% off treatments'] },
  { id: '5', referenceNumber: 'BSC-2024-0010', patientId: '3', patientName: 'David Brown', cardTypeId: '2', cardTypeName: 'Premium Care', status: 'suspended', issueDate: '2024-06-01', expiryDate: '2025-06-01', benefits: ['Free checkups', '25% off treatments'] },
];

const today = new Date().toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'John Smith', doctorId: '1', doctorName: 'Dr. Sarah Johnson', serviceId: '1', serviceName: 'General Checkup', date: today, time: '09:00', status: 'completed', branchId: '1', branchName: 'Main Branch - Downtown' },
  { id: '2', patientId: '2', patientName: 'Maria Garcia', doctorId: '1', doctorName: 'Dr. Sarah Johnson', serviceId: '2', serviceName: 'Teeth Cleaning', date: today, time: '10:00', status: 'scheduled', branchId: '1', branchName: 'Main Branch - Downtown' },
  { id: '3', patientId: '3', patientName: 'David Brown', doctorId: '3', doctorName: 'Dr. Emily Williams', serviceId: '3', serviceName: 'Root Canal', date: today, time: '11:30', status: 'scheduled', branchId: '1', branchName: 'Main Branch - Downtown' },
  { id: '4', patientId: '4', patientName: 'Jennifer Wilson', doctorId: '2', doctorName: 'Dr. Michael Chen', serviceId: '8', serviceName: 'Braces Consultation', date: today, time: '14:00', status: 'cancelled', branchId: '1', branchName: 'Main Branch - Downtown' },
  { id: '5', patientId: '5', patientName: 'Robert Taylor', doctorId: '4', doctorName: 'Dr. James Rodriguez', serviceId: '3', serviceName: 'Tooth Extraction', date: today, time: '15:30', status: 'scheduled', branchId: '2', branchName: 'Westside Branch' },
  { id: '6', patientId: '6', patientName: 'Amanda Lee', doctorId: '5', doctorName: 'Dr. Lisa Thompson', serviceId: '5', serviceName: 'Teeth Whitening', date: today, time: '16:00', status: 'scheduled', branchId: '1', branchName: 'Main Branch - Downtown' },
  { id: '7', patientId: '7', patientName: 'Christopher Martinez', doctorId: '1', doctorName: 'Dr. Sarah Johnson', serviceId: '1', serviceName: 'General Checkup', date: '2024-12-28', time: '09:30', status: 'scheduled', branchId: '1', branchName: 'Main Branch - Downtown' },
  { id: '8', patientId: '8', patientName: 'Jessica Anderson', doctorId: '3', doctorName: 'Dr. Emily Williams', serviceId: '6', serviceName: 'Dental Filling', date: '2024-12-28', time: '10:00', status: 'scheduled', branchId: '2', branchName: 'Westside Branch' },
  { id: '9', patientId: '1', patientName: 'John Smith', doctorId: '5', doctorName: 'Dr. Lisa Thompson', serviceId: '5', serviceName: 'Teeth Whitening', date: '2024-12-28', time: '14:00', status: 'scheduled', branchId: '1', branchName: 'Main Branch - Downtown' },
];

export const mockPayments: Payment[] = [
  { id: '1', patientId: '2', patientName: 'Maria Garcia', cardId: '2', cardReference: 'BSC-2024-0002', amount: 399, status: 'pending', paymentMethod: 'Bank Transfer', paymentProofUrl: '/payment-proof-1.jpg', submittedAt: '2024-12-26T14:30:00', notes: 'Annual renewal payment' },
  { id: '2', patientId: '4', patientName: 'Jennifer Wilson', cardId: '3', cardReference: 'BSC-2024-0003', amount: 699, status: 'under-review', paymentMethod: 'Mobile Payment', paymentProofUrl: '/payment-proof-2.jpg', submittedAt: '2024-12-25T10:15:00' },
  { id: '3', patientId: '5', patientName: 'Robert Taylor', cardId: '4', cardReference: 'BSC-2023-0015', amount: 199, status: 'pending', paymentMethod: 'Bank Transfer', paymentProofUrl: '/payment-proof-3.jpg', submittedAt: '2024-12-27T09:00:00', notes: 'Card renewal after expiry' },
  { id: '4', patientId: '1', patientName: 'John Smith', cardId: '1', cardReference: 'BSC-2024-0001', amount: 199, status: 'approved', paymentMethod: 'Credit Card', submittedAt: '2024-12-20T11:00:00', reviewedAt: '2024-12-20T14:00:00', reviewedBy: 'Admin' },
  { id: '5', patientId: '3', patientName: 'David Brown', cardId: '5', cardReference: 'BSC-2024-0010', amount: 399, status: 'rejected', paymentMethod: 'Bank Transfer', paymentProofUrl: '/payment-proof-5.jpg', submittedAt: '2024-12-18T16:45:00', reviewedAt: '2024-12-19T09:30:00', reviewedBy: 'Admin', notes: 'Payment proof unclear, please resubmit' },
];

export const mockDashboardStats: DashboardStats = {
  appointmentsToday: {
    total: 6,
    completed: 1,
    cancelled: 1,
    pending: 4,
  },
  activePatients: 156,
  newPatientsToday: 3,
  upcomingAppointments: 8,
  pendingPayments: 3,
  expiredCards: 12,
  totalPatients: 234,
};
