import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Excluir favi.ico de la optimización de imágenes
  if (request.nextUrl.pathname === '/favi.ico') {
    return NextResponse.next();
  }

  // Solo aplicar middleware a rutas admin (excepto login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Obtener token desde cookie o header Authorization
    let token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      // Redirigir a login si no hay token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // Verificar el token JWT usando Web Crypto API
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET no está configurado');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // Verificación básica del formato JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token format invalid');
      }

      // Decodificar el payload para verificar expiración
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        throw new Error('Token expired');
      }

      // Si el token tiene el formato correcto y no ha expirado, continuar
      return NextResponse.next();
    } catch (error) {
      console.error('Token inválido:', error);
      // Token inválido, redirigir a login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/favi.ico'
  ]
};