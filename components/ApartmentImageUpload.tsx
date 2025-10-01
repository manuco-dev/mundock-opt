'use client';

import { Button } from '@/components/ui/button';
import { X, Upload } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ApartmentImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (url: string) => void;
  disabled?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: any) => void;
}

export default function ApartmentImageUpload({
  value = [],
  onChange,
  onRemove,
  disabled = false,
  onUploadStart,
  onUploadComplete,
  onUploadError
}: ApartmentImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const response = await fetch('/api/upload-local', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        const newFile = data.files[0];
        onChange([...value, newFile.url]);
        onUploadComplete?.(newFile.url);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
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
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Por favor, sube solo archivos de imagen');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB');
        return;
      }
      
      uploadToLocalStorage(file);
    }
  }, [disabled, onChange, value, onUploadComplete, onUploadError, onUploadStart]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Por favor, sube solo archivos de imagen');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB');
        return;
      }
      
      uploadToLocalStorage(file);
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {value.map((url) => (
          <div key={url} className="relative group aspect-video rounded-md overflow-hidden border border-gray-200">
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={() => onRemove(url)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Imagen de apartamento"
              src={url}
            />
          </div>
        ))}
        
        <div 
          className={`flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'} ${!disabled ? 'hover:border-primary cursor-pointer' : 'opacity-50 cursor-not-allowed'} transition-colors`}
          onClick={handleButtonClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp" 
            onChange={handleFileInputChange}
            disabled={disabled}
          />
          <Upload className="h-6 w-6 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">Agregar imagen</p>
          <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar</p>
        </div>
      </div>

      {isUploading && (
        <div className="text-center py-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Subiendo imagen...</p>
        </div>
      )}
    </div>
  );
}