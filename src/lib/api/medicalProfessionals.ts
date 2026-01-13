import apiClient from "./client";

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
}

export interface UpdateMedicalProfessionalDTO
  extends CreateMedicalProfessionalDTO {
  id: number;
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
    data: CreateMedicalProfessionalDTO & { id: number }
  ): Promise<MedicalProfessional> => {
    // Map frontend data to backend DTO format exactly as expected
    const updateData = {
      Id: data.id,
      FName: data.fName,
      MName: data.mName || "",
      LName: data.lName,
      Email: data.email,
      PhoneNumber: data.phoneNumber,
      JobTitle: data.jobTitle || "",
      Specialty: data.specialty || "",
      LicenseNumber: data.licenseNumber || "",
      EducationalBackground: data.educationalBackground || "",
      YearsOfExperience: data.yearsOfExperience || 0,
      Status: data.status || "Active",
      ProfilePicture: data.profilePicture || "",
      RequiresUserAccount: data.requiresUserAccount,
      MedicalServicesId: data.medicalServicesId || [],
      Branches: data.branches || [],
    };
    
    try {
      // Try the standard PUT request first
      const response = await apiClient.put<MedicalProfessional>(
        `/api/MedicalProfessional`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error: any) {
      // If we get 405, let's try with ID in URL (even though it shouldn't be needed)
      if (error.response?.status === 405) {
        try {
          const alternativeResponse = await apiClient.put<MedicalProfessional>(
            `/api/MedicalProfessional/${data.id}`,
            updateData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            }
          );
          return alternativeResponse.data;
        } catch (altError: any) {
          // If alternative also fails, throw the original error
        }
      }
      
      throw error;
    }
  },

  // Test function to diagnose the issue
  testUpdate: async (
    data: CreateMedicalProfessionalDTO & { id: number }
  ): Promise<any> => {
    // Test 1: Check authentication
    try {
      const getResponse = await apiClient.get(`/api/MedicalProfessional/${data.id}`);
    } catch (error: any) {
      throw new Error(`Authentication test failed: ${error.response?.status}`);
    }

    // Test 2: Check if PUT method is allowed
    try {
      const minimalData = {
        Id: data.id,
        FName: data.fName,
        LName: data.lName,
        Email: data.email,
        PhoneNumber: data.phoneNumber,
        RequiresUserAccount: false,
        MedicalServicesId: data.medicalServicesId || [],
        Branches: data.branches || [],
      };
      
      const response = await apiClient.put(`/api/MedicalProfessional`, minimalData);
      return response.data;
    } catch (error: any) {
      // Test 3: Try different content type
      try {
        const response = await apiClient.put(`/api/MedicalProfessional`, data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
        return response.data;
      } catch (error2: any) {
        throw error;
      }
    }
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/MedicalProfessional/${id}`);
  },
};
