import React from 'react';

interface GoogleSearchConsoleProps {
  verificationCode: string;
}

export default function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
  return (
    <meta 
      name="google-site-verification" 
      content={verificationCode} 
    />
  );
}

// Componente para meta tags adicionales de SEO
export function SEOMetaTags() {
  return (
    <>
      {/* Verificación de Bing Webmaster Tools */}
      <meta name="msvalidate.01" content="TU_CODIGO_BING_AQUI" />
      
      {/* Verificación de Yandex */}
      <meta name="yandex-verification" content="TU_CODIGO_YANDEX_AQUI" />
      
      {/* Meta tags para mejorar indexación */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Geo-targeting para Colombia */}
      <meta name="geo.region" content="CO-BOL" />
      <meta name="geo.placename" content="Cartagena de Indias" />
      <meta name="geo.position" content="10.3910;-75.4794" />
      <meta name="ICBM" content="10.3910, -75.4794" />
      
      {/* Información de contacto para motores de búsqueda */}
      <meta name="contact" content="info@mundovacacional.com" />
      <meta name="author" content="Mundo Vacacional" />
      <meta name="reply-to" content="info@mundovacacional.com" />
      
      {/* Configuración de idioma y región */}
      <meta httpEquiv="content-language" content="es-CO" />
      <meta name="language" content="Spanish" />
      
      {/* Meta tags para redes sociales adicionales */}
      <meta property="business:contact_data:locality" content="Cartagena" />
      <meta property="business:contact_data:region" content="Bolívar" />
      <meta property="business:contact_data:country_name" content="Colombia" />
      <meta property="business:contact_data:phone_number" content="+57 316 403 2039" />
      <meta property="business:contact_data:website" content="https://mundovacacional.com" />
    </>
  );
}