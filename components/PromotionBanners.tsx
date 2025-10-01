'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromotionBanner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  customTitle?: string;
  customDescription?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

interface PromotionBannersProps {
  autoSlideInterval?: number; // en milisegundos
}

export default function PromotionBanners({ autoSlideInterval = 5000 }: PromotionBannersProps) {
  const [banners, setBanners] = useState<PromotionBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/promotion-banners');
        if (response.ok) {
          const data = await response.json();
          console.log('Banners data received:', data);
          console.log('Banner custom fields:', data.banners?.map((b: PromotionBanner) => ({ id: b._id, customTitle: b.customTitle, customDescription: b.customDescription })));
          setBanners(data.banners || []);
        } else {
          console.error('Error response:', response.status);
          setError('Error al cargar los banners');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoSlideInterval]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };



  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Cargando banners...</div>
      </div>
    );
  }

  console.log('Current banners state:', banners);
  console.log('Banners length:', banners.length);
  console.log('Error state:', error);

  if (error || banners.length === 0) {
    console.log('Returning null - error:', error, 'banners length:', banners.length);
    return null; // No mostrar nada si hay error o no hay banners
  }

  return (
    <div className="w-full">
      {/* Título principal de la sección */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
          Apartamentos Vacacionales y Vans
        </h2>
        <p className="text-lg md:text-xl font-bold text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text uppercase tracking-wide">
          Ofertas Especiales
        </p>
      </div>
      
      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Main Carousel */}
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={banner._id} className="w-full flex-shrink-0 relative h-96">
                {/* Banner Image */}
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover transition-all duration-500"
                      priority={index === 0}
                      unoptimized={true}
                      onError={(e) => {
                        console.error('Error loading image:', banner.imageUrl);
                        // Ocultar la imagen con error y mostrar el fondo gradiente
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', banner.imageUrl);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white text-6xl opacity-50">📸</div>
                    </div>
                  )}
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-6">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{banner.customTitle || banner.title}</h3>
                    {banner.customDescription && (
                      <p className="text-lg mb-4 opacity-90">{banner.customDescription}</p>
                    )}
                    <Button
                      asChild
                      className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold px-6 py-3 border-2 border-black shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-lg"
                    >
                      <a
                        href={`https://wa.me/573012345678?text=${encodeURIComponent(
                          `Hola, estoy interesado en ${banner.customTitle || banner.title}. ¿Podrían darme más información?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Más Información
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-yellow-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}