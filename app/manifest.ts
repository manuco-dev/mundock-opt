import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mundo Vacacional - Apartamentos en Cartagena',
    short_name: 'Mundo Vacacional',
    description: 'Alquiler de apartamentos vacacionales y transporte premium en Cartagena',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e3a8a',
    theme_color: '#fbbf24',
    icons: [
      {
        src: '/favi.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logomundo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logomundo.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
    categories: ['travel', 'lifestyle', 'business'],
    lang: 'es',
    orientation: 'portrait-primary',
    scope: '/',
    id: 'mundo-vacacional-cartagena'
  }
}