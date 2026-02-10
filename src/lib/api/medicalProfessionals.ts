import apiClient from "./client";

export interface BranchServiceDTO {
  branchId: number;
  serviceId: number;
}

export interface CreateMedicalProfessionalDTO {
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  specialty: string;
  licenseNumber: string;
  educationalBackground: string;
  yearsOfExperience: number;
  status: string;
  profilePicture?: string;
  requiresUserAccount: boolean;
  medicalServicesId: number[];
  branches: number[];
  branchServices?: BranchServiceDTO[]; // New field for branch-specific services
}

export interface UpdateMedicalProfessionalDTO {
  id: number;
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  specialty: string;
  licenseNumber: string;
  educationalBackground: string;
  yearsOfExperience: number;
  status: string;
  profilePicture?: string;
  requiresUserAccount: boolean;
  medicalServicesId: number[];
  branches: number[];
  branchServices?: BranchServiceDTO[]; // New field for branch-specific services
}

export interface MedicalProfessional {
  id: number;
  fName: string;
  mName?: string;
  lName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  specialty: string;
  licenseNumber: string;
  educationalBackground: string;
  yearsOfExperience: number;
  status: string;
  profilePicture?: string;
  requiresUserAccount: boolean;
  medicalServices: { id: number; name: string }[];
  branches: { id: number; name: string }[];
  medicalServicesId: number[];     //if sth wrong remove it
  branchServices?: BranchServiceDTO[]; // New field for branch-specific services
  createdAt: string;
  updatedAt: string;
}


export const medicalProfessionalsService = {
  getAll: async (): Promise<MedicalProfessional[]> => {
    const res = await apiClient.get("/api/MedicalProfessional");
    return res.data;
  },

  getById: async (id: number): Promise<MedicalProfessional> => {
    const res = await apiClient.get(`/api/MedicalProfessional/${id}`);
    return res.data;
  },

  create: async (
    data: CreateMedicalProfessionalDTO
  ): Promise<MedicalProfessional> => {
    const res = await apiClient.post("/api/MedicalProfessional", data);
    return res.data;
  },

  update: async (
    dto: UpdateMedicalProfessionalDTO
  ): Promise<MedicalProfessional> => {
    const response = await apiClient.put<MedicalProfessional>('/api/MedicalProfessional', dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/MedicalProfessional/${id}`);
  },
} as const;