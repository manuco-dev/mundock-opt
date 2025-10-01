'use client';

import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface HeroImageUploadProps {
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

export default function HeroImageUpload({
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
}: HeroImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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

  const uploadToLocalStorage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      onUploadStart?.();
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('files', file);
      
      // Upload to local storage API for hero images
      const response = await fetch('/api/upload-local-hero-images', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }
      
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        const newFile = data.files[0];
        if (newFile.type === 'image') {
          onImageChange(newFile.url);
        } else if (newFile.type === 'video') {
          onVideoChange(newFile.url);
        }
        onUploadComplete?.(newFile.url, newFile.type);
      }
    } catch (error) {
      console.error('Error al subir archivo:', error);
      onUploadError?.(error);
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
      
      // Check if file is an image or video
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        alert('Por favor, sube solo archivos de imagen o video');
        return;
      }
      
      // Check file size
      const maxSize = isVideo ? 100 * 1024 * 1024 : 20 * 1024 * 1024; // 100MB for videos, 20MB for images
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        alert(`El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB`);
        return;
      }
      
      uploadToLocalStorage(file);
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
      
      // Check file size
      const maxSize = type === 'video' ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);
        alert(`El archivo es demasiado grande. El tamaño máximo es ${maxSizeMB}MB`);
        return;
      }
      
      uploadToLocalStorage(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Imagen Hero</label>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
          <p className="text-xs text-blue-700">
            💡 <strong>Sugerencia:</strong> Para mejorar la velocidad de carga, convierte tu imagen a formato WebP antes de subirla. 
            Puedes usar herramientas online como ChatGPT o convertidores gratuitos.
          </p>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !disabled && imageInputRef.current?.click()}
        >
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => handleFileInputChange(e, 'image')}
            disabled={disabled}
          />
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Subir imagen hero</p>
          <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar (máx. 20MB)</p>
          {imageValue && (
            <p className="text-xs text-green-600 mt-2">✓ Imagen cargada correctamente</p>
          )}
        </div>
      </div>

      {/* Video Upload Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Video Hero (Opcional)</label>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
          <p className="text-xs text-blue-700">
            💡 <strong>Sugerencia:</strong> Para videos más ligeros, considera convertir a WebM o comprimir el archivo antes de subirlo.
          </p>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !disabled && videoInputRef.current?.click()}
        >
          <input
            type="file"
            ref={videoInputRef}
            className="hidden"
            accept="video/mp4,video/mov,video/avi,video/webm"
            onChange={(e) => handleFileInputChange(e, 'video')}
            disabled={disabled}
          />
          <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Subir video hero</p>
          <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar (máx. 100MB)</p>
          {videoValue && (
            <p className="text-xs text-green-600 mt-2">✓ Video cargado correctamente</p>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="text-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Subiendo archivo...</p>
        </div>
      )}
    </div>
  );
}