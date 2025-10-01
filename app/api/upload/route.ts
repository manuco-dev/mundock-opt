import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Subir cada archivo a Cloudinary
    const uploadPromises = files.map(async (file: any) => {
      // Convertir el archivo a un buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Crear un nombre de archivo único
      const fileName = `${Date.now()}-${file.name}`;

      // Subir a Cloudinary usando la API de buffer
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: 'properties',
              public_id: fileName.split('.')[0], // Usar el nombre sin extensión como public_id
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                console.error('Error uploading to Cloudinary:', error);
                reject(error);
              } else {
                resolve(result?.secure_url);
              }
            }
          )
          .end(buffer);
      });
    });

    // Esperar a que todas las subidas se completen
    const uploadedUrls = await Promise.all(uploadPromises);

    // Devolver las URLs de las imágenes subidas
    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Error al procesar la carga de archivos' },
      { status: 500 }
    );
  }
}

// Configurar el tamaño máximo de carga (aumentar si es necesario)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};