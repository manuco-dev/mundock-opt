import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/mongodb';
import AdminUser from '@/lib/db/models/AdminUser';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Buscar usuario admin
    const admin = await AdminUser.findOne({ username, isActive: true });
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Actualizar último login
    admin.lastLogin = new Date();
    await admin.save();

    // Crear JWT token con expiración de 1 hora
    const token = jwt.sign(
      { 
        userId: admin._id,
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    // Crear respuesta con token en el body para localStorage
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        token: token, // Incluir token en el response para localStorage
        user: {
          id: admin._id,
          username: admin.username,
          role: admin.role
        }
      },
      { status: 200 }
    );

    // Mantener cookie httpOnly como respaldo
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hora
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}