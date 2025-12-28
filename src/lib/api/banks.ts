import apiClient from './client';

export interface AddBankDTO {
  name: string;
  code?: string;
}

export interface UpdateBankDTO {
  id: number;
  name: string;
  code?: string;
}

export interface BankDTO {
  id: number;
  name: string;
  code?: string;
}

export interface AddBankAccountDTO {
  bankId: number;
  accountNumber: string;
  accountName: string;
}

export interface UpdateBankAccountDTO {
  id: number;
  bankId: number;
  accountNumber: string;
  accountName: string;
}

export interface BankAccountDTO {
  id: number;
  bankId: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const bankService = {
  // Banks
  getAll: async (): Promise<BankDTO[]> => {
    const response = await apiClient.get<BankDTO[]>('/api/Bank');
    return response.data;
  },

  getById: async (id: number): Promise<BankDTO> => {
    const response = await apiClient.get<BankDTO>(`/api/Bank/${id}`);
    return response.data;
  },

  create: async (data: AddBankDTO): Promise<BankDTO> => {
    const response = await apiClient.post<BankDTO>('/api/Bank', data);
    return response.data;
  },

  update: async (data: UpdateBankDTO): Promise<BankDTO> => {
    const response = await apiClient.put<BankDTO>('/api/Bank', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Bank/${id}`);
  },
};

export const bankAccountService = {
  getAll: async (bankId?: number): Promise<BankAccountDTO[]> => {
    const response = await apiClient.get<BankAccountDTO[]>('/api/BankAccount', {
      params: bankId ? { Id: bankId } : undefined,
    });
    return response.data;
  },

  getById: async (id: number): Promise<BankAccountDTO> => {
    const response = await apiClient.get<BankAccountDTO>(`/api/BankAccount/${id}`);
    return response.data;
  },

  create: async (data: AddBankAccountDTO): Promise<BankAccountDTO> => {
    const response = await apiClient.post<BankAccountDTO>('/api/BankAccount', data);
    return response.data;
  },

  update: async (data: UpdateBankAccountDTO): Promise<BankAccountDTO> => {
    const response = await apiClient.put<BankAccountDTO>('/api/BankAccount', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/BankAccount/${id}`);
  },
};
