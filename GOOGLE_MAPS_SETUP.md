# Configuración de Google Maps

Este documento explica cómo configurar Google Maps para mostrar las ubicaciones de las propiedades en la sección de apartamentos.

## Pasos para configurar Google Maps API

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Asegúrate de que la facturación esté habilitada (Google Maps requiere una cuenta de facturación)

### 2. Habilitar las APIs necesarias

1. Ve a **APIs & Services > Library**
2. Busca y habilita las siguientes APIs:
   - **Maps JavaScript API**
   - **Places API** (opcional, para funcionalidades futuras)

### 3. Crear credenciales

1. Ve a **APIs & Services > Credentials**
2. Haz clic en **Create Credentials > API Key**
3. Copia la clave generada

### 4. Configurar restricciones (Recomendado)

Para mayor seguridad, configura restricciones en tu API key:

1. En la página de credenciales, haz clic en tu API key
2. En **Application restrictions**, selecciona **HTTP referrers**
3. Agrega los siguientes referrers:
   - `http://localhost:3000/*` (para desarrollo)
   - `https://tu-dominio.com/*` (para producción)
4. En **API restrictions**, selecciona **Restrict key** y elige:
   - Maps JavaScript API
   - Places API (si la habilitaste)

### 5. Configurar la variable de entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza `your-google-maps-api-key-here` con tu clave real:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-clave-de-api-aqui
```

### 6. Reiniciar el servidor de desarrollo

Después de configurar la variable de entorno:

```bash
npm run dev
# o
pnpm dev
```

## Funcionalidades implementadas

### Mapa de propiedades
- Muestra todas las propiedades activas en un mapa interactivo
- Marcadores personalizados con los colores de la marca
- Información emergente al hacer clic en los marcadores
- Se ajusta automáticamente para mostrar todas las propiedades

### Ubicaciones predefinidas
El sistema incluye coordenadas predefinidas para las siguientes zonas de Cartagena:

- Bocagrande
- El Laguito
- Castillogrande
- Manga
- Centro Histórico / Ciudad Amurallada
- Getsemaní
- La Matuna
- Pie de la Popa
- Crespo
- Marbella
- El Cabrero
- San Diego

### Componentes creados

1. **GoogleMap.tsx** - Componente base para mostrar mapas de Google
2. **PropertiesMap.tsx** - Componente específico para mostrar propiedades en el mapa

## Personalización

### Agregar nuevas ubicaciones

Para agregar nuevas ubicaciones, edita el archivo `components/PropertiesMap.tsx` y agrega las coordenadas en el objeto `LOCATION_COORDINATES`:

```typescript
const LOCATION_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  // ... ubicaciones existentes
  'Nueva Ubicación': { lat: 10.1234, lng: -75.5678 },
};
```

### Personalizar el estilo del mapa

Puedes modificar el estilo del mapa editando la propiedad `styles` en el componente `GoogleMap.tsx`.

### Personalizar marcadores

Los marcadores utilizan SVG personalizado con los colores de la marca. Puedes modificar el diseño en la sección `icon` del componente `GoogleMap.tsx`.

## Solución de problemas

### El mapa no se carga
1. Verifica que la clave de API esté correctamente configurada
2. Asegúrate de que las APIs estén habilitadas en Google Cloud Console
3. Revisa las restricciones de la API key
4. Verifica que la facturación esté habilitada

### Errores de cuota
Google Maps tiene límites de uso gratuito. Si superas estos límites, necesitarás configurar facturación.

### Marcadores no aparecen
Verifica que las propiedades tengan el campo `location` configurado y que coincida con alguna de las ubicaciones predefinidas.

## Costos

Google Maps JavaScript API tiene un nivel gratuito generoso:
- Primeras 28,000 cargas de mapa por mes: gratis
- Después: $7 USD por cada 1,000 cargas adicionales

Para más información sobre precios, visita: [Google Maps Platform Pricing](https://cloud.google.com/maps-platform/pricing)