import apiClient from './client';

export interface CreateUserAccountDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LogInDTO {
  email: string;
  password: string;
}

export interface LogInReturnDTO {
  token: string;
  user: {
    id: number;
    username: string;
    fName: string;
    mName?: string;
    lName: string;
    email: string;
    phoneNumber?: string;
    userRoleId?: number;
    userRole?: {
      id: number;
      name: string;
      canEditCompanySettings?: boolean;
      canView?: boolean;
    };
  };
}


export interface ChangePasswordDTO {
  phoneOrEmail: string;
  password?: string;  
  newPassword: string;
  otp?: string;
  reset?: boolean;
}


export const authService = {
  register: async (data: CreateUserAccountDTO) => {
    const response = await apiClient.post('/api/Auth/register', data);
    return response.data;
  },

  login: async (data: LogInDTO): Promise<LogInReturnDTO> => {
    const response = await apiClient.post<LogInReturnDTO>(
      '/api/Auth/login',
      {
        phoneOrEmail: data.email,  
        password: data.password,   
      }
    );
    
    const roleName = response.data.user?.userRole?.name?.toLowerCase?.().trim();

    if (response.data.token && roleName !== 'patient') {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }

    return response.data;
  },

  changePassword: async (data: ChangePasswordDTO) => {
    const response = await apiClient.post('/api/Auth/changePassword', {
      phoneOrEmail: data.phoneOrEmail,
      password: data.password,      // current password
      newPassword: data.newPassword,
      reset: false,
    });

    return response.data;
  },

  resetPassword: async (
    phoneOrEmail: string,
    otp: string,
    newPassword: string
  ) => {
    const response = await apiClient.post('/api/Auth/changePassword', {
      phoneOrEmail,
      password: '',     // backend still expects this field
      newPassword,
      otp,
      reset: true,
    });

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};
