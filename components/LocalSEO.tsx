import React from 'react';

interface LocalBusinessData {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  telephone: string;
  email: string;
  url: string;
  priceRange: string;
  openingHours: string[];
  paymentAccepted: string[];
  currenciesAccepted: string;
  areaServed: string[];
  serviceType: string[];
}

interface LocalSEOProps {
  businessData: LocalBusinessData;
}

export default function LocalSEO({ businessData }: LocalSEOProps) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessData.url,
    "name": businessData.name,
    "description": businessData.description,
    "url": businessData.url,
    "telephone": businessData.telephone,
    "email": businessData.email,
    "priceRange": businessData.priceRange,
    "currenciesAccepted": businessData.currenciesAccepted,
    "paymentAccepted": businessData.paymentAccepted,
    "openingHours": businessData.openingHours,
    "areaServed": businessData.areaServed.map(area => ({
      "@type": "City",
      "name": area
    })),
    "serviceType": businessData.serviceType,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address.streetAddress,
      "addressLocality": businessData.address.addressLocality,
      "addressRegion": businessData.address.addressRegion,
      "postalCode": businessData.address.postalCode,
      "addressCountry": businessData.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": businessData.geo.latitude,
      "longitude": businessData.geo.longitude
    },
    "sameAs": [
      "https://www.facebook.com/mundovacacional",
      "https://www.instagram.com/mundovacacional"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Mundo Vacacional",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Alquiler de Apartamentos Vacacionales",
            "description": "Apartamentos completamente amoblados en las mejores zonas de Cartagena"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Transporte Premium",
            "description": "Servicio de transporte cómodo y seguro en Cartagena"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema, null, 2)
      }}
    />
  );
}