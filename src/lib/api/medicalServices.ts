import apiClient from "./client";
import { fileUploadService } from "./fileUpload";

/* ===== Backend Response Types ===== */

export interface MedicalProfessionalMini {
  id: number;
  fName: string;
  mName?: string;
  lName: string;
  jobTitle: string;
  specialty: string;
  status: string;
}

export interface MedicalService {
  id: number;
  serviceReference: string;
  name: string;
  description: string;
  durationInMinutes: number;
  servicePicture?: string;
  medicalProfessionals: (MedicalProfessionalMini | null)[];
  branches?: BranchMini[];
  createdAt: string;
  updatedAt: string;
}

export interface BranchMini {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  subCity: string;
  city: string;
  location: string;
}

/* ===== Create / Update DTO ===== */
export interface AddMedicalServiceDTO {
  name: string;
  description?: string;
  durationInMinutes: number;
  servicePicture?: string;
  medicalProfessionalsId?: number[];
  branchesId?: number[];
}

export interface UpdateMedicalServiceDTO {
  id: number;
  name: string;
  description?: string;
  durationInMinutes: number;
  servicePicture?: string;
  medicalProfessionalsId?: number[];
  branches?: number[];
}

/* ===== API Service ===== */

export const medicalServicesService = {
  // GET api/MedicalService
  getAll: async (): Promise<MedicalService[]> => {
    const res = await apiClient.get<MedicalService[]>("/api/MedicalService");
    return res.data;
  },

  // GET api/MedicalService/{id}
  getById: async (id: number): Promise<MedicalService> => {
    const res = await apiClient.get<MedicalService>(
      `/api/MedicalService/${id}`
    );
    return res.data;
  },

  // GET api/MedicalService/filteredService
  getFiltered: async (params: {
    serviceId?: number;
    branchId?: number;
    docId?: number;
  }): Promise<MedicalService[]> => {
    const res = await apiClient.get<MedicalService[]>(
      "/api/MedicalService/filteredService",
      { params }
    );
    return res.data;
  },

  // POST api/MedicalService
  create: async (data: AddMedicalServiceDTO): Promise<MedicalService> => {
    const res = await apiClient.post<MedicalService>(
      "/api/MedicalService",
      data
    );
    return res.data;
  },

  // PUT api/MedicalService
  update: async (data: UpdateMedicalServiceDTO): Promise<MedicalService> => {
    const res = await apiClient.put<MedicalService>(
      "/api/MedicalService",
      data
    );
    return res.data;
  },

  // DELETE api/MedicalService/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/MedicalService/${id}`);
  },

  // Upload image - use centralized file upload service
  uploadImage: async (file: File): Promise<string> => {
    return await fileUploadService.upload(file);
  },

  // Get image URL - use centralized file upload service
  getImageUrl: (fileName: string): string => {
    return fileUploadService.getFileUrl(fileName);
  },
};