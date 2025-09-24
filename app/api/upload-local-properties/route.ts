import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Directorio base para almacenar archivos de propiedades
const UPLOAD_DIR = path.join('/data', 'files', 'uploads', 'properties');

// Asegurar que el directorio existe
async function ensureDirectoryExists(directory: string) {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    console.error('Error creating directory:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar si la solicitud es multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'La solicitud debe ser multipart/form-data' },
        { status: 400 }
      );
    }

    // Procesar la solicitud multipart/form-data
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      );
    }

    // Asegurar que el directorio de carga existe
    await ensureDirectoryExists(UPLOAD_DIR);

    // Subir cada archivo al sistema de archivos local
    const uploadPromises = files.map(async (file: any) => {
      // Obtener extensión del archivo
      const originalName = file.name;
      const fileExt = path.extname(originalName);
      
      // Validar tipo de archivo (solo imágenes)
      const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const isImage = allowedImageTypes.includes(fileExt.toLowerCase());
      
      if (!isImage) {
        throw new Error(`Tipo de archivo no permitido: ${fileExt}`);
      }
      
      // Validar tamaño del archivo (máximo 10MB para imágenes)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        throw new Error(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB permitido.`);
      }
      
      // Crear un nombre de archivo único con UUID
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Convertir el archivo a un buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Escribir el archivo al sistema de archivos
      await writeFile(filePath, buffer);
      
      // Construir la URL relativa para acceder al archivo
      const fileUrl = `/api/uploads/properties/${fileName}`;
      
      return {
        url: fileUrl,
        filename: fileName,
        originalName: originalName,
        type: 'image',
        size: file.size
      };
    });

    // Esperar a que todas las subidas se completen
    const uploadedFiles = await Promise.all(uploadPromises);

    // Devolver las URLs de los archivos subidos
    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar la carga de archivos' },
      { status: 500 }
    );
  }
}

// Configurar el tamaño máximo de carga
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};