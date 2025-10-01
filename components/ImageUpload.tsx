'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  onUploadStart?: () => void;
  onUploadError?: (error: any) => void;
  disabled?: boolean;
  multiple?: boolean;
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
  };
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  onUploadStart: externalOnUploadStart,
  onUploadError: externalOnUploadError,
  disabled = false,
  multiple = false,
  folder = 'mundo-vacacional',
  transformation
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = (result: any) => {
    setIsUploading(false);
    onChange(result.info.secure_url);
  };

  const onUploadStart = () => {
    setIsUploading(true);
    if (externalOnUploadStart) {
      externalOnUploadStart();
    }
  };

  const onUploadError = (error: any) => {
    setIsUploading(false);
    console.error('Error uploading image:', error);
    if (externalOnUploadError) {
      externalOnUploadError(error);
    }
  };

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative w-full h-60 rounded-lg overflow-hidden border">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          {onRemove && (
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <CldUploadWidget
        uploadPreset="mundo_vacacional_preset"
        options={{
          maxFiles: multiple ? 10 : 1,
          resourceType: 'image',
          maxFileSize: 10000000, // 10MB
          folder: folder,
          sources: ['local', 'url'],
          multiple: multiple,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          ...(transformation && {
            transformation: [
              {
                quality: 'auto',
                fetch_format: 'auto',
                ...transformation
              }
            ]
          }),
          ...(!transformation && {
            transformation: [
              {
                quality: 'auto',
                fetch_format: 'auto'
              }
            ]
          })
        } as any}
        onSuccess={onUpload}
        onOpen={onUploadStart}
        onError={onUploadError}
      >
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open()}
            disabled={disabled || isUploading}
            variant="outline"
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}