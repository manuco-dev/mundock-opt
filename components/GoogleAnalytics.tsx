'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
  gtmId?: string;
}

export default function GoogleAnalytics({ gaId, gtmId }: GoogleAnalyticsProps) {
  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
              'custom_parameter_1': 'property_type',
              'custom_parameter_2': 'location'
            }
          });
          
          // Enhanced ecommerce tracking for property views
          gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            content_group1: 'Apartamentos Cartagena',
            content_group2: 'Turismo Colombia'
          });
        `}
      </Script>

      {/* Google Tag Manager (opcional) */}
      {gtmId && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
    </>
  );
}

// Hook para tracking de eventos personalizados
export const useGoogleAnalytics = () => {
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Mundo Vacacional',
        event_label: 'User Interaction',
        ...parameters
      });
    }
  };

  const trackPropertyView = (propertyId: string, propertyType: string, location: string) => {
    trackEvent('view_item', {
      item_id: propertyId,
      item_name: `Apartamento ${propertyId}`,
      item_category: propertyType,
      item_location_id: location,
      content_type: 'property',
      custom_parameter_1: propertyType,
      custom_parameter_2: location
    });
  };

  const trackPropertyInquiry = (propertyId: string, contactMethod: string) => {
    trackEvent('generate_lead', {
      item_id: propertyId,
      method: contactMethod,
      content_type: 'property_inquiry',
      value: 1
    });
  };

  const trackSearch = (searchTerm: string, filters: Record<string, any> = {}) => {
    trackEvent('search', {
      search_term: searchTerm,
      content_type: 'property_search',
      ...filters
    });
  };

  return {
    trackEvent,
    trackPropertyView,
    trackPropertyInquiry,
    trackSearch
  };
};

// Declaración de tipos para window.gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer: Record<string, any>[];
  }
}