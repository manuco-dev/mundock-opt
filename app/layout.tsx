import type React from "react"
import type { Metadata } from "next"
import {
  Playfair_Display,
  Lora,
} from "next/font/google"
import "./globals.css"
import GoogleAnalytics from '@/components/GoogleAnalytics'
import GoogleSearchConsole, { SEOMetaTags } from '@/components/GoogleSearchConsole'

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

export const metadata: Metadata = {
  title: {
    default: "Mundo Vacacional - Apartamentos y Transporte en Cartagena",
    template: "%s | Mundo Vacacional"
  },
  description: "Alquiler de apartamentos vacacionales y transporte premium en Cartagena de Indias, Colombia. Descubre tu escape perfecto con Mundo Vacacional - experiencias únicas e inolvidables en la ciudad amurallada.",
  keywords: [
    "apartamentos Cartagena",
    "alquiler vacacional Cartagena", 
    "transporte Cartagena",
    "hospedaje Cartagena",
    "vacaciones Cartagena",
    "apartamentos amoblados Cartagena",
    "turismo Cartagena",
    "alojamiento Cartagena",
    "apartamentos centro histórico Cartagena",
    "apartamentos Bocagrande Cartagena",
    "apartamentos ciudad amurallada",
    "hospedaje Bolívar Colombia",
    "turismo Costa Caribe Colombia"
  ],
  authors: [{ name: "Mundo Vacacional" }],
  creator: "Mundo Vacacional",
  publisher: "Mundo Vacacional",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mundovacacional.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Mundo Vacacional - Apartamentos y Transporte en Cartagena",
    description: "Alquiler de apartamentos vacacionales y transporte premium en Cartagena. Tu escape perfecto te espera.",
    url: 'https://mundovacacional.com',
    siteName: 'Mundo Vacacional',
    images: [
      {
        url: '/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Mundo Vacacional - Apartamentos en Cartagena',
      }
    ],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mundo Vacacional - Apartamentos y Transporte en Cartagena",
    description: "Alquiler de apartamentos vacacionales y transporte premium en Cartagena. Tu escape perfecto te espera.",
    images: ['/hero.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favi.ico",
    shortcut: "/favi.ico",
    apple: "/favi.ico",
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${lora.variable}`}
    >
      <head>
        <GoogleSearchConsole verificationCode="TU_CODIGO_GOOGLE_SEARCH_CONSOLE_AQUI" />
        <SEOMetaTags />
      </head>
      <body>
        <GoogleAnalytics 
          gaId="G-PRNSXXC93G" 
          gtmId="GTM-NR3TMF5R"
        />
        {children}
      </body>
    </html>
  )
}
