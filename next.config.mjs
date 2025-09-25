/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'], // ✅ Permite imágenes de Cloudinary
    formats: ['image/webp', 'image/avif'], // ✅ Formatos modernos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // ✅ Tamaños responsivos
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // ✅ Tamaños para iconos
    minimumCacheTTL: 60, // ✅ Cache de 1 minuto
    unoptimized: false, // ✅ Mantener optimización general
    dangerouslyAllowSVG: true, // ✅ Permitir SVG
    contentDispositionType: 'inline',
    loader: 'default',
    path: '/_next/image',
    // Configuración para excluir ciertos archivos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // ✅ Configuración para servir archivos estáticos sin procesamiento
  async rewrites() {
    return [
      {
        source: '/favi.ico',
        destination: '/favi.ico',
      },
    ];
  },
  // ✅ Configuración para headers de archivos estáticos
  async headers() {
    return [
      {
        source: '/favi.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'image/x-icon',
          },
        ],
      },
    ];
  },
}

export default nextConfig
