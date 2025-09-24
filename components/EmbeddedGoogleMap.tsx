'use client';

import React from 'react';

interface EmbeddedGoogleMapProps {
  googleMapUrl: string;
  title?: string;
  className?: string;
}

// Función para extraer la URL de embed de diferentes formatos de Google Maps
export function extractEmbedUrl(url: string): string | null {
  if (!url || url.trim() === '') {
    return null;
  }

  // Limpiar la URL
  const cleanUrl = url.trim();

  // Si ya es una URL de embed válida, devolverla tal como está
  if (cleanUrl.includes('/embed') && cleanUrl.includes('google.com/maps')) {
    return cleanUrl;
  }

  // Si ya tiene el parámetro output=embed, es una URL de embed válida
  if (cleanUrl.includes('output=embed') && cleanUrl.includes('google.com/maps')) {
    return cleanUrl;
  }

  // Si es una URL de iframe src (extraer solo la URL)
  const iframeSrcMatch = cleanUrl.match(/src=["']([^"']+)["']/);
  if (iframeSrcMatch) {
    const extractedUrl = iframeSrcMatch[1];
    if (extractedUrl.includes('google.com/maps') && (extractedUrl.includes('/embed') || extractedUrl.includes('output=embed'))) {
      return extractedUrl;
    }
  }

  // Priorizar siempre el formato maps.google.com con output=embed
  if (cleanUrl.includes('google.com/maps') || cleanUrl.includes('maps.google.com')) {
    // Extraer coordenadas del formato @lat,lng
    const coordsMatch = cleanUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      const lat = coordsMatch[1];
      const lng = coordsMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Extraer coordenadas de los parámetros 3d (formato alternativo)
    const coords3dMatch = cleanUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (coords3dMatch) {
      const lat = coords3dMatch[1];
      const lng = coords3dMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Extraer coordenadas del parámetro q= (formato q=lat,lng)
    const qCoordsMatch = cleanUrl.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qCoordsMatch) {
      const lat = qCoordsMatch[1];
      const lng = qCoordsMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Extraer place_id o nombre del lugar
    const placeMatch = cleanUrl.match(/place\/([^/]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Extraer coordenadas de URLs con formato ll= (latitud,longitud)
    const llMatch = cleanUrl.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
      const lat = llMatch[1];
      const lng = llMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Si no encontramos coordenadas específicas pero es una URL válida de Google Maps
    // intentar extraer cualquier información de ubicación disponible
    const generalLocationMatch = cleanUrl.match(/[?&]q=([^&]+)/);
    if (generalLocationMatch) {
      const location = decodeURIComponent(generalLocationMatch[1].replace(/\+/g, ' '));
      return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }
  
  // Si es una URL corta de goo.gl, no podemos procesarla directamente
  if (cleanUrl.includes('goo.gl/maps')) {
    return null;
  }
  
  // Si no podemos procesar la URL, devolver null
  return null;
}

export default function EmbeddedGoogleMap({ 
  googleMapUrl, 
  title = "Ubicación de la propiedad", 
  className = "w-full h-64 md:h-80" 
}: EmbeddedGoogleMapProps) {
  if (!googleMapUrl) {
    return null;
  }

  const embedUrl = extractEmbedUrl(googleMapUrl);
  
  // Modo de depuración - mostrar información de la URL procesada
  console.log('🗺️ Debug Google Maps:');
  console.log('URL original:', googleMapUrl);
  console.log('URL de embed generada:', embedUrl);

  // Si no podemos generar una URL de embed válida, mostrar mensaje informativo
  if (!embedUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300`}>
        <div className="text-center p-6">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2 font-medium">Vista previa no disponible</p>
          <p className="text-gray-500 text-sm mb-2">
            Para mostrar el mapa, ingresa una URL válida de Google Maps o el código iframe de embed
          </p>
          <details className="text-xs text-gray-400 mb-4">
            <summary className="cursor-pointer hover:text-gray-600">🔍 Ver URL procesada</summary>
            <div className="mt-2 p-2 bg-gray-50 rounded text-left break-all">
              <strong>URL original:</strong><br/>
              {googleMapUrl}
            </div>
          </details>
          <GoogleMapLink 
            googleMapUrl={googleMapUrl}
            title="Ver ubicación en Google Maps"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="rounded-lg shadow-md"
      />
      {/* Información de depuración - solo visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2 text-xs text-gray-400">
          <summary className="cursor-pointer hover:text-gray-600">🔍 Info de depuración</summary>
          <div className="mt-1 p-2 bg-gray-50 rounded text-left break-all">
            <div><strong>URL original:</strong> {googleMapUrl}</div>
            <div className="mt-1"><strong>URL de embed:</strong> {embedUrl}</div>
          </div>
        </details>
      )}
    </div>
  );
}

// Componente alternativo que muestra un enlace si el iframe no funciona
export function GoogleMapLink({ googleMapUrl, title = "Ver en Google Maps" }: { googleMapUrl: string; title?: string }) {
  if (!googleMapUrl) {
    return null;
  }

  return (
    <a 
      href={googleMapUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      {title}
    </a>
  );
}