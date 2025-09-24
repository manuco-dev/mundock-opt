'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import OptimizedImage, { AvatarImage, BannerImage, GalleryImage } from '@/components/OptimizedImage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CloudinaryDemo() {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [avatarImage, setAvatarImage] = useState<string>('');
  const [bannerImage, setBannerImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleImageUpload = (url: string) => {
    setUploadedImage(url);
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarImage(url);
  };

  const handleBannerUpload = (url: string) => {
    setBannerImage(url);
  };

  const handleGalleryUpload = (url: string) => {
    setGalleryImages(prev => [...prev, url]);
  };

  const removeImage = () => {
    setUploadedImage('');
  };

  const removeAvatar = () => {
    setAvatarImage('');
  };

  const removeBanner = () => {
    setBannerImage('');
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Demo de Cloudinary</h1>
        <p className="text-lg text-muted-foreground">
          Ejemplos de subida y visualización de imágenes optimizadas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subida básica de imagen */}
        <Card>
          <CardHeader>
            <CardTitle>Subida Básica de Imagen</CardTitle>
            <CardDescription>
              Sube una imagen y visualízala optimizada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={uploadedImage}
              onChange={handleImageUpload}
              onRemove={removeImage}
            />
            {uploadedImage && (
              <div className="space-y-2">
                <h4 className="font-semibold">Imagen Optimizada:</h4>
                <OptimizedImage
                  src={uploadedImage}
                  alt="Imagen subida"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Avatar */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar Circular</CardTitle>
            <CardDescription>
              Sube una imagen para avatar con detección de rostro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={avatarImage}
              onChange={handleAvatarUpload}
              onRemove={removeAvatar}
            />
            {avatarImage && (
              <div className="flex justify-center">
                <AvatarImage
                  src={avatarImage}
                  alt="Avatar"
                  size={150}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Banner */}
        <Card>
          <CardHeader>
            <CardTitle>Banner con Overlay</CardTitle>
            <CardDescription>
              Imagen de banner con texto superpuesto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value={bannerImage}
              onChange={handleBannerUpload}
              onRemove={removeBanner}
            />
            {bannerImage && (
              <BannerImage
                src={bannerImage}
                alt="Banner"
                width={600}
                height={200}
                className="rounded-lg"
                overlay={{
                  text: 'Mundo Vacacional',
                  color: 'white',
                  fontSize: 48,
                  gravity: 'center'
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Galería */}
        <Card>
          <CardHeader>
            <CardTitle>Galería de Imágenes</CardTitle>
            <CardDescription>
              Múltiples imágenes con efectos hover
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              value=""
              onChange={handleGalleryUpload}
              multiple
            />
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <GalleryImage
                      src={image}
                      alt={`Galería ${index + 1}`}
                      size={200}
                    />
                    <Button
                      onClick={() => removeGalleryImage(index)}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Ejemplos de transformaciones */}
      {uploadedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Ejemplos de Transformaciones</CardTitle>
            <CardDescription>
              Diferentes efectos aplicados a la misma imagen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-center">Original</h4>
                <OptimizedImage
                  src={uploadedImage}
                  alt="Original"
                  width={200}
                  height={150}
                  className="rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-center">Blur</h4>
                <OptimizedImage
                  src={uploadedImage}
                  alt="Blur"
                  width={200}
                  height={150}
                  className="rounded-lg"
                  blur
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-center">Escala de Grises</h4>
                <OptimizedImage
                  src={uploadedImage}
                  alt="Grayscale"
                  width={200}
                  height={150}
                  className="rounded-lg"
                  grayscale
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-center">Sepia</h4>
                <OptimizedImage
                  src={uploadedImage}
                  alt="Sepia"
                  width={200}
                  height={150}
                  className="rounded-lg"
                  sepia
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Configuración Requerida</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
              <li>Crea una cuenta en <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline">Cloudinary</a></li>
              <li>Obtén tu Cloud Name, API Key y API Secret del dashboard</li>
              <li>Actualiza las variables en tu archivo .env.local:</li>
            </ol>
            <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
{`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret`}
            </pre>
            <p className="text-sm text-yellow-700 mt-2">
              <strong>4.</strong> Crea un upload preset llamado "ml_default" en tu dashboard de Cloudinary (Settings → Upload → Upload presets)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}