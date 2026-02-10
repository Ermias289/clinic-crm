import apiClient from "./client";

export interface DocServiceDTO {
  id: number;
  medicalProfessionalId: number;
  medicalServiceId: number;
  branchSettingId: number;
  medicalProfessional?: {
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
  };
  medicalService?: {
    id: number;
    name: string;
    description: string;
    durationInMinutes: number;
    servicePicture?: string;
  };
  branchSetting?: {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    subCity: string;
    city: string;
    location: string;
  };
}

export interface AddDocServiceDTO {
  medicalProfessionalId: number;
  medicalServiceId: number;
  branchSettingId: number;
}

export interface UpdateDocServiceDTO {
  id: number;
  medicalProfessionalId: number;
  medicalServiceId: number;
  branchSettingId: number;
}

export const docServiceService = {
  getAll: async (): Promise<DocServiceDTO[]> => {
    const response = await apiClient.get<DocServiceDTO[]>("/api/DocService");
    return response.data;
  },

  getById: async (id: number): Promise<DocServiceDTO> => {
    const response = await apiClient.get<DocServiceDTO>(`/api/DocService/${id}`);
    return response.data;
  },

  getFiltered: async (params: {
    serviceId?: number;
    branchId?: number;
    docId?: number;
  }): Promise<DocServiceDTO[]> => {
    const response = await apiClient.get<DocServiceDTO[]>("/api/DocService/docService", { params });
    return response.data;
  },

  getByDoctorId: async (doctorId: number): Promise<DocServiceDTO[]> => {
    const response = await apiClient.get<DocServiceDTO[]>("/api/DocService/docService", {
      params: { docId: doctorId }
    });
    return response.data;
  },

  create: async (data: AddDocServiceDTO): Promise<DocServiceDTO> => {
    const response = await apiClient.post<DocServiceDTO>("/api/DocService", data);
    return response.data;
  },

  createMultiple: async (data: AddDocServiceDTO[]): Promise<DocServiceDTO[]> => {
    const promises = data.map(item => docServiceService.create(item));
    return Promise.all(promises);
  },

  update: async (data: UpdateDocServiceDTO): Promise<DocServiceDTO> => {
    const response = await apiClient.put<DocServiceDTO>("/api/DocService", data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/DocService/${id}`);
  },

  deleteByDoctorId: async (doctorId: number): Promise<void> => {
    // First get all services for this doctor
    const services = await docServiceService.getByDoctorId(doctorId);
    // Delete each one
    const deletePromises = services.map(service => 
      docServiceService.delete(service.id)
    );
    await Promise.all(deletePromises);
  },
} as const;