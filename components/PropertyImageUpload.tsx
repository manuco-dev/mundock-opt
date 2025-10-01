'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PropertyImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  useCloudinary?: boolean; // Nueva prop para elegir entre Cloudinary y endpoint personalizado
}

export default function PropertyImageUpload({
  value = [],
  onChange,
  onRemove,
  disabled = false,
  folder = 'properties',
  useCloudinary = true // Por defecto usar Cloudinary
}: PropertyImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    setIsUploading(false);
    onChange([...value, result.info.secure_url]);
  };

  const onUploadStart = () => {
    setIsUploading(true);
  };

  const onUploadError = (error: any) => {
    setIsUploading(false);
    console.error('Error uploading image:', error);
  };

  // Función para carga manual usando el endpoint personalizado
  const uploadToCustomEndpoint = async (file: File) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/cloudinary/upload-properties', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const data = await response.json();
      onChange([...value, data.url]);
    } catch (error) {
      console.error('Error uploading to custom endpoint:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !useCloudinary) {
      uploadToCustomEndpoint(file);
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
        
        {useCloudinary ? (
          <CldUploadWidget
            uploadPreset="mundo_vacacional_preset"
            options={{
              maxFiles: 1,
              resourceType: 'image',
              maxFileSize: 10000000, // 10MB
              folder: folder,
              sources: ['local', 'url'],
              multiple: false,
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
              showUploadMoreButton: false,
              showPoweredBy: false,
              styles: {
                palette: {
                  window: "#FFFFFF",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  menuIcons: "#5A616A",
                  textDark: "#000000",
                  textLight: "#FFFFFF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inactiveTabIcon: "#0E2F5A",
                  error: "#F44235",
                  inProgress: "#0078FF",
                  complete: "#20B832",
                  sourceBg: "#E4EBF1"
                }
              }
            }}
            onSuccess={onUpload}
            onOpen={onUploadStart}
            onError={onUploadError}
          >
            {({ open }) => (
              <div 
                onClick={() => {
                  try {
                    open();
                  } catch (error) {
                    console.error('Error opening upload widget:', error);
                  }
                }}
                className="flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors"
              >
                <Upload className="h-6 w-6 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Agregar imagen</p>
                <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar</p>
              </div>
            )}
          </CldUploadWidget>
        ) : (
          <div className="flex flex-col items-center justify-center aspect-video rounded-md border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={disabled || isUploading}
            />
            <Upload className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Agregar imagen</p>
            <p className="text-xs text-gray-400 mt-1">Arrastra o haz clic para seleccionar</p>
          </div>
        )}
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