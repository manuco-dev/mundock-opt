'use client';

import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ReviewBlobUploadProps {
  imageValue?: string;
  videoValue?: string;
  onImageChange: (value: string) => void;
  onVideoChange: (value: string) => void;
  onImageRemove: () => void;
  onVideoRemove: () => void;
  disabled?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: (url: string, type: 'image' | 'video') => void;
  onUploadError?: (error: any) => void;
}

export default function ReviewBlobUpload({
  imageValue,
  videoValue,
  onImageChange,
  onVideoChange,
  onImageRemove,
  onVideoRemove,
  disabled = false,
  onUploadStart,
  onUploadComplete,
  onUploadError
}: ReviewBlobUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const uploadToBlobStorage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      onUploadStart?.();
      
      // Determinar tipo de archivo
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        alert('Por favor, sube solo archivos de imagen o video');
        return;
      }
      
      // Validar tamaño de archivo
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for videos, 10MB for images
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        alert(`El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB`);
        return;
      }
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to Vercel Blob API
      const response = await fetch('/api/upload-blob-reviews', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }
      
      const data = await response.json();
      
      if (isImage) {
        onImageChange(data.url);
      } else if (isVideo) {
        onVideoChange(data.url);
      }
      
      onUploadComplete?.(data.url, isImage ? 'image' : 'video');
    } catch (error) {
      console.error('Error al subir archivo:', error);
      onUploadError?.(error);
      alert('Error al subir el archivo. Por favor, intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      uploadToBlobStorage(file);
    }
  }, [disabled, onImageChange, onVideoChange, onUploadComplete, onUploadError, onUploadStart]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check file type
      const isCorrectType = type === 'image' ? file.type.startsWith('image/') : file.type.startsWith('video/');
      if (!isCorrectType) {
        alert(`Por favor, sube solo archivos de ${type === 'image' ? 'imagen' : 'video'}`);
        return;
      }
      
      uploadToBlobStorage(file);
    }
    
    // Reset input
    e.target.value = '';
  };

  const handleImageUpload = () => {
    if (disabled) return;
    imageInputRef.current?.click();
  };

  const handleVideoUpload = () => {
    if (disabled) return;
    videoInputRef.current?.click();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Arrastra y suelta archivos aquí
        </p>
        <p className="text-sm text-gray-500 mb-4">
          o haz clic en los botones de abajo para seleccionar archivos
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleImageUpload}
            disabled={disabled || isUploading}
            className="flex items-center space-x-2"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Subir Imagen</span>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleVideoUpload}
            disabled={disabled || isUploading}
            className="flex items-center space-x-2"
          >
            <Video className="h-4 w-4" />
            <span>Subir Video</span>
          </Button>
        </div>
        
        {isUploading && (
          <p className="text-sm text-blue-600 mt-2">Subiendo archivo...</p>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileInputChange(e, 'image')}
        className="hidden"
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => handleFileInputChange(e, 'video')}
        className="hidden"
      />

      {/* Image Preview */}
      {imageValue && (
        <div className="relative">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Imagen del Cliente:</h4>
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
            <Image
              src={imageValue}
              alt="Imagen del cliente"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-6 w-6 p-0"
              onClick={onImageRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {videoValue && (
        <div className="relative">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Video del Cliente:</h4>
          <div className="relative">
            <video
              src={videoValue}
              className="w-full max-w-md rounded-lg"
              controls
              poster={imageValue}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={onVideoRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* File format info */}
      <div className="text-xs text-gray-500">
        <p>Formatos soportados:</p>
        <p>• Imágenes: JPG, PNG, GIF, WebP (máx. 10MB)</p>
        <p>• Videos: MP4, WebM, MOV (máx. 50MB)</p>
      </div>
    </div>
  );
}