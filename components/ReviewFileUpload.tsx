'use client';

import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ReviewFileUploadProps {
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

export default function ReviewFileUpload({
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
}: ReviewFileUploadProps) {
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
      
      // Upload to local storage API
      const response = await fetch('/api/upload-local-reviews', {
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
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for videos, 10MB for images
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
      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
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
        <label className="text-sm font-medium text-gray-700">Imagen del Cliente</label>
        {imageValue ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <Image
              src={imageValue}
              alt="Imagen del cliente"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              onClick={onImageRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
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
            <p className="text-sm text-gray-500">Subir imagen del cliente</p>
            <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar (máx. 10MB)</p>
          </div>
        )}
      </div>

      {/* Video Upload Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Video Testimonial (Opcional)</label>
        {videoValue ? (
          <div className="relative w-full rounded-lg overflow-hidden border">
            <video
              src={videoValue}
              controls
              className="w-full h-48 object-cover"
            />
            <Button
              type="button"
              onClick={onVideoRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
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
            <p className="text-sm text-gray-500">Subir video testimonial</p>
            <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar (máx. 50MB)</p>
          </div>
        )}
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