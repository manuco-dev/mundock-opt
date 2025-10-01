import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db/mongodb'
import Property from '@/lib/db/models/Property'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mundovacacional.com'
  
  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/apartamentos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotel`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/como-vamos`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  // Obtener propiedades dinámicas
  let dynamicPages: MetadataRoute.Sitemap = []
  
  try {
    await dbConnect()
    const properties = await Property.find({ isActive: true }).select('_id updatedAt').lean()
    
    dynamicPages = properties.map((property) => ({
      url: `${baseUrl}/apartamentos/${property._id}`,
      lastModified: property.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
  }

  return [...staticPages, ...dynamicPages]
}