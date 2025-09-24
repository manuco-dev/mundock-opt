'use client';

import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
  className?: string;
}

// Coordenadas por defecto para Cartagena, Colombia
const DEFAULT_CENTER = { lat: 10.3910, lng: -75.4794 };
const DEFAULT_ZOOM = 12;

export default function GoogleMap({ 
  center = DEFAULT_CENTER, 
  zoom = DEFAULT_ZOOM, 
  markers = [], 
  className = "w-full h-96" 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      // Crear el mapa
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Crear InfoWindow
      infoWindowRef.current = new window.google.maps.InfoWindow();

      // Limpiar marcadores existentes
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Agregar marcadores
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map: mapInstanceRef.current,
          title: markerData.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#D4AF37" stroke="#1e3a8a" stroke-width="2"/>
                <circle cx="16" cy="16" r="6" fill="#1e3a8a"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16)
          }
        });

        // Agregar evento click para mostrar información
        if (markerData.info) {
          marker.addListener('click', () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1e3a8a;">${markerData.title}</h3>
                  <p style="margin: 0; color: #666;">${markerData.info}</p>
                </div>
              `);
              infoWindowRef.current.open(mapInstanceRef.current, marker);
            }
          });
        }

        markersRef.current.push(marker);
      });

      // Ajustar el mapa para mostrar todos los marcadores si hay más de uno
      if (markers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.position));
        mapInstanceRef.current.fitBounds(bounds);
      }
    };

    // Verificar si Google Maps ya está cargado
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Cargar Google Maps API si no está disponible
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      // Limpiar marcadores al desmontar
      markersRef.current.forEach(marker => marker.setMap(null));
    };
  }, [center, zoom, markers]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
}

// Declaración de tipos para Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}