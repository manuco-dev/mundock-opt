import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'mundo-vacacional';
    const transformation = formData.get('transformation') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      );
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB permitido.' },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Preparar opciones de subida
    const uploadOptions: any = {
      resource_type: 'image',
      folder,
      quality: 'auto',
      fetch_format: 'auto',
    };

    // Agregar transformaciones si se proporcionan
    if (transformation) {
      try {
        uploadOptions.transformation = JSON.parse(transformation);
      } catch (error) {
        console.warn('Error parsing transformation:', error);
      }
    }

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json(
      {
        message: 'Imagen subida exitosamente',
        result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error subiendo imagen:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para obtener información de una imagen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID es requerido' },
        { status: 400 }
      );
    }

    // Obtener información de la imagen
    const result = await cloudinary.api.resource(publicId);

    return NextResponse.json(
      {
        message: 'Información obtenida exitosamente',
        result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error obteniendo información de imagen:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}