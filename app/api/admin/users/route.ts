import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import AdminUser from '@/lib/db/models/AdminUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Verificar si el usuario es admin o super_admin
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await AdminUser.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// GET - Listar todos los usuarios admin
export async function GET(request: NextRequest) {
  try {
    const currentUser = await verifyAdmin(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    
    const users = await AdminUser.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear nuevo usuario admin
export async function POST(request: NextRequest) {
  try {
    const currentUser = await verifyAdmin(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo super_admin puede crear usuarios
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Solo super administradores pueden crear usuarios' }, { status: 403 });
    }

    const { username, password, email, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username y password son requeridos' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'El username debe tener al menos 3 caracteres' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    await dbConnect();

    // Verificar si el usuario ya existe
    const existingUser = await AdminUser.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario
    const newUser = new AdminUser({
      username,
      password: hashedPassword,
      email: email || undefined,
      role: role || 'admin',
    });

    await newUser.save();

    // Retornar usuario sin contraseña
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json({ 
      message: 'Usuario creado exitosamente',
      user: userResponse 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar usuario admin
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await verifyAdmin(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo super_admin puede eliminar usuarios
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Solo super administradores pueden eliminar usuarios' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    // No permitir que se elimine a sí mismo
    if (userId === currentUser._id.toString()) {
      return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 });
    }

    await dbConnect();

    const deletedUser = await AdminUser.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}