import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Construir la ruta al archivo en el volumen montado
    const filePath = path.join('/data', 'files', 'uploads', 'hero-images', filename);
    
    // Leer el archivo
    const fileBuffer = await readFile(filePath);
    
    // Determinar el tipo MIME basado en la extensión del archivo
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    // Tipos MIME para imágenes
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml';
    }
    
    // Devolver el archivo con el tipo MIME adecuado
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error al servir el archivo de hero-image:', error);
    return NextResponse.json(
      { error: 'Archivo no encontrado' },
      { status: 404 }
    );
  }
}