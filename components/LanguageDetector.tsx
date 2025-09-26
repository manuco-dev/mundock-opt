'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Países de habla hispana y sus códigos
const SPANISH_SPEAKING_COUNTRIES = [
  'ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU',
  'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ'
];

// Función para detectar el país basado en la IP
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

export const LanguageDetector: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const detectAndSetLanguage = async () => {
      try {
        // Verificar si ya se ejecutó la detección en esta sesión
        const detectionDone = sessionStorage.getItem('language-detection-done');
        if (detectionDone) {
          return;
        }

        const detectedLang = await determineLanguage();
        
        // Obtener idioma actual de la URL o localStorage
        const currentPath = window.location.pathname;
        const currentLang = currentPath.startsWith('/en') ? 'en' : 'es';
        
        if (detectedLang !== currentLang) {
          // Guardar preferencia
          localStorage.setItem('preferred-language', detectedLang);
          
          // Marcar que ya se hizo la detección
          sessionStorage.setItem('language-detection-done', 'true');
          
          // Redirigir al idioma detectado
          const newPath = detectedLang === 'en' 
            ? `/en${currentPath === '/' ? '' : currentPath}`
            : currentPath.replace('/en', '') || '/';
          
          if (newPath !== currentPath) {
            router.push(newPath);
          }
        } else {
          // Marcar que ya se hizo la detección aunque no haya cambio
          sessionStorage.setItem('language-detection-done', 'true');
        }
      } catch (error) {
        console.log('Error in language detection:', error);
        sessionStorage.setItem('language-detection-done', 'true');
      }
    };

    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      // Pequeño delay para asegurar que la página esté completamente cargada
      setTimeout(detectAndSetLanguage, 100);
    }
  }, [router]);

  return null; // Este componente no renderiza nada
};

export default LanguageDetector;