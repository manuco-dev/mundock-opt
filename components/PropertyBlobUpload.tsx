'use client';

import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface PropertyBlobUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (url: string) => void;
  disabled?: boolean;
  folder?: string;
}

export default function PropertyBlobUpload({
  value = [],
  onChange,
  onRemove,
  disabled = false,
  folder = 'properties'
}: PropertyBlobUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, sube solo archivos de imagen');
        return;
      }
      
      // Validar tamaño de archivo (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB');
        return;
      }
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload to Vercel Blob API
      const response = await fetch('/api/upload-blob-properties', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const data = await response.json();
      onChange([...value, data.url]);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Por favor, intenta de nuevo.');
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
  }, [disabled, onChange, value]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      uploadToBlobStorage(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isMounted) return null;

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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              alt="Property image"
              src={url}
            />
          </div>
        ))}
        
        <div 
          className={`flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary'
          } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp" 
            onChange={handleFileInputChange}
            disabled={disabled || isUploading}
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