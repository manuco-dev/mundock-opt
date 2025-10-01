'use client';

import React from 'react';
import GoogleMap from './GoogleMap';
import { IProperty } from '@/lib/db/models/Property';

interface PropertiesMapProps {
  properties: IProperty[];
  className?: string;
}

// Coordenadas predefinidas para ubicaciones comunes en Cartagena
const LOCATION_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  'Bocagrande': { lat: 10.3956, lng: -75.5519 },
  'El Laguito': { lat: 10.3889, lng: -75.5547 },
  'Castillogrande': { lat: 10.3925, lng: -75.5486 },
  'Manga': { lat: 10.4089, lng: -75.5347 },
  'Centro Histórico': { lat: 10.4236, lng: -75.5478 },
  'Ciudad Amurallada': { lat: 10.4236, lng: -75.5478 },
  'Getsemaní': { lat: 10.4197, lng: -75.5456 },
  'La Matuna': { lat: 10.4158, lng: -75.5419 },
  'Pie de la Popa': { lat: 10.4047, lng: -75.5264 },
  'Crespo': { lat: 10.4139, lng: -75.5297 },
  'Marbella': { lat: 10.3833, lng: -75.5333 },
  'El Cabrero': { lat: 10.4000, lng: -75.5400 },
  'San Diego': { lat: 10.4200, lng: -75.5450 },
  'Cartagena': { lat: 10.3910, lng: -75.4794 }, // Coordenada general
};

// Función para obtener coordenadas basadas en la ubicación
function getCoordinatesFromLocation(location: string): { lat: number; lng: number } {
  // Buscar coincidencia exacta
  if (LOCATION_COORDINATES[location]) {
    return LOCATION_COORDINATES[location];
  }
  
  // Buscar coincidencia parcial (case insensitive)
  const locationLower = location.toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (locationLower.includes(key.toLowerCase()) || key.toLowerCase().includes(locationLower)) {
      return coords;
    }
  }
  
  // Si no se encuentra, usar coordenadas generales de Cartagena
  return LOCATION_COORDINATES['Cartagena'];
}

export default function PropertiesMap({ properties, className = "w-full h-96" }: PropertiesMapProps) {
  // Convertir propiedades a marcadores
  const markers = properties
    .filter(property => property.isActive)
    .map(property => {
      const coordinates = getCoordinatesFromLocation(property.location);
      
      return {
        position: coordinates,
        title: property.title,
        info: `
          <strong>${property.title}</strong><br/>
          📍 ${property.location}<br/>
          🛏️ ${property.bedrooms} habitaciones<br/>
          🚿 ${property.bathrooms} baños<br/>
          💰 $${property.price.toLocaleString('es-CO')} COP/noche
          ${property.hasPool ? '<br/>🏊‍♂️ Piscina' : ''}
        `
      };
    });

  return (
    <div className={className}>
      <GoogleMap 
        markers={markers}
        className="w-full h-full"
      />
    </div>
  );
}

// Exportar también las coordenadas para uso en otros componentes
export { LOCATION_COORDINATES, getCoordinatesFromLocation };