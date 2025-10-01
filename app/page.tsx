'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import PromotionBanners from '@/components/PromotionBanners';
import CustomerReviews from '@/components/CustomerReviews';

interface HeroImage {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'image' | 'video';
  isActive: boolean;
  order: number;
  createdAt: string;
}

import StructuredData from '@/components/StructuredData';
import LocalSEO from '@/components/LocalSEO';

export default function Home() {
  const localBusinessData = {
    name: "Mundo Vacacional",
    description: "Alquiler de apartamentos vacacionales y transporte premium en Cartagena. Tu escape perfecto te espera con experiencias únicas e inolvidables.",
    url: "https://mundovacacional.com",
    telephone: "+57 316 403 2039",
    email: "info@mundovacacional.com",
    address: {
      streetAddress: "Cartagena de Indias",
      addressLocality: "Cartagena",
      addressRegion: "Bolívar", 
      postalCode: "130001",
      addressCountry: "Colombia"
    },
    geo: {
      latitude: 10.3910,
      longitude: -75.4794
    },
    openingHours: [
      "Mo-Su 00:00-23:59"
    ],
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
    currenciesAccepted: "COP",
    areaServed: ["Cartagena", "Bolívar", "Colombia"],
    serviceType: ["Alquiler de Apartamentos Vacacionales", "Transporte Premium", "Servicios Turísticos"]
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentVanSlide, setCurrentVanSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroImage[]>([]);
  const [isLoadingHero, setIsLoadingHero] = useState(true);

  // Fallback hero slides data (si no hay imágenes en la BD)
  const fallbackHeroSlides = [
    {
      type: 'image' as const,
      src: '/hero.webp',
      alt: 'Cartagena Background'
    },
    {
      type: 'video' as const,
      src: '/media/video1.mov',
      alt: 'Video promocional Mundo Vacacional CK'
    }
  ];

  // Van slides data
  const vanSlides = [
    {
      src: '/media/carrovans.jpeg',
      alt: 'Van premium para transporte en Cartagena'
    },
    {
      src: '/media/carrovans2.jpeg',
      alt: 'Van de lujo para city tours'
    },
    {
      src: '/media/carrovans3.jpeg',
      alt: 'Transporte cómodo y seguro'
    },
    {
      src: '/media/carrovans4.jpeg',
      alt: 'Vans modernas para tu comodidad'
    }
  ];

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToHeroSlide = (index: number) => {
    setCurrentHeroSlide(index);
  };

  // Van carousel functions
  const nextVanSlide = () => {
    setCurrentVanSlide((prev) => (prev + 1) % vanSlides.length);
  };

  const prevVanSlide = () => {
    setCurrentVanSlide((prev) => (prev - 1 + vanSlides.length) % vanSlides.length);
  };

  const goToVanSlide = (index: number) => {
    setCurrentVanSlide(index);
  };

  // Cargar imágenes del hero desde la API
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images');
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setHeroSlides(data.images);
          }
        }
      } catch (error) {
        console.error('Error loading hero images:', error);
      } finally {
        setIsLoadingHero(false);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  // Usar slides de la BD o fallback
  const currentSlides = heroSlides.length > 0 ? heroSlides : fallbackHeroSlides;
  const totalSlides = currentSlides.length;

  return (
    <div className="min-h-screen bg-white">
      <StructuredData type="LocalBusiness" data={localBusinessData} />
      <LocalSEO businessData={localBusinessData} />
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md" data-aos="fade-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Image src="/logomundo.png" alt="Mundo Vacacional CK Logo" width={80} height={80} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-blue font-playfair-display">
                Mundo Vacacional CK
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <a href="#inicio" className="text-dark-blue hover:text-gold transition-colors font-medium text-lg">Inicio</a>
              <a href="/apartamentos" className="text-dark-blue hover:text-gold transition-colors font-medium text-lg">Apartamentos</a>
              <a href="#transporte" className="text-dark-blue hover:text-gold transition-colors font-medium text-lg">Transporte</a>
              <a href="/hotel" className="text-dark-blue hover:text-gold transition-colors font-medium text-lg">Hotel</a>
              <a href="#sobre-nosotros" className="text-dark-blue hover:text-gold transition-colors font-medium text-lg">Sobre Nosotros</a>
              <a href="#contacto" className="text-dark-blue hover:text-gold transition-colors font-medium text-lg">Contacto</a>
            </nav>
            
            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <a href="https://wa.me/573164032039?text=Hola,%20me%20interesa%20hacer%20una%20reserva%20en%20Mundo%20Vacacional%20CK" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-gold to-yellow-400 text-dark-blue font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Reservar Ahora
              </a>
            </div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-dark-blue hover:text-gold transition-colors p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                <a href="#inicio" className="block px-3 py-2 text-dark-blue hover:text-gold transition-colors font-medium border-t border-gray-100">Inicio</a>
                <a href="/apartamentos" className="block px-3 py-2 text-dark-blue hover:text-gold transition-colors font-medium border-t border-gray-100">Apartamentos</a>
                <a href="#transporte" className="block px-3 py-2 text-dark-blue hover:text-gold transition-colors font-medium border-t border-gray-100">Transporte</a>
                <a href="/hotel" className="block px-3 py-2 text-dark-blue hover:text-gold transition-colors font-medium border-t border-gray-100">Hotel</a>
                <a href="#sobre-nosotros" className="block px-3 py-2 text-dark-blue hover:text-gold transition-colors font-medium border-t border-gray-100">Sobre Nosotros</a>
                <a href="#contacto" className="block px-3 py-2 text-dark-blue hover:text-gold transition-colors font-medium border-t border-gray-100">Contacto</a>
                <div className="px-3 py-2 border-t border-gray-100">
                  <a href="https://wa.me/573164032039?text=Hola,%20me%20interesa%20hacer%20una%20reserva%20en%20Mundo%20Vacacional%20CK" target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-gold to-yellow-400 text-dark-blue font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 block text-center">
                    Reservar Ahora
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-16 lg:pt-20">
        <div className="absolute inset-0 z-0">
          {!isLoadingHero && currentSlides.length > 0 && (
            heroSlides.length > 0 ? (
              // Imágenes de la base de datos
              currentSlides[currentHeroSlide].type === 'image' ? (
                <Image 
                  src={'url' in currentSlides[currentHeroSlide] ? currentSlides[currentHeroSlide].url : currentSlides[currentHeroSlide].src} 
                  alt={'originalName' in currentSlides[currentHeroSlide] ? currentSlides[currentHeroSlide].originalName : currentSlides[currentHeroSlide].alt} 
                  layout="fill" 
                  objectFit="cover" 
                  className="brightness-50 transition-opacity duration-500" 
                />
              ) : (
                <video 
                  src={'url' in currentSlides[currentHeroSlide] ? currentSlides[currentHeroSlide].url : currentSlides[currentHeroSlide].src}
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover brightness-50 transition-opacity duration-500"
                />
              )
            ) : (
              // Imágenes fallback
              fallbackHeroSlides[currentHeroSlide].type === 'image' ? (
                <Image 
                  src={fallbackHeroSlides[currentHeroSlide].src} 
                  alt={fallbackHeroSlides[currentHeroSlide].alt} 
                  layout="fill" 
                  objectFit="cover" 
                  className="brightness-50 transition-opacity duration-500" 
                />
              ) : (
                <video 
                  src={fallbackHeroSlides[currentHeroSlide].src}
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover brightness-50 transition-opacity duration-500"
                />
              )
            )
          )}
          {isLoadingHero && (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-xl">Cargando...</div>
            </div>
          )}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevHeroSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextHeroSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Siguiente slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {currentSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHeroSlide 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-playfair-display mb-4 sm:mb-6 lg:mb-8" data-aos="fade-up">
            Tu estadía soñada, <span className="text-yellow-400">fácil y segura</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Descubre tu próximo refugio en Cartagena. Apartamentos y casas fincas únicos diseñados para crear experiencias inolvidables.
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-200" data-aos="fade-up" data-aos-delay="400">
            ¡Bienvenido a tu escapada perfecta donde cada momento se convierte en un recuerdo especial!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-10 lg:mt-12" data-aos="fade-up" data-aos-delay="600">
            <a href="/apartamentos" className="bg-gradient-to-r from-gold to-yellow-400 text-dark-blue font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg">
              Ver Apartamentos
            </a>
            <a href="#transporte" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl hover:bg-white/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg">
              Reservar Van
            </a>
          </div>
        </div>
      </section>

      {/* Promotion Banners Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PromotionBanners autoSlideInterval={6000} />
        </div>
      </section>

      {/* Mundo Vacacional CK Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair-display text-slate-800 mb-3 tracking-tight">
              Mundo Vacacional CK
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light font-playfair-display text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text mb-6">
              Tu Escape Perfecto en Cartagena
            </h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mb-8"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Descubre la magia de Cartagena con nuestros apartamentos exclusivos, casas finca con piscina y servicios de transporte premium
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Images Collage */}
            <div className="grid grid-cols-3 gap-3" data-aos="fade-right">
              {/* Primera fila */}
              <div className="relative h-32 sm:h-40 lg:h-48 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/media/apto1.jpeg" 
                  alt="Apartamento elegante - Mundo Vacacional CK" 
                  layout="fill" 
                  objectFit="cover" 
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-32 sm:h-40 lg:h-48 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/media/apto 2.jpeg" 
                  alt="Habitación confortable - Mundo Vacacional CK" 
                  layout="fill" 
                  objectFit="cover" 
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-32 sm:h-40 lg:h-48 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/media/apto3.jpeg" 
                  alt="Espacio moderno - Mundo Vacacional CK" 
                  layout="fill" 
                  objectFit="cover" 
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Segunda fila */}
              <div className="col-span-2 relative h-24 sm:h-32 lg:h-40 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/media/casafinca1.jpeg" 
                  alt="Casa finca con piscina - Mundo Vacacional CK" 
                  layout="fill" 
                  objectFit="cover" 
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-24 sm:h-32 lg:h-40 rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/media/casafinca2.jpeg" 
                  alt="Área de descanso - Casa finca" 
                  layout="fill" 
                  objectFit="cover" 
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            {/* Content */}
            <div data-aos="fade-left" data-aos-delay="200">
              <div className="bg-gradient-to-br from-blue-50 to-gold/10 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="bg-dark-blue text-white px-4 py-2 rounded-lg mr-4">
                    <span className="font-bold text-lg">Wow!</span>
                  </div>
                  <div className="text-gold text-2xl">⭐⭐⭐⭐⭐</div>
                </div>
                
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                  Descubre la experiencia única de Mundo Vacacional CK. Nuestros apartamentos y casas finca con piscina te ofrecen la comodidad de un hogar con la emoción de unas vacaciones perfectas en Cartagena. Cada espacio está diseñado para crear momentos inolvidables con vistas espectaculares y ambientes que combinan elegancia y calidez.
                </p>
                <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
                  Nuestro servicio de alquiler de vans te permite explorar Cartagena con total libertad. Desde las murallas coloniales hasta las playas paradisíacas, viaja con estilo y descubre los paisajes más hermosos del Caribe colombiano. Con nosotros inviertes en experiencias inolvidables.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://wa.me/573164032039?text=Hola,%20me%20interesa%20información%20sobre%20los%20apartamentos,%20casas%20finca%20con%20piscina%20y%20vans%20de%20Mundo%20Vacacional%20CK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-dark-blue font-bold py-3 px-6 sm:px-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Más Información
                  </a>
                  <a 
                    href="https://wa.me/573164032039?text=Hola,%20quiero%20reservar%20apartamento,%20casa%20finca%20con%20piscina%20y/o%20van%20con%20Mundo%20Vacacional%20CK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-dark-blue text-dark-blue font-bold py-3 px-6 sm:px-8 rounded-xl hover:bg-dark-blue hover:text-white transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Reservar Ahora
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transport Section */}
      <section id="transporte" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-playfair-display text-dark-blue mb-4">Transporte Premium a tu Medida</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Viaja con comodidad y estilo por toda Cartagena</p>
          </div>
          
          {/* Van Carousel */}
          <div className="mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={vanSlides[currentVanSlide].src} 
                  alt={vanSlides[currentVanSlide].alt} 
                  fill
                  className="object-cover transition-all duration-500"
                />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevVanSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextVanSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {vanSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToVanSlide(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentVanSlide ? 'bg-gold scale-125' : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto" data-aos="fade-up">
            <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">
              Disfruta de un servicio de transporte exclusivo, cómodo y seguro para cada uno de tus trayectos. Contamos con vehículos modernos, con aire acondicionado y todas las comodidades para que tu experiencia sea placentera desde el primer momento.
            </p>
            
            <h3 className="text-xl sm:text-2xl font-bold text-dark-blue mb-6">Ofrecemos:</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <span className="text-gold text-lg flex-shrink-0 mt-0.5">✓</span>
                <p className="text-gray-700">Traslados desde y hacia el aeropuerto.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-gold text-lg flex-shrink-0 mt-0.5">✓</span>
                <p className="text-gray-700">Transporte privado para recorridos en Cartagena y alrededores.</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-gold text-lg flex-shrink-0 mt-0.5">✓</span>
                <p className="text-gray-700">Viajes personalizados a nivel nacional, para que llegues a tu destino en total tranquilidad.</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed font-medium">
              Nuestro compromiso es brindarte puntualidad, confort y la mejor atención en cada viaje.
            </p>
            
            <div className="flex justify-center">
              <a 
                href="https://wa.me/573164032039?text=Hola,%20me%20interesa%20el%20servicio%20de%20transporte%20premium%20con%20Mundo%20Vacacional%20CK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-gold to-yellow-400 text-dark-blue font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-block text-center"
              >
                Solicitar Información
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* About Us Section */}
      <section id="sobre-nosotros" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-playfair-display text-dark-blue mb-4">Sobre Nosotros</h2>
              <h3 className="text-xl sm:text-2xl font-bold text-dark-blue mb-4">Tu Mejor Opción en Cartagena</h3>
              <p className="text-gray-600 mb-4 text-base sm:text-lg leading-relaxed">
                En MundovacacionalCk creemos que las mejores experiencias comienzan con un lugar acogedor donde descansar. Nos especializamos en ofrecer apartamentos turísticos en la ciudad de Cartagena, diseñados para brindar comodidad, limpieza y una atención cercana.
              </p>
              {showFullAbout && (
                <div className="transition-all duration-500 ease-in-out">
                  <p className="text-gray-600 mb-4 text-base sm:text-lg leading-relaxed">
                    Nuestro propósito es que cada huésped disfrute de vacaciones inolvidables en la costa, combinando hospitalidad, tranquilidad y espacios equipados para sentirse como en casa.
                  </p>
                  <p className="text-gray-600 mb-4 text-base sm:text-lg leading-relaxed">
                    Ponemos el corazón en cada detalle: desde la calidez en el servicio hasta la preparación de cada apartamento, porque sabemos que viajar es más que hospedarse: es vivir momentos únicos y especiales.
                  </p>
                </div>
              )}
              <button 
                onClick={() => setShowFullAbout(!showFullAbout)}
                className="inline-block bg-gradient-to-r from-gold to-yellow-400 text-dark-blue font-bold py-3 px-6 sm:px-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-4 sm:mb-6"
              >
                {showFullAbout ? 'Mostrar Menos' : 'Conoce Más'}
              </button>
            </div>
            <div className="relative h-64 sm:h-80 lg:h-96" data-aos="fade-left" data-aos-delay="200">
              <Image src="/family_pool.webp" alt="familia disfrutando en resort - Mundo Vacacional CK" layout="fill" objectFit="cover" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-playfair-display text-dark-blue mb-4">Contáctanos</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Estamos aquí para hacer realidad tu experiencia perfecta</p>
            <p className="text-base sm:text-lg text-gold font-semibold">⚡ Respondemos en menos de 10 minutos</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center" data-aos="fade-right" data-aos-delay="200">
              <div className="mb-6">
                <Image 
                  src="/media/asistente_vacacional_cartagena.webp" 
                  alt="Asistente Vacacional Cartagena" 
                  width={300} 
                  height={300} 
                  className="rounded-2xl shadow-lg w-full max-w-xs"
                />
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-dark-blue mb-2">¡Hablemos por WhatsApp!</h3>
                <p className="text-gray-600 mb-4">Nuestro asistente virtual está listo para ayudarte</p>
              </div>
              <a 
                href="https://wa.me/573164032039?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20de%20hospedaje%20en%20Cartagena" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Chatear en WhatsApp
              </a>
            </div>
            <div className="space-y-6 lg:space-y-8" data-aos="fade-left" data-aos-delay="400">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-dark-blue mb-4 sm:mb-6">Información de Contacto</h3>
                <div className="bg-gradient-to-r from-gold/10 to-yellow-100 border border-gold/20 rounded-lg p-3 mb-4">
                  <div className="text-dark-blue font-semibold text-center text-sm sm:text-base">
                    <p className="mb-1">🕒 Horario de Atención:</p>
                    <p className="text-xs sm:text-sm">Lunes a Viernes: 8:00 AM - 8:00 PM</p>
                    <p className="text-xs sm:text-sm">Sábados: 8:00 AM - 6:00 PM</p>
                    <p className="text-xs sm:text-sm">Domingos: 8:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-600 flex items-center text-sm sm:text-base"><span className="mr-3 text-gold text-lg">📞</span>+57 316 403 2039</p>
                  <p className="text-gray-600 flex items-center text-sm sm:text-base"><span className="mr-3 text-gold text-lg">✉️</span>mundovacacionalck@gmail.com</p>
                  <p className="text-gray-600 flex items-center text-sm sm:text-base"><span className="mr-3 text-gold text-lg">📍</span>Transversal 47 calle 22 #21-45 barrio la campiña, 130014 Cartagena de Indias</p>
                </div>
              </div>
              <div className="h-48 sm:h-56 lg:h-64 rounded-2xl shadow-xl overflow-hidden">
                <iframe 
                  src="https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Mundo Vacacional CK"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-b from-dark-blue to-black text-white py-12 sm:py-16" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 lg:col-span-1" data-aos="fade-up" data-aos-delay="200">
              <Image src="/logomundo.png" alt="Mundo Vacacional CK Logo" width={120} height={120} className="mb-4 w-20 h-20 sm:w-24 sm:h-24 lg:w-30 lg:h-30" />
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">Tu mejor opción para hospedaje y transporte premium en Cartagena</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <h4 className="text-gold font-bold mb-4 sm:mb-6 text-base sm:text-lg">Enlaces Rápidos</h4>
              <ul className="space-y-2 sm:space-y-3">
                <li><a href="#inicio" className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base">Inicio</a></li>
                <li><a href="/apartamentos" className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base">Apartamentos</a></li>
                <li><a href="#transporte" className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base">Transporte</a></li>
                <li><a href="#hotel" className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base">Hotel</a></li>
                <li><a href="#sobre-nosotros" className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base">Sobre Nosotros</a></li>
                <li><a href="#contacto" className="text-gray-300 hover:text-gold transition-colors text-sm sm:text-base">Contacto</a></li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="600">
              <h4 className="text-gold font-bold mb-4 sm:mb-6 text-base sm:text-lg">Contacto</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-300">
                <li className="text-sm sm:text-base">📞 +57 316 403 2039</li>
                <li className="text-sm sm:text-base">✉️ mundovacacionalck@gmail.com</li>
                <li className="text-sm sm:text-base">📍 Transversal 47 calle 22 #21-45 barrio la campiña, 130014 Cartagena de Indias</li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="800">
              <h4 className="text-gold font-bold mb-4 sm:mb-6 text-base sm:text-lg">Síguenos</h4>
              <div className="flex space-x-3 sm:space-x-4">
                <a href="#" className="bg-white/10 hover:bg-gold hover:text-dark-blue p-2 sm:p-3 rounded-full transition-all duration-300 flex items-center justify-center">
                  <Image src="/media/facebook-icon.svg" alt="Facebook" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="https://www.instagram.com/mundovacacionalck?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-gold hover:text-dark-blue p-2 sm:p-3 rounded-full transition-all duration-300 flex items-center justify-center">
                  <Image src="/media/instragram-icon.jpg" alt="Instagram" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 rounded" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">© 2025 Mundo Vacacional. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Premium WhatsApp Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <a href="https://wa.me/573164032039" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 sm:p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.254 4.587 4.82-1.261z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}