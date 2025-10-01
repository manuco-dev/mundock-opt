import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Review from '@/lib/db/models/Review';
import mongoose from 'mongoose';

// GET /api/reviews/[id] - Obtener una reseña por ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de reseña inválido' },
        { status: 400 }
      );
    }
    
    const review = await Review.findById(id);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Error al obtener la reseña' },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Actualizar una reseña (solo admin)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await req.json();
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de reseña inválido' },
        { status: 400 }
      );
    }
    
    // Validaciones básicas
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'La calificación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }
    
    // Preparar datos de actualización
    const updateData = { ...body, updatedAt: new Date() };
    
    // Si se proporciona createdAt, convertirlo a Date
    if (body.createdAt) {
      updateData.createdAt = new Date(body.createdAt);
    }
    
    // Actualizar la reseña
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedReview) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la reseña' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Eliminar una reseña (solo admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID de reseña inválido' },
        { status: 400 }
      );
    }
    
    // Verificar si el usuario es administrador (esto debe implementarse con autenticación)
    // Por ahora, asumimos que la ruta está protegida por middleware
    
    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return NextResponse.json(
        { error: 'Reseña no encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la reseña' },
      { status: 500 }
    );
  }
}