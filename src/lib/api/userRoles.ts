import apiClient from './client';

export interface UserRole {
  id: number;
  name: string;
  description?: string;
  // Company Settings
  canEditCompanySettings: boolean;
  canViewCompanySettings: boolean;
  // User Management
  canAddUser: boolean;
  canViewUser: boolean;
  canEditUser: boolean;
  // Role Management
  canAddRole: boolean;
  canViewRole: boolean;
  canEditRole: boolean;
  // User Onboarding
  canAddUserOnBoarding: boolean;
  canEditUserOnBoarding: boolean;
  canViewUserOnBoardingSetting: boolean;
  // Card Settings
  canAddCardSetting: boolean;
  canViewCardSetting: boolean;
  canEditCardSetting: boolean;
  // Card Types
  canAddCardType: boolean;
  canEditCardType: boolean;
  canViewCardType: boolean;
  // Branch Settings
  canAddBranchSetting: boolean;
  canViewBranchSetting: boolean;
  canEditBranchSetting: boolean;
  // Patient Management
  canAddPatient: boolean;
  canEditPatient: boolean;
  canViewPatient: boolean;
  // Doctor Schedule
  canAddDoctorSchedule: boolean;
  canEditDoctorSchedule: boolean;
  canViewDoctorSchedule: boolean;
  // Working Settings
  canAddWorkingSetting: boolean;
  canEditWorkingSetting: boolean;
  // Card Operations
  canRequestCard: boolean;
  canViewCard: boolean;
  canEditCard: boolean;
  // Card Payments
  canApproveCardPayment: boolean;
  canCheckCardPayment: boolean;
  canRejectCardPayment: boolean;
  canViewCardPayment: boolean;
  canDeleteCardPayment: boolean;
  canCancelCardPayment: boolean;
  canEditCardPayment: boolean;
  canRequestCardPayment: boolean;
  // Appointments
  canMakeAppointment: boolean;
  canCancelAppointment: boolean;
  canCompleteAppointment: boolean;
  canViewAppointment: boolean;
  canEditAppointment: boolean;
  // Medical Professionals
  canAddMedicalProfessional: boolean;
  canEditMedicalProfessional: boolean;
  canViewMedicalProfessional: boolean;
  // Medical Services
  canAddMedicalService: boolean;
  canUpdateMedicalService: boolean;
  canViewMedicalService: boolean;
  // Bank Management
  canAddBank: boolean;
  canEditBank: boolean;
  canViewBank: boolean;
  // Bank Account
  canAddBankAccount: boolean;
  canEditBankAccount: boolean;
  canViewBankAccount: boolean;
  // Notifications
  canReadNotification: boolean;
  canViewNotification: boolean;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export const userRolesService = {
  getAll: async (): Promise<UserRole[]> => {
    const response = await apiClient.get<UserRole[]>('/api/UserRole');
    return response.data;
  },

  getById: async (id: number): Promise<UserRole> => {
    const response = await apiClient.get<UserRole>(`/api/UserRole/${id}`);
    return response.data;
  },

  getByName: async (name: string): Promise<UserRole> => {
    const response = await apiClient.get<UserRole>('/api/UserRole/getRoleByName', { params: { Name: name } });
    return response.data;
  },

  create: async (data: UserRole): Promise<UserRole> => {
    const response = await apiClient.post<UserRole>('/api/UserRole', data);
    return response.data;
  },

  update: async (data: UserRole): Promise<UserRole> => {
    const response = await apiClient.put<UserRole>('/api/UserRole', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/UserRole/${id}`);
  },
};
