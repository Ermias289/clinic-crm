import axios from "axios";

const authClient = axios.create({
  baseURL: "/api/Auth"
});

export interface LoginRequest {
  phoneOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userRole: unknown;
  user: unknown;
}

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await authClient.post<LoginResponse>("/login", {
    phoneOrEmail: payload.phoneOrEmail,
    password: payload.password
  });
  return res.data;
};

