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
  // Convert the data to match the backend DTO format
  const updateData = {
    Id: data.id,
    FName: data.fName,
    MName: data.mName || "",
    LName: data.lName,
    Email: data.email,
    PhoneNumber: data.phoneNumber,
    JobTitle: data.jobTitle,
    Specialty: data.specialty,
    LicenseNumber: data.licenseNumber,
    EducationalBackground: data.educationalBackground,
    YearsOfExperience: data.yearsOfExperience,
    Status: data.status,
    ProfilePicture: data.profilePicture || "",
    RequiresUserAccount: data.requiresUserAccount,
    MedicalServicesId: data.medicalServicesId,
    Branches: data.branches,
  };

  console.log("Attempting to update medical professional:", updateData);

  // Since both PUT methods are failing, let's try different approaches
  const attempts = [
    // Attempt 1: PUT with body (what the controller expects)
    () => apiClient.put<MedicalProfessional>(`/api/MedicalProfessional`, updateData),
    // Attempt 2: PUT with ID in URL
    () => apiClient.put<MedicalProfessional>(`/api/MedicalProfessional/${data.id}`, updateData),
    // Attempt 3: POST to update endpoint (some APIs use this pattern)
    () => apiClient.post<MedicalProfessional>(`/api/MedicalProfessional/update`, updateData),
    // Attempt 4: PATCH method
    () => apiClient.patch<MedicalProfessional>(`/api/MedicalProfessional/${data.id}`, updateData),
  ];

  for (let i = 0; i < attempts.length; i++) {
    try {
      console.log(`Trying update method ${i + 1}...`);
      const response = await attempts[i]();
      console.log(`Update method ${i + 1} succeeded!`);
      return response.data;
    } catch (error: any) {
      console.log(`Update method ${i + 1} failed:`, error.response?.status, error.response?.statusText);
      if (i === attempts.length - 1) {
        // Last attempt failed, throw the error
        throw error;
      }
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new Error("All update attempts failed");
},

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/MedicalProfessional/${id}`);
  },
};
