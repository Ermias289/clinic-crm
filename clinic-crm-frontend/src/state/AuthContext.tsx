import React, { createContext, useContext, useEffect, useState } from "react";
import { login } from "../api/auth";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (phoneOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "clinic_crm_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
    }
  }, []);

  const loginUser = async (phoneOrEmail: string, password: string) => {
    const result = await login({ phoneOrEmail, password });
    if (result.token) {
      setToken(result.token);
      window.localStorage.setItem(TOKEN_KEY, result.token);
    }
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loginUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

