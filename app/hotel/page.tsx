'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HotelPage() {
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
              <a href="/" className="text-dark-blue hover:text-gold transition-colors font-medium">Volver al Inicio</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-blue font-playfair-display mb-6">
            Hotel <span className="text-gold">Próximamente</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Estamos construyendo una nueva experiencia hotelera en la ciudad de Cartagena
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-dark-blue text-white hover:bg-dark-blue/90 px-8 py-3 text-lg"
            >
              Volver al Sitio Principal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => window.location.href = 'https://wa.me/573164032039?text=Hola,%20me%20interesa%20recibir%20información%20sobre%20el%20nuevo%20hotel%20en%20Cartagena'}
              variant="outline"
              className="border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white px-8 py-3 text-lg"
            >
              Recibir Información
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark-blue font-playfair-display mb-6">
                  Una Nueva Experiencia de Hospedaje
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Estamos trabajando en un nuevo concepto de hotel que combinará el confort moderno con la calidez caribeña. 
                  Nuestro hotel ofrecerá una experiencia única para los visitantes de la hermosa ciudad de Cartagena.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Ubicación privilegiada cerca de los principales atractivos</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Instalaciones modernas con toques de diseño local</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">Experiencias gastronómicas auténticas</p>
                  </li>
                </ul>
              </div>
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-dark-blue/20 flex items-center justify-center z-10">
                  <div className="bg-white/90 px-6 py-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-dark-blue">Apertura 2025</p>
                    <p className="text-gold">¡Mantente informado!</p>
                  </div>
                </div>
                <Image 
                  src="/hotel-placeholder.jpg" 
                  alt="Próximo Hotel en Cartagena" 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-xl"
                  onError={(e) => {
                    // Fallback para cuando la imagen no existe
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-dark-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair-display mb-6">
            Mantente Informado
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Sé el primero en recibir noticias sobre nuestro nuevo hotel, ofertas especiales de pre-apertura y eventos exclusivos.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button 
              onClick={() => window.location.href = 'https://wa.me/573164032039?text=Hola,%20me%20interesa%20recibir%20información%20sobre%20el%20nuevo%20hotel%20en%20Cartagena'}
              className="bg-gold text-dark-blue hover:bg-gold/90 px-8 py-3 text-lg w-full"
            >
              Contactar por WhatsApp
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Phone className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-blue mb-2">Teléfono</h3>
              <p className="text-gray-600">+57 316 403 2039</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Mail className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-blue mb-2">Email</h3>
              <p className="text-gray-600">info@mundovacacionalck.com</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <MapPin className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-blue mb-2">Ubicación</h3>
              <p className="text-gray-600">Cartagena, Colombia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-blue text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 Mundo Vacacional CK - Todos los derechos reservados
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Próximamente: Nueva experiencia hotelera en Cartagena
          </p>
        </div>
      </footer>
    </div>
  );
}