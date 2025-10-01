'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ children, redirectTo = '/admin/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading, isSessionExpired } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar cada 30 segundos si la sesión ha expirado
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        router.push(redirectTo);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isSessionExpired, router, redirectTo]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // No mostrar contenido si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}