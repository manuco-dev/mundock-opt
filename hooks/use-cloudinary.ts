'use client';

import { useState, useCallback } from 'react';
import { cloudinaryUtils, CloudinaryUploadResult } from '@/lib/cloudinary';

interface UseCloudinaryOptions {
  folder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  onSuccess?: (result: CloudinaryUploadResult) => void;
  onError?: (error: any) => void;
}

export function useCloudinary(options: UseCloudinaryOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    folder = 'mundo-vacacional',
    maxFiles = 1,
    maxFileSize = 10000000, // 10MB
    onSuccess,
    onError
  } = options;

  const uploadImage = useCallback(async (file: File): Promise<CloudinaryUploadResult | null> => {
    if (!file) return null;

    // Validar tamaño del archivo
    if (file.size > maxFileSize) {
      const errorMsg = `El archivo es demasiado grande. Máximo ${maxFileSize / 1000000}MB permitido.`;
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return null;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Solo se permiten archivos de imagen.';
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return null;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('folder', folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la subida: ${response.statusText}`);
      }

      const result: CloudinaryUploadResult = await response.json();
      
      setUploadProgress(100);
      onSuccess?.(result);
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al subir la imagen';
      setError(errorMsg);
      onError?.(err);
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [folder, maxFileSize, onSuccess, onError]);

  const deleteImage = useCallback(async (publicId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen');
      }

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido al eliminar la imagen';
      setError(errorMsg);
      onError?.(err);
      return false;
    }
  }, [onError]);

  const getOptimizedUrl = useCallback((publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}) => {
    return cloudinaryUtils.getOptimizedUrl(publicId, options);
  }, []);

  const getThumbnailUrl = useCallback((publicId: string, size: number = 150) => {
    return cloudinaryUtils.getThumbnailUrl(publicId, size);
  }, []);

  const getAvatarUrl = useCallback((publicId: string, size: number = 100) => {
    return cloudinaryUtils.getAvatarUrl(publicId, size);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    isUploading,
    uploadProgress,
    error,
    
    // Funciones
    uploadImage,
    deleteImage,
    getOptimizedUrl,
    getThumbnailUrl,
    getAvatarUrl,
    clearError,
    
    // Utilidades
    utils: cloudinaryUtils
  };
}

// Hook especializado para múltiples imágenes
export function useCloudinaryMultiple(options: UseCloudinaryOptions = {}) {
  const [images, setImages] = useState<CloudinaryUploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloudinary = useCloudinary({
    ...options,
    onSuccess: (result) => {
      setImages(prev => [...prev, result]);
      options.onSuccess?.(result);
    },
    onError: (err) => {
      setError(err.message);
      options.onError?.(err);
    }
  });

  const uploadMultiple = useCallback(async (files: FileList | File[]) => {
    setIsUploading(true);
    setError(null);

    const fileArray = Array.from(files);
    const results: CloudinaryUploadResult[] = [];

    try {
      for (const file of fileArray) {
        const result = await cloudinary.uploadImage(file);
        if (result) {
          results.push(result);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir las imágenes');
    } finally {
      setIsUploading(false);
    }

    return results;
  }, [cloudinary]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    isUploading,
    error,
    uploadMultiple,
    removeImage,
    clearImages,
    uploadImage: cloudinary.uploadImage,
    deleteImage: cloudinary.deleteImage,
    getOptimizedUrl: cloudinary.getOptimizedUrl,
    getThumbnailUrl: cloudinary.getThumbnailUrl,
    getAvatarUrl: cloudinary.getAvatarUrl,
    clearError: cloudinary.clearError,
    utils: cloudinary.utils
  };
}