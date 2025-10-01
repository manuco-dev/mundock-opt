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
    const filePath = path.join('/data', 'files', 'uploads', 'properties', filename);
    
    // Leer el archivo
    const fileBuffer = await readFile(filePath);
    
    // Determinar el tipo MIME basado en la extensión del archivo
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    }
    
    // Devolver el archivo con el tipo MIME adecuado
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
      },
    });
  } catch (error) {
    console.error('Error al servir la imagen:', error);
    return NextResponse.json(
      { error: 'Imagen no encontrada' },
      { status: 404 }
    );
  }
}