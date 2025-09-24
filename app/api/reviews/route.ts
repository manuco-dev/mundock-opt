import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Review, { IReview } from '@/lib/db/models/Review';

// GET /api/reviews - Obtener todas las reseñas
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Obtener parámetros de consulta para filtrado
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');
    const isFeatured = searchParams.get('isFeatured');
    const minRating = searchParams.get('minRating');
    const limit = searchParams.get('limit');
    const all = searchParams.get('all');
    
    // Construir el filtro
    const filter: any = {};
    
    if (all === 'true') {
      // No filtrar por isActive si se solicitan todas las reseñas
    } else if (isActive !== null) {
      filter.isActive = isActive === 'true';
    } else {
      // Por defecto, solo mostrar reseñas activas
      filter.isActive = true;
    }
    
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }
    
    if (minRating) {
      filter.rating = { $gte: parseInt(minRating) };
    }
    
    let query = Review.find(filter).sort({ order: 1, createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const reviews = await query;
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reseñas' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Crear una nueva reseña (solo admin)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      rating,
      comment,
      customerImage,
      customerVideo,
      isFeatured,
      order,
      createdAt
    } = body;
    
    // Validaciones básicas
    if (!customerName || !rating || !comment) {
      return NextResponse.json(
        { error: 'Nombre del cliente, calificación y comentario son requeridos' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La calificación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }
    
    // Crear nueva reseña
    const reviewData: any = {
      customerName,
      customerEmail,
      rating,
      comment,
      customerImage,
      customerVideo,
      isFeatured: isFeatured || false,
      order: order || 0,
      isActive: true
    };
    
    // Si se proporciona una fecha personalizada, usarla
    if (createdAt) {
      reviewData.createdAt = new Date(createdAt);
    }
    
    const newReview = new Review(reviewData);
    
    const savedReview = await newReview.save();
    
    return NextResponse.json(savedReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error al crear la reseña' },
      { status: 500 }
    );
  }
}