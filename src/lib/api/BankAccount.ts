// types/BankAccount.ts
import apiClient from './client';
// Types
export interface BankAccount {
  id: number;
  name: string;
  accountNumber: string;
  bankId: number;
}

export interface Bank {
  id: number;
  name: string;
  logo: string;
  bankAccounts: BankAccount[];
}

export interface AddBankDTO {
  name: string;
  logo: string;
}

export interface UpdateBankDTO {
  id: number;
  name: string;
  logo: string;
}

export interface AddBankAccountDTO {
  name: string;
  accountNumber: string;
  bankId: number;
}

export interface UpdateBankAccountDTO {
  id: number;
  name: string;
  accountNumber: string;
  bankId: number;
}

// API Services


export const bankService = {
  getAll: async (): Promise<Bank[]> => {
    const response = await apiClient.get<Bank[]>('/api/Bank');
    return response.data;
  },

  getById: async (id: number): Promise<Bank> => {
    const response = await apiClient.get<Bank>(`/api/Bank/${id}`);
    return response.data;
  },

  create: async (data: AddBankDTO): Promise<Bank> => {
    const response = await apiClient.post<Bank>('/api/Bank', data);
    return response.data;
  },

  update: async (data: UpdateBankDTO): Promise<Bank> => {
    // PUT with full object in body (including id)
    const response = await apiClient.put<Bank>(`/api/Bank`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Bank/${id}`);
  },
};

export const bankAccountService = {
  getAll: async (): Promise<BankAccount[]> => {
    const response = await apiClient.get<BankAccount[]>('/api/BankAccount');
    return response.data;
  },

  getById: async (id: number): Promise<BankAccount> => {
    const response = await apiClient.get<BankAccount>(`/api/BankAccount/${id}`);
    return response.data;
  },

  create: async (data: AddBankAccountDTO): Promise<BankAccount> => {
    const response = await apiClient.post<BankAccount>('/api/BankAccount', data);
    return response.data;
  },

  update: async (data: UpdateBankAccountDTO): Promise<BankAccount> => {
    // PUT with full object in body (including id)
    const response = await apiClient.put<BankAccount>(`/api/BankAccount`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/BankAccount/${id}`);
  },
};