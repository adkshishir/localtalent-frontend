import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiHelper } from '@/lib/api-helper';
import { useNavigate } from 'react-router-dom';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'FREELANCER' | 'ADMIN';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check for stored user on mount
    const storedToken = localStorage.getItem('access_token');

    if (storedToken) {
      apiHelper
        .post(
          '/auth/refresh',
          {},
          {
            showToast: false, // Prevent toast notifications
          }
        )
        .then((data) => {
          if (data) {
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('localtalent_user', JSON.stringify(data.user));
            setUser(data.user);
          }
        })
        .catch((error) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('localtalent_user');
          window.location.href = '/auth/login';
        });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login - replace with actual API call

    const data = await apiHelper.post('/auth/login', {
      email,
      password,
    });
    if (data) {
      localStorage.setItem('localtalent_user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.tokens.accessToken);
      setUser(data.user);
      window.location.href = '/admin';
    }
    setIsLoading(false);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setIsLoading(true);
    // Mock registration - replace with actual API call
    const data = await apiHelper.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    if (data) {
      localStorage.removeItem('localtalent_user');
      localStorage.removeItem('access_token');
      await apiHelper.post('/auth/logout', {}, { showToast: false });
    }
    setIsLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('localtalent_user');
    localStorage.removeItem('access_token');
    await apiHelper.post('/auth/logout', {}, { showToast: false });
    window.location.href = '/auth/login';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
