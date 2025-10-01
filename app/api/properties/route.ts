import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Property, { IProperty } from '@/lib/db/models/Property';
import jwt from 'jsonwebtoken';
import AdminUser from '@/lib/db/models/AdminUser';

// Verificar si el usuario es admin
async function verifyAdmin(request: NextRequest) {
  try {
    let token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
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

// GET /api/properties - Obtener todas las propiedades
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Obtener parámetros de consulta para filtrado
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const hasPool = searchParams.get('hasPool');
    const isFurnished = searchParams.get('isFurnished');
    const minBedrooms = searchParams.get('minBedrooms');
    const minBathrooms = searchParams.get('minBathrooms');
    
    // Construir el filtro
    const filter: any = { isActive: true };
    
    if (type) {
      filter.type = type;
    }
    
    if (hasPool === 'true') {
      filter.hasPool = true;
    }
    
    if (isFurnished === 'true') {
      filter.isFurnished = true;
    }
    
    if (minBedrooms) {
      filter.bedrooms = { $gte: parseInt(minBedrooms) };
    }
    
    if (minBathrooms) {
      filter.bathrooms = { $gte: parseInt(minBathrooms) };
    }
    
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Error al obtener las propiedades' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Crear una nueva propiedad (solo admin)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Verificar si el usuario es administrador
    const currentUser = await verifyAdmin(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const data = await req.json();
    
    const property = new Property(data);
    await property.save();
    
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Error al crear la propiedad' },
      { status: 500 }
    );
  }
}