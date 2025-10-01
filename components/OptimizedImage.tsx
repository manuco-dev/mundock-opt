'use client';

import { CldImage } from 'next-cloudinary';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  crop?: string;
  gravity?: string;
  quality?: string | number;
  format?: string;
  blur?: boolean;
  grayscale?: boolean;
  sepia?: boolean;
  overlay?: {
    text?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    gravity?: string;
  };
  transformation?: any[];
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  crop = 'fill',
  gravity = 'auto',
  quality = 'auto',
  format = 'auto',
  blur = false,
  grayscale = false,
  sepia = false,
  overlay,
  transformation = []
}: OptimizedImageProps) {
  // Construir transformaciones dinámicamente
  const transformations = [
    {
      width,
      height,
      crop,
      gravity,
      quality,
      fetch_format: format
    },
    ...transformation
  ];

  // Agregar efectos si están habilitados
  if (blur) {
    transformations.push({ effect: 'blur:300' });
  }
  
  if (grayscale) {
    transformations.push({ effect: 'grayscale' });
  }
  
  if (sepia) {
    transformations.push({ effect: 'sepia' });
  }

  // Agregar overlay de texto si está definido
  if (overlay?.text) {
    transformations.push({
      overlay: {
        text: overlay.text,
        color: overlay.color || 'white',
        fontSize: overlay.fontSize || 60,
        fontFamily: overlay.fontFamily || 'Arial'
      },
      gravity: overlay.gravity || 'center'
    });
  }

  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      transformations={transformations}
      className={cn('object-cover', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Componente especializado para avatares
export function AvatarImage({
  src,
  alt,
  size = 100,
  className
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      crop="thumb"
      gravity="face"
      className={cn('rounded-full', className)}
    />
  );
}

// Componente especializado para banners
export function BannerImage({
  src,
  alt,
  width = 1200,
  height = 400,
  className,
  overlay
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  overlay?: OptimizedImageProps['overlay'];
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      crop="fill"
      gravity="center"
      className={cn('w-full', className)}
      overlay={overlay}
    />
  );
}

// Componente especializado para galerías
export function GalleryImage({
  src,
  alt,
  size = 300,
  className
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      crop="fill"
      gravity="auto"
      className={cn('rounded-lg hover:scale-105 transition-transform duration-300', className)}
    />
  );
}