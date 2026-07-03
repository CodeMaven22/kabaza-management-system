'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from './api/authService';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          // Check if user is suspended or deactivated
          if (currentUser.status === 'suspended' || currentUser.status === 'deactivated') {
            await authService.logout();
            setUser(null);
            setError(`Account is ${currentUser.status}. Please contact administrator.`);
          } else {
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error('[v0] Failed to initialize auth:', err);
        setUser(null);
        // Silent fail - user is not logged in
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login({ username, password });

      // Validate account status
      if (response.user.status === 'suspended') {
        await authService.logout();
        setError('Your account has been suspended. Please contact administrator.');
        return false;
      }

      if (response.user.status === 'deactivated') {
        await authService.logout();
        setError('Your account has been deactivated. Please contact administrator.');
        return false;
      }

      setUser(response.user);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      // Check for rate limiting
      if (message.includes('429') || message.includes('rate limit')) {
        setError('Too many login attempts. Please try again later.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('[v0] Logout error:', err);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (err) {
      console.error('[v0] Failed to refresh user:', err);
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        error,
        login,
        logout,
        refreshUser,
        clearError,
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
