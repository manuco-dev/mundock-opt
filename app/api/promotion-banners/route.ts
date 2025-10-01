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

// GET - Obtener todos los banners promocionales activos
export async function GET() {
  try {
    await dbConnect();
    
    const banners = await PromotionBanner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching promotion banners:', error);
    return NextResponse.json(
      { error: 'Error al obtener los banners promocionales' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo banner promocional
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const contentType = request.headers.get('content-type');
    let title: string, description: string, linkUrl: string, customTitle: string, customDescription: string, order: number;
    let url: string, filename: string, originalName: string;
    
    if (contentType?.includes('application/json')) {
      // Manejar URL de Cloudinary pre-subida
      const body = await request.json();
      ({ title, description, linkUrl, customTitle, customDescription, order } = body);
      url = body.url;
      filename = body.public_id;
      originalName = body.originalName;
    } else {
      // Manejar upload directo de archivo
      const formData = await request.formData();
      title = formData.get('title') as string;
      description = formData.get('description') as string;
      linkUrl = formData.get('linkUrl') as string;
      customTitle = formData.get('customTitle') as string;
      customDescription = formData.get('customDescription') as string;
      order = parseInt(formData.get('order') as string) || 0;
      const file = formData.get('image') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'Imagen es requerida' },
          { status: 400 }
        );
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Solo se permiten archivos de imagen' },
          { status: 400 }
        );
      }
      
      // Validar tamaño de archivo (50MB máximo)
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo es demasiado grande. Máximo 50MB.' },
          { status: 400 }
        );
      }
      
      // Subir a Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'mundo-vacacional/banners',
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' },
              { width: 1200, height: 400, crop: 'fill' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;
      
      url = uploadResult.secure_url;
      filename = uploadResult.public_id;
      originalName = file.name;
    }
    
    if (!title) {
      return NextResponse.json(
        { error: 'Título es requerido' },
        { status: 400 }
      );
    }
    
    // Crear registro en base de datos
    const banner = new PromotionBanner({
      title,
      description: description || undefined,
      imageUrl: url,
      linkUrl: linkUrl || undefined,
      customTitle: customTitle || undefined,
      customDescription: customDescription || undefined,
      order: order || 0,
      isActive: true,
      filename,
      originalName
    });
    
    await banner.save();
    
    return NextResponse.json({ 
      message: 'Banner promocional creado exitosamente',
      banner 
    });
  } catch (error) {
    console.error('Error creating promotion banner:', error);
    return NextResponse.json(
      { error: 'Error al crear el banner promocional' },
      { status: 500 }
    );
  }
}