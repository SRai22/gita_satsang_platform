import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, LoginCredentials, CreateUserData } from '../types/api';
import { authAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: CreateUserData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
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
  const { toast } = useToast();

  const isAuthenticated = !!user && user.isApproved;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await authAPI.getProfile();
        setUser(response.user);
      } catch (error) {
        // Token might be expired, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    }
    setIsLoading(false);
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        if (response.user.isApproved) {
          toast({
            title: 'Welcome back!',
            description: `Hari Om, ${response.user.spiritualName || response.user.fullName}`,
          });
        } else {
          toast({
            title: 'Account Pending Approval',
            description: 'Your account is awaiting approval from administrators.',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.error?.message || 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (userData: CreateUserData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        toast({
          title: 'Registration Submitted',
          description: 'Your registration has been submitted for approval. You will be notified once approved.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.error?.message || 'Registration failed',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Call logout API (fire and forget)
    authAPI.logout().catch(() => {
      // Ignore errors since we're logging out anyway
    });

    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
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
