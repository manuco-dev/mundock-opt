import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect, { HeroImage } from '@/lib/db/mongodb';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Directorio base para almacenar archivos de hero-images
const UPLOAD_DIR = path.join('/data', 'files', 'uploads', 'hero-images');

// Asegurar que el directorio existe
async function ensureDirectoryExists(directory: string) {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

// Middleware para verificar autenticación
async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Obtener todas las imágenes del hero
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const images = await HeroImage.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ images }, { status: 200 });

  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST - Subir nueva imagen del hero
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    await verifyAuth(request);
    await dbConnect();

    const contentType = request.headers.get('content-type');
    let url: string;
    let filename: string;
    let type: string;
    let order: number;
    let originalName: string;

    if (contentType?.includes('application/json')) {
      // Caso: URL de Cloudinary ya subida
      const body = await request.json();
      url = body.url;
      filename = body.filename;
      type = body.type || 'image';
      order = body.order || 0;
      originalName = body.originalName || 'hero_image';

      if (!url) {
        return NextResponse.json(
          { error: 'No URL provided' },
          { status: 400 }
        );
      }
    } else {
      // Caso: Upload directo de archivo usando sistema local
      await ensureDirectoryExists(UPLOAD_DIR);
      
      const formData = await request.formData();
      const file = formData.get('file') as File;
      type = formData.get('type') as string || 'image';
      order = parseInt(formData.get('order') as string) || 0;

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validar tipo de archivo
      const allowedTypes = {
        image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        video: ['video/mp4', 'video/mov', 'video/avi']
      };

      if (!allowedTypes[type as keyof typeof allowedTypes]?.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type' },
          { status: 400 }
        );
      }

      // Validar tamaño de archivo (50MB máximo)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size too large. Maximum 50MB allowed.' },
          { status: 400 }
        );
      }

      // Generar nombre único para el archivo
      const fileExtension = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Convertir archivo a buffer y guardarlo localmente
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      console.log(`Hero-image guardada localmente: ${fileName}`);

      // Construir la URL relativa para acceder al archivo
      url = `/api/uploads/hero-images/${fileName}`;
      filename = fileName;
      originalName = file.name;
    }

    // Guardar en base de datos
    const heroImage = new HeroImage({
      filename,
      originalName,
      url,
      type,
      order,
      isActive: true
    });

    await heroImage.save();

    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        image: heroImage
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error uploading file:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar imagen del hero
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación
    await verifyAuth(request);
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Buscar la imagen en la base de datos
    const image = await HeroImage.findById(imageId);

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Eliminar archivo de Vercel Blob Storage si es una URL de blob
    if (image.imageUrl && image.imageUrl.includes('blob.vercel-storage.com')) {
      try {
        const { del } = await import('@vercel/blob');
        await del(image.imageUrl);
        console.log(`Archivo de Vercel Blob eliminado: ${image.imageUrl}`);
      } catch (blobError) {
        console.error('Error deleting blob file:', blobError);
        // Continuar con la eliminación aunque falle la eliminación del blob
      }
    }

    // Eliminar archivo local si existe
    if (image.filename && !image.filename.startsWith('http')) {
      try {
        const filePath = path.join(UPLOAD_DIR, image.filename);
        await unlink(filePath);
        console.log(`Archivo local eliminado: ${image.filename}`);
      } catch (fileError) {
        console.error('Error deleting local file:', fileError);
        // Continuar con la eliminación de la BD aunque falle la eliminación del archivo
      }
    }

    // Eliminar completamente de la base de datos
    const deletedImage = await HeroImage.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return NextResponse.json(
        { error: 'Failed to delete image from database' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting image:', error);
    
    if (error instanceof Error && (error.message === 'No token provided' || error.message === 'Invalid token')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}