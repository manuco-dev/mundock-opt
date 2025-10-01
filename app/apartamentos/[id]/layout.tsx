import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredData from '@/components/StructuredData';

interface Property {
  _id: string;
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

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/properties/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  
  if (!property) {
    return {
      title: 'Apartamento no encontrado - Mundo Vacacional',
      description: 'El apartamento que buscas no está disponible.'
    };
  }

  const title = `${property.name} - Mundo Vacacional`;
  const description = property.description.length > 160 
    ? property.description.substring(0, 157) + '...'
    : property.description;

  const images = property.images.length > 0 
    ? property.images.slice(0, 4)
    : ['/images/default-property.jpg'];

  return {
    title,
    description,
    keywords: `apartamento, ${property.name}, ${property.bedrooms} habitaciones, ${property.bathrooms} baños, ${property.hasPool ? 'piscina' : ''}, ${property.isFurnished ? 'amoblado' : ''}, ${property.type === 'apartment' ? 'apartamento' : 'casa campestre'}`,
    openGraph: {
      title,
      description,
      images: images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: property.name
      })),
      url: `https://mundovacacional.com/apartamentos/${id}`,
      siteName: 'Mundo Vacacional',
      locale: 'es_CO',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images
    },
    alternates: {
      canonical: `https://mundovacacional.com/apartamentos/${id}`
    }
  };
}

export default async function PropertyLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  
  if (!property) {
    notFound();
  }

  const structuredData = {
    id: property._id,
    name: property.name,
    description: property.description,
    images: property.images,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    hasPool: property.hasPool,
    isFurnished: property.isFurnished,
    type: property.type,
    address: property.address
  };

  return (
    <>
      <StructuredData type="LodgingBusiness" data={structuredData} />
      {children}
    </>
  );
}