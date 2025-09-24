'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Bed, Bath, Waves, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertiesMap from '@/components/PropertiesMap';

import { IProperty } from '@/lib/db/models/Property';

export default function ApartamentosPage() {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Estado para la página

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        
        if (!response.ok) {
          throw new Error('Error al cargar las propiedades');
        }
        
        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('No se pudieron cargar las propiedades. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filtrar propiedades según el tipo seleccionado
  const filteredProperties = properties.filter(property => {
    // Filtrar por tipo si no está en "todos"
    if (activeTab === 'apartment' && property.type !== 'apartment') return false;
    if (activeTab === 'country_house' && property.type !== 'country_house') return false;
    
    return true;
  });

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
            <nav className="flex items-center space-x-4">
              {/* Botón de regreso para móviles */}
              <Link href="/" className="md:hidden flex items-center text-dark-blue hover:text-gold transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              {/* Enlace de texto para desktop */}
              <Link href="/" className="hidden md:flex text-dark-blue hover:text-gold transition-colors font-medium">Volver al Inicio</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue font-playfair-display mb-6">
            Nuestras <span className="text-gold">Propiedades</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Descubre nuestros apartamentos y casas finca para tus vacaciones en Cartagena
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {/* Listado de propiedades */}
            <div className="w-full">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="apartment">Apartamentos</TabsTrigger>
                  <TabsTrigger value="country_house">Casas Finca</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando propiedades...</p>
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
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-600">No se encontraron propiedades con los filtros seleccionados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full">
                        <Image 
                          src={property.images[0]?.url || '/placeholder.jpg'} 
                          alt={property.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-xl font-bold text-dark-blue truncate">{property.title}</h3>
                        <p className="text-gray-500 mb-2">{property.location}</p>
                        <p className="text-lg font-bold text-gold mb-4">
                          ${property.price.toLocaleString('es-CO')} COP / noche
                        </p>
                        <div className="flex items-center space-x-4 text-gray-600">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                          {property.hasPool && (
                            <div className="flex items-center">
                              <Waves className="h-4 w-4 mr-1" />
                              <span>Piscina</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Link href={`/apartamentos/${property._id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            Ver detalles
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-dark-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair-display mb-6">
            ¿Listo para reservar?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Contáctanos para obtener más información o hacer una reserva
          </p>
          <Button 
            onClick={() => window.location.href = 'https://wa.me/573164032039?text=Hola,%20me%20interesa%20reservar%20una%20propiedad%20en%20Mundo%20Vacacional%20CK'}
            className="bg-gold hover:bg-amber-500 text-dark-blue font-bold px-8 py-3 text-lg"
          >
            Reservar Ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-blue text-white py-8">
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