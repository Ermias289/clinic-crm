import apiClient from "./client";

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
  createdAt: string;
  updatedAt: string;
  branches?: number[];
}

/* ===== Create / Update DTO ===== */
export interface AddMedicalServiceDTO {
  name: string;
  description?: string;
  durationInMinutes: number;
  servicePicture?: string;
  medicalProfessionalsId?: number[];
  branches?: number[];
}

export interface UpdateMedicalServiceDTO extends AddMedicalServiceDTO {
  id: number;
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

  // Upload image
  uploadImage: async (file: File): Promise<{ filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await apiClient.post<{ filename: string }>(
      "/api/FileUpload/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },
};