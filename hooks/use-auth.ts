'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthData {
  token: string;
  user: User;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = 'admin-auth';
const SESSION_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Función para obtener datos de autenticación del localStorage
  const getAuthData = useCallback((): AuthData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      
      const authData: AuthData = JSON.parse(stored);
      
      // Verificar si la sesión ha expirado
      if (Date.now() > authData.expiresAt) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }
      
      return authData;
    } catch (error) {
      console.error('Error al leer datos de autenticación:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }, []);

  // Función para guardar datos de autenticación en localStorage
  const setAuthData = useCallback((token: string, userData: User) => {
    const authData: AuthData = {
      token,
      user: userData,
      expiresAt: Date.now() + SESSION_DURATION
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Función para limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Función de login
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        setAuthData(data.token, data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión. Intenta nuevamente.' };
    }
  }, [setAuthData]);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      // Intentar hacer logout en el servidor (opcional)
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al hacer logout en servidor:', error);
    } finally {
      clearAuthData();
      router.push('/admin/login');
    }
  }, [clearAuthData, router]);

  // Función para verificar autenticación
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    
    const authData = getAuthData();
    
    if (!authData) {
      setIsLoading(false);
      return false;
    }

    try {
      // Verificar con el servidor usando el token almacenado
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        // Token inválido, limpiar datos
        clearAuthData();
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      clearAuthData();
      setIsLoading(false);
      return false;
    }
  }, [getAuthData, clearAuthData]);

  // Función para verificar si la sesión ha expirado
  const isSessionExpired = useCallback(() => {
    const authData = getAuthData();
    if (!authData) return true;
    
    return Date.now() > authData.expiresAt;
  }, [getAuthData]);

  // Función para hacer fetch con token automático
  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const authData = getAuthData();
    if (!authData || isSessionExpired()) {
      throw new Error('No authenticated');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authData.token}`,
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }, [getAuthData, isSessionExpired]);

  // Función para obtener el token actual
  const getToken = useCallback((): string | null => {
    const authData = getAuthData();
    return authData?.token || null;
  }, [getAuthData]);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificar expiración periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      const authData = getAuthData();
      if (!authData && isAuthenticated) {
        // Sesión expirada
        clearAuthData();
        router.push('/admin/login');
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [getAuthData, isAuthenticated, clearAuthData, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getToken,
    authenticatedFetch,
    isSessionExpired
  };
}