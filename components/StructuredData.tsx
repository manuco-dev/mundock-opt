import React from 'react';

interface LocalBusinessData {
  name: string;
  description: string;
  url: string;
  telephone?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
}

interface PropertyData {
  id: string;
  name: string;
  description: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  hasPool?: boolean;
  isFurnished?: boolean;
  type: 'apartment' | 'country_house';
  address?: string;
}

interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

interface StructuredDataProps {
  type: 'LocalBusiness' | 'LodgingBusiness' | 'Product' | 'Review';
  data: LocalBusinessData | PropertyData | ReviewData;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateLocalBusinessSchema = (businessData: LocalBusinessData) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://mundovacacional.com/#organization",
    "name": businessData.name,
    "description": businessData.description,
    "url": businessData.url,
    "telephone": businessData.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address.streetAddress,
      "addressLocality": businessData.address.addressLocality,
      "addressRegion": businessData.address.addressRegion,
      "addressCountry": businessData.address.addressCountry
    },
    "geo": businessData.geo ? {
      "@type": "GeoCoordinates",
      "latitude": businessData.geo.latitude,
      "longitude": businessData.geo.longitude
    } : undefined,
    "openingHours": businessData.openingHours,
    "priceRange": businessData.priceRange,
    "sameAs": [
      "https://www.facebook.com/mundovacacional",
      "https://www.instagram.com/mundovacacional"
    ]
  });

  const generateLodgingBusinessSchema = (propertyData: PropertyData) => ({
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `https://mundovacacional.com/apartamentos/${propertyData.id}`,
    "name": propertyData.name,
    "description": propertyData.description,
    "url": `https://mundovacacional.com/apartamentos/${propertyData.id}`,
    "image": propertyData.images,
    "address": propertyData.address ? {
      "@type": "PostalAddress",
      "addressLocality": "Cartagena",
      "addressRegion": "Bolívar",
      "addressCountry": "Colombia"
    } : undefined,
    "amenityFeature": [
      ...(propertyData.hasPool ? [{
        "@type": "LocationFeatureSpecification",
        "name": "Piscina",
        "value": true
      }] : []),
      ...(propertyData.isFurnished ? [{
        "@type": "LocationFeatureSpecification", 
        "name": "Amoblado",
        "value": true
      }] : []),
      {
        "@type": "LocationFeatureSpecification",
        "name": "Habitaciones",
        "value": propertyData.bedrooms
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Baños", 
        "value": propertyData.bathrooms
      }
    ],
    "accommodationCategory": propertyData.type === 'apartment' ? 'Apartamento' : 'Casa Finca'
  });

  const generateReviewSchema = (reviewData: ReviewData) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": reviewData.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewData.rating,
      "bestRating": 5
    },
    "reviewBody": reviewData.reviewBody,
    "datePublished": reviewData.datePublished,
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": "Mundo Vacacional",
      "url": "https://mundovacacional.com"
    }
  });

  const getStructuredData = () => {
    switch (type) {
      case 'LocalBusiness':
        return generateLocalBusinessSchema(data as LocalBusinessData);
      case 'LodgingBusiness':
        return generateLodgingBusinessSchema(data as PropertyData);
      case 'Review':
        return generateReviewSchema(data as ReviewData);
      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}