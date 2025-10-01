import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Property, { IProperty } from '@/lib/db/models/Property';

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
    
    // Verificar si el usuario es administrador (esto debe implementarse con autenticación)
    // Por ahora, asumimos que la ruta está protegida por middleware
    
    const data = await req.json();
    
    // Validar datos requeridos
    if (!data.title || !data.description || !data.type || !data.price || !data.location) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }
    
    // Crear nueva propiedad
    const newProperty = await Property.create(data);
    
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Error al crear la propiedad' },
      { status: 500 }
    );
  }
}