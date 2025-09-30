import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  showEmailVerification: boolean;
  setShowEmailVerification: (show: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await ApiService.userLogin(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // 토큰과 사용자 정보 저장
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        setUser(user || null);

        return true;
      }
      return false;
    } catch (error) {
      console.error('User login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await ApiService.userRegister(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // 토큰과 사용자 정보 저장
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        setUser(user || null);

        // 회원가입 후 자동으로 이메일 인증 모달 표시
        if (!user.email_verified) {
          setShowEmailVerification(true);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('User registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setShowEmailVerification(false);
  };

  // 사용자 정보 새로고침
  const refreshUser = () => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    showEmailVerification,
    setShowEmailVerification,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};