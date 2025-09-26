import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface GeolocationError {
  code: number;
  message: string;
}

// Países de habla hispana y sus códigos
const SPANISH_SPEAKING_COUNTRIES = [
  'ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU',
  'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ'
];

// Función para detectar el país basado en la IP (usando un servicio gratuito)
const detectCountryByIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://ipapi.co/country_code/', {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });
    
    if (response.ok) {
      const countryCode = await response.text();
      return countryCode.trim().toUpperCase();
    }
  } catch (error) {
    console.log('Error detecting country by IP:', error);
  }
  return null;
};

// Función para detectar idioma del navegador
const detectBrowserLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    return browserLang.toLowerCase();
  }
  return 'es';
};

// Función para determinar el idioma apropiado
const determineLanguage = async (): Promise<'es' | 'en'> => {
  // 1. Verificar si ya hay una preferencia guardada
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang === 'es' || savedLang === 'en') {
      return savedLang as 'es' | 'en';
    }
  }

  // 2. Detectar por idioma del navegador
  const browserLang = detectBrowserLanguage();
  if (browserLang.startsWith('es')) {
    return 'es';
  }
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  // 3. Detectar por ubicación/IP
  try {
    const countryCode = await detectCountryByIP();
    if (countryCode && SPANISH_SPEAKING_COUNTRIES.includes(countryCode)) {
      return 'es';
    }
    if (countryCode) {
      return 'en'; // Para otros países, usar inglés
    }
  } catch (error) {
    console.log('Error in country detection:', error);
  }

  // 4. Por defecto, español (para Colombia y región)
  return 'es';
};

export const useLanguageDetection = () => {
  const router = useRouter();

  useEffect(() => {
    const detectAndSetLanguage = async () => {
      try {
        const detectedLang = await determineLanguage();
        
        // Solo cambiar si es diferente al idioma actual
        const currentLang = router.locale || 'es';
        
        if (detectedLang !== currentLang) {
          // Guardar preferencia
          if (typeof window !== 'undefined') {
            localStorage.setItem('preferred-language', detectedLang);
          }
          
          // Cambiar idioma
          router.push(router.asPath, router.asPath, { 
            locale: detectedLang,
            shallow: true 
          });
        }
      } catch (error) {
        console.log('Error in language detection:', error);
      }
    };

    // Solo ejecutar en el cliente y una vez
    if (typeof window !== 'undefined' && router.isReady) {
      detectAndSetLanguage();
    }
  }, [router.isReady]);

  return null;
};

export default useLanguageDetection;