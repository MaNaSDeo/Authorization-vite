import { createContext, FC, ReactNode, useContext, useState } from "react";
import api from "../api/axiosConfig";
import axios from "axios";

interface User {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  _id: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (data: any) => void;
  register: ({
    username,
    password,
    email,
    firstname,
    lastname,
  }: {
    username: string;
    password: string;
    email: string;
    firstname: string;
    lastname: string;
  }) => Promise<boolean>;
  login: ({
    username,
    email,
    password,
  }: {
    username: string;
    password: string;
    email: string;
  }) => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL!;

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const initializeAuth = async () => {
    try {
      // const response = await api
    } catch (error) {}
  };
  const refreshToken = async () => {
    try {
      // const response = await api
    } catch (error) {}
  };
  const register = async ({
    username,
    password,
    email,
    firstname,
    lastname,
  }: {
    username: string;
    password: string;
    email: string;
    firstname: string;
    lastname: string;
  }) => {
    try {
      const response = await api.post("/auth/register", {
        password,
        username,
        email,
        firstname,
        lastname,
      });
      setUser(response.data.user);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error("Registration Error", error);
      return false;
    }
  };

  const login = async ({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }) => {
    try {
      const response = await api.post("/auth/login", {
        password,
        username,
        email,
      });
      const userData = response.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login Error", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error("Logout error: ", error);
      return false;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/check`, {
        withCredentials: true,
      });
      const userData = response.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Authentication check failed: ", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser,
        login,
        logout,
        register,
        refreshToken,
        initializeAuth,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
