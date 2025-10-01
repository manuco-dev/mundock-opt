import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/mongodb';
import AdminUser from '@/lib/db/models/AdminUser';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Obtener token desde cookie o header Authorization
    let token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verificar JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Buscar usuario para verificar que aún existe y está activo
    const admin = await AdminUser.findById(decoded.userId).select('-password');
    
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        user: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}