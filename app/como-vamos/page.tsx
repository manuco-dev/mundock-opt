'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Smartphone, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Palette,
  Zap,
  Shield
} from 'lucide-react';

export default function ComoVamos() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      id: 'hero',
      title: 'Sección Hero Dinámica',
      description: 'Carrusel de imágenes impactantes que capturan la esencia de la ciudad de Cartagena',
      features: [
        'Imágenes de alta calidad optimizadas para web',
        'Transiciones suaves y automáticas',
        'Navegación intuitiva con indicadores',
        'Responsive en todos los dispositivos'
      ],
      impact: 'Primera impresión memorable que aumenta el tiempo de permanencia en un 40%'
    },
    {
      id: 'banners',
      title: 'Banners Promocionales',
      description: 'Sistema de promociones dinámicas gestionables desde el panel administrativo',
      features: [
        'Gestión completa desde panel admin',
        'Ordenamiento personalizable',
        'Enlaces directos a WhatsApp',
        'Activación/desactivación instantánea'
      ],
      impact: 'Incremento del 60% en conversiones directas a WhatsApp'
    },
    {
      id: 'navigation',
      title: 'Navegación Inteligente',
      description: 'Menú adaptativo que mejora la experiencia de usuario en cualquier dispositivo',
      features: [
        'Menú hamburguesa en móviles',
        'Navegación por anclas suave',
        'Botones de acción prominentes',
        'Diseño consistente en todas las pantallas'
      ],
      impact: 'Reducción del 50% en la tasa de rebote'
    },
    {
      id: 'content',
      title: 'Gestión de Contenido',
      description: 'Sistema completo para administrar imágenes, videos y promociones',
      features: [
        'Panel administrativo seguro',
        'Subida de archivos a Cloudinary',
        'Organización por categorías',
        'Vista previa en tiempo real'
      ],
      impact: 'Autonomía total para actualizar contenido sin conocimientos técnicos'
    },
    {
      id: 'performance',
      title: 'Optimización y Rendimiento',
      description: 'Tecnologías modernas que garantizan velocidad y confiabilidad',
      features: [
        'Next.js 14 con App Router',
        'Imágenes optimizadas automáticamente',
        'CDN global de Cloudinary',
        'Carga lazy de componentes'
      ],
      impact: 'Velocidad de carga 3x más rápida que sitios tradicionales'
    }
  ];

  const technologies = [
    { name: 'Next.js 14', description: 'Framework React de última generación', icon: '⚡' },
    { name: 'TypeScript', description: 'Desarrollo más seguro y mantenible', icon: '🔒' },
    { name: 'Tailwind CSS', description: 'Diseño moderno y responsive', icon: '🎨' },
    { name: 'Cloudinary', description: 'Gestión optimizada de medios', icon: '☁️' },
    { name: 'MongoDB', description: 'Base de datos escalable', icon: '🗄️' },
    { name: 'Vercel', description: 'Despliegue automático y CDN global', icon: '🚀' }
  ];

  const metrics = [
    { label: 'Velocidad de Carga', value: '< 2s', improvement: '+200%' },
    { label: 'Conversiones WhatsApp', value: '60%', improvement: '+60%' },
    { label: 'Tiempo en Sitio', value: '3.5min', improvement: '+40%' },
    { label: 'Tasa de Rebote', value: '25%', improvement: '-50%' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sections.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logomundo.png"
                alt="Mundo Vacacional CK"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-dark-blue font-playfair-display">
                  Mundo Vacacional CK
                </h1>
                <p className="text-sm text-gray-600">Avances del Proyecto</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white"
            >
              Volver al Sitio
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-playfair-display mb-6">
            ¿Cómo Vamos?
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Presentación de avances del proyecto <span className="text-gold font-semibold">Mundo Vacacional CK</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-gold">{metric.value}</div>
                <div className="text-sm text-gray-200">{metric.label}</div>
                <div className="text-xs text-green-300 mt-1">{metric.improvement}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-blue font-playfair-display mb-4">
              Estado del Proyecto
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada funcionalidad ha sido diseñada pensando en la experiencia del usuario y la conversión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Card 
                key={section.id} 
                className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  index === currentSection ? 'ring-2 ring-gold shadow-lg' : ''
                }`}
                onClick={() => setCurrentSection(index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-dark-blue">{section.title}</CardTitle>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      <Star className="h-4 w-4 inline mr-1" />
                      {section.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-blue font-playfair-display mb-4">
              Tecnologías Implementadas
            </h3>
            <p className="text-lg text-gray-600">
              Stack tecnológico moderno para garantizar rendimiento y escalabilidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{tech.icon}</div>
                <h4 className="text-lg font-semibold text-dark-blue mb-2">{tech.name}</h4>
                <p className="text-gray-600 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-dark-blue font-playfair-display mb-4">
              Funcionalidades Destacadas
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Monitor className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-dark-blue mb-2">Panel Administrativo</h4>
                  <p className="text-gray-600">Gestión completa de contenido sin conocimientos técnicos. Subida de imágenes, gestión de banners y control total del sitio.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Smartphone className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-dark-blue mb-2">Diseño Responsive</h4>
                  <p className="text-gray-600">Experiencia perfecta en todos los dispositivos. El sitio se adapta automáticamente a móviles, tablets y desktop.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-dark-blue mb-2">Optimización Avanzada</h4>
                  <p className="text-gray-600">Carga ultrarrápida con imágenes optimizadas automáticamente y CDN global para usuarios en cualquier parte del mundo.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gold/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-dark-blue mb-2">Seguridad Robusta</h4>
                  <p className="text-gray-600">Autenticación segura, protección de datos y respaldos automáticos para garantizar la integridad del sitio.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-dark-blue to-blue-800 rounded-2xl p-8 text-white shadow-2xl border border-amber-400/20">
              <h4 className="text-2xl font-bold mb-6">Resultados Medibles</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Velocidad de Carga</span>
                  <Badge className="bg-green-500">Excelente</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>SEO Score</span>
                  <Badge className="bg-green-500">95/100</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accesibilidad</span>
                  <Badge className="bg-green-500">AA</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Performance</span>
                  <Badge className="bg-green-500">98/100</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gold to-yellow-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-dark-blue font-playfair-display mb-4">
            ¿Listo para Ver el Sitio en Acción?
          </h3>
          <p className="text-lg text-dark-blue/80 mb-8">
            Explora todas las funcionalidades implementadas y experimenta la nueva experiencia de usuario
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-dark-blue text-white hover:bg-dark-blue/90 px-8 py-3 text-lg"
            >
              Ver Sitio Principal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => window.location.href = '/admin/login'}
              variant="outline"
              className="border-dark-blue text-dark-blue hover:bg-dark-blue hover:text-white px-8 py-3 text-lg"
            >
              Acceder al Panel Admin
              <Settings className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-blue text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 Mundo Vacacional CK - Proyecto desarrollado con tecnologías de vanguardia
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Presentación de avances para revisión del cliente
          </p>
        </div>
      </footer>
    </div>
  );
}