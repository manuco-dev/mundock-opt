'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Bed, Bath, Waves, Home, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IProperty } from '@/lib/db/models/Property';
import EmbeddedGoogleMap from '@/components/EmbeddedGoogleMap';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<IProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar la propiedad');
        }
        
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('No se pudo cargar la información de la propiedad. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const propertyTypeLabel = {
    apartment: 'Apartamento',
    country_house: 'Casa Finca'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Image src="/logomundo.png" alt="Mundo Vacacional CK Logo" width={80} height={80} className="w-12 h-12 sm:w-16 sm:h-16" />
              <h1 className="text-xl sm:text-2xl font-bold text-dark-blue font-playfair-display">
                Mundo Vacacional CK
              </h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/apartamentos" className="text-dark-blue hover:text-gold transition-colors font-medium flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Propiedades
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando información de la propiedad...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Intentar de nuevo
              </Button>
            </div>
          ) : property ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Image Gallery */}
              <div className="relative h-96 w-full">
                {property.images && property.images.length > 0 ? (
                  <>
                    <Image 
                      src={property.images[currentImageIndex]?.url || '/placeholder.jpg'} 
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    {property.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <Button 
                          onClick={prevImage} 
                          variant="outline" 
                          size="icon" 
                          className="rounded-full bg-white/80 hover:bg-white"
                        >
                          <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <Button 
                          onClick={nextImage} 
                          variant="outline" 
                          size="icon" 
                          className="rounded-full bg-white/80 hover:bg-white"
                        >
                          <ArrowLeft className="h-6 w-6 transform rotate-180" />
                        </Button>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p className="text-gray-500">No hay imágenes disponibles</p>
                  </div>
                )}
              </div>
              
              {/* Property Details */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {propertyTypeLabel[property.type as keyof typeof propertyTypeLabel]}
                      </span>
                      {property.hasPool && (
                        <span className="inline-block px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                          Piscina
                        </span>
                      )}
                      {property.isFurnished && (
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                          Amoblado
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-blue font-playfair-display mb-1">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 bg-gray-50 p-3 rounded-lg">
                    <p className="text-xl font-bold text-gold">
                      ${property.price.toLocaleString('es-CO')} COP
                    </p>
                    <p className="text-gray-500 text-xs">por noche</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-gray-900">{property.bedrooms} Habitaciones</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-gray-900">{property.bathrooms} Baños</span>
                  </div>
                  {property.hasPool && (
                    <div className="flex items-center">
                      <Waves className="h-4 w-4 mr-1 text-gray-600" />
                      <span className="text-gray-900">Piscina Privada</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-dark-blue mb-2">Descripción</h2>
                  <p className="text-gray-700 text-sm">{property.description}</p>
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-dark-blue mb-2">Amenidades</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-1 text-gold flex-shrink-0" />
                          <span className="text-gray-700 truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mapa de Google */}
                {property.googleMapUrl && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-dark-blue mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-gold" />
                      Ubicación
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <EmbeddedGoogleMap 
                        googleMapUrl={property.googleMapUrl}
                        title={`Ubicación de ${property.title}`}
                        className="w-full h-64 md:h-80"
                      />
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => window.location.href = `https://wa.me/573164032039?text=Hola,%20me%20interesa%20reservar%20la%20propiedad:%20${encodeURIComponent(property.title)}`}
                    className="bg-gold hover:bg-amber-500 text-dark-blue font-bold px-6 py-2 text-sm"
                  >
                    Reservar Ahora
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = `https://wa.me/573164032039?text=Hola,%20me%20gustaría%20más%20información%20sobre%20la%20propiedad:%20${encodeURIComponent(property.title)}`}
                    className="border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white px-6 py-2 text-sm"
                  >
                    Solicitar Información
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">No se encontró la propiedad solicitada.</p>
              <Link href="/apartamentos" className="mt-4 inline-block text-dark-blue hover:text-gold transition-colors font-medium">
                Volver a Propiedades
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-blue text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 Mundo Vacacional CK - Todos los derechos reservados
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Apartamentos y casas finca en Cartagena
          </p>
        </div>
      </footer>
    </div>
  );
}