import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID es requerido' },
        { status: 400 }
      );
    }

    // Eliminar la imagen de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return NextResponse.json(
        { message: 'Imagen eliminada exitosamente', result },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'No se pudo eliminar la imagen', result },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error eliminando imagen de Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}