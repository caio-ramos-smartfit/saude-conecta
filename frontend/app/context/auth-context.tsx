"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  user_type: 'patient' | 'provider';
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any, userType: 'patient' | 'provider') => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Sending login request with:', { email, password });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          user: {
            email,
            password
          }
        }),
      });
      
      console.log('Login response status:', response.status);

      let responseData;
      try {
        responseData = await response.json();
        console.log('Login response data:', responseData);
      } catch (e) {
        const errorText = await response.text();
        console.error('Failed to parse response as JSON:', errorText);
        throw new Error('Falha na autenticação: resposta inválida do servidor');
      }

      if (!response.ok) {
        throw new Error(responseData.error || 'Falha na autenticação');
      }

      const userData = responseData.data?.user || responseData.user;
      setUser(userData);

      if (!userData) {
        console.error('No user data found in response:', responseData);
        throw new Error('Dados de usuário não encontrados na resposta');
      }

      if (userData.user_type === 'patient') {
        router.push('/patient/dashboard');
      } else {
        router.push('/providers/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userFormData: any, userType: 'patient' | 'provider') => {
    setLoading(true);
    try {
      console.log('Registering user with data:', { ...userFormData, userType });
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...userFormData, userType }),
      });

      console.log('Registration response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Falha no registro';
        let errorDetails = {};
        
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.error || errorData.status?.message || errorMessage;
          errorDetails = errorData.errors || {};
        } catch (e) {
          const errorText = await response.text();
          console.error('Failed to parse error response as JSON:', errorText);
        }
        
        console.error('Registration failed with error:', errorMessage, errorDetails);
        return; // Return instead of throwing to prevent the error
      }

      const data = await response.json();
      console.log('Registration success data:', data);
      
      const userData = data.data?.user || data.user;
      setUser(userData);

      if (!userData) {
        console.error('No user data found in response:', data);
        throw new Error('Dados de usuário não encontrados na resposta');
      }

      if (userData.user_type === 'patient') {
        router.push('/patient/dashboard');
      } else {
        router.push('/providers/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'DELETE',
      });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
