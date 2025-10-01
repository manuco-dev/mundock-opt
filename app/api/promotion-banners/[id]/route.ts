import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import PromotionBanner from '@/lib/db/models/PromotionBanner';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Obtener banner específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const banner = await PromotionBanner.findById(id).lean();
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error fetching promotion banner:', error);
    return NextResponse.json(
      { error: 'Error al obtener el banner' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar banner
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const body = await request.json();
    const { title, description, linkUrl, customTitle, customDescription, order, isActive } = body;
    
    const banner = await PromotionBanner.findByIdAndUpdate(
      id,
      {
        title,
        description,
        linkUrl,
        customTitle,
        customDescription,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Banner actualizado exitosamente',
      banner 
    });
  } catch (error) {
    console.error('Error updating promotion banner:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el banner' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar banner
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const banner = await PromotionBanner.findById(id);
    
    if (!banner) {
      return NextResponse.json(
        { error: 'Banner no encontrado' },
        { status: 404 }
      );
    }
    
    // Eliminar imagen de Cloudinary si tiene filename (public_id)
    if (banner.filename && !banner.imageUrl.startsWith('/uploads/')) {
      try {
        await cloudinary.uploader.destroy(banner.filename);
      } catch (error) {
        console.warn('Could not delete image from Cloudinary:', error);
      }
    }
    
    // Eliminar registro de base de datos
    await PromotionBanner.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      message: 'Banner eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting promotion banner:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el banner' },
      { status: 500 }
    );
  }
}