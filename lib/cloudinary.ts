import { v2 as cloudinary } from 'cloudinary';

// Configuración del servidor de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Utilidades para trabajar con URLs de Cloudinary
export const cloudinaryUtils = {
  // Extraer el public_id de una URL de Cloudinary
  getPublicIdFromUrl: (url: string): string => {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return '';
    
    const pathAfterUpload = parts.slice(uploadIndex + 2).join('/');
    return pathAfterUpload.split('.')[0]; // Remover extensión
  },

  // Generar URL optimizada
  getOptimizedUrl: (publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
    gravity?: string;
  } = {}) => {
    const {
      width = 800,
      height = 600,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      gravity = 'auto'
    } = options;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: format,
      gravity,
      secure: true
    });
  },

  // Generar URL para thumbnail
  getThumbnailUrl: (publicId: string, size: number = 150) => {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'thumb',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true
    });
  },

  // Generar URL para avatar circular
  getAvatarUrl: (publicId: string, size: number = 100) => {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'thumb',
      gravity: 'face',
      radius: 'max',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true
    });
  },

  // Generar URL con marca de agua
  getWatermarkedUrl: (publicId: string, watermarkText: string) => {
    return cloudinary.url(publicId, {
      overlay: {
        text: watermarkText,
        font_family: 'Arial',
        font_size: 60,
        font_weight: 'bold',
        color: 'white'
      },
      gravity: 'south_east',
      x: 10,
      y: 10,
      quality: 'auto',
      fetch_format: 'auto',
      secure: true
    });
  },

  // Eliminar imagen de Cloudinary
  deleteImage: async (publicId: string) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  },

  // Subir imagen desde buffer
  uploadFromBuffer: async (buffer: Buffer, options: {
    folder?: string;
    public_id?: string;
    transformation?: any[];
  } = {}) => {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: options.folder || 'mundo-vacacional',
            public_id: options.public_id,
            transformation: options.transformation,
            quality: 'auto',
            fetch_format: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  }
};

// Tipos TypeScript para mejor desarrollo
export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fit' | 'limit' | 'mfit' | 'fill' | 'lfill' | 'pad' | 'lpad' | 'mpad' | 'crop' | 'thumb' | 'imagga_crop' | 'imagga_scale';
  gravity?: 'auto' | 'center' | 'face' | 'faces' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  effect?: string;
  overlay?: any;
  radius?: number | 'max';
}