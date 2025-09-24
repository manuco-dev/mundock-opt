# 🗺️ Cómo Habilitar Google Maps API en Google Cloud Console

## Paso 1: Acceder a Google Cloud Console

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Inicia sesión con tu cuenta de Google
3. Si no tienes un proyecto, crea uno nuevo:
   - Haz clic en "Seleccionar proyecto" en la parte superior
   - Clic en "Proyecto nuevo"
   - Asigna un nombre (ej: "mundo-vacacional-maps")
   - Haz clic en "Crear"

## Paso 2: Habilitar las APIs Necesarias

### 2.1 Ir a la Biblioteca de APIs
1. En el menú lateral, ve a **"APIs y servicios"** → **"Biblioteca"**
2. O usa la búsqueda rápida y escribe "API Library"

### 2.2 Habilitar Maps Embed API
1. En la barra de búsqueda, escribe: **"Maps Embed API"**
2. Haz clic en el resultado **"Maps Embed API"**
3. Haz clic en el botón **"HABILITAR"**
4. Espera a que se active (puede tomar unos segundos)

### 2.3 Habilitar Maps JavaScript API (Opcional pero recomendado)
1. Regresa a la biblioteca (botón "← Biblioteca" o repite el paso 2.1)
2. Busca: **"Maps JavaScript API"**
3. Haz clic en el resultado y luego en **"HABILITAR"**

### 2.4 Habilitar Places API (Opcional)
1. Regresa a la biblioteca
2. Busca: **"Places API"**
3. Haz clic en el resultado y luego en **"HABILITAR"**

## Paso 3: Crear una API Key

### 3.1 Ir a Credenciales
1. En el menú lateral, ve a **"APIs y servicios"** → **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"Clave de API"**

### 3.2 Configurar Restricciones (MUY IMPORTANTE)
1. Después de crear la key, aparecerá un modal
2. Haz clic en **"RESTRINGIR CLAVE"**
3. En "Restricciones de aplicación":
   - Selecciona **"Referentes HTTP (sitios web)"**
   - En "Referentes de sitios web", agrega:
     ```
     http://localhost:3000/*
     https://localhost:3000/*
     https://tu-dominio.com/*
     https://*.railway.app/*
     https://*.vercel.app/*
     ```

4. En "Restricciones de API":
   - Selecciona **"Restringir clave"**
   - Marca las siguientes APIs:
     - ✅ Maps Embed API
     - ✅ Maps JavaScript API (si la habilitaste)
     - ✅ Places API (si la habilitaste)

5. Haz clic en **"GUARDAR"**

## Paso 4: Copiar la API Key

1. En la página de credenciales, verás tu nueva API key
2. Haz clic en el ícono de **"Copiar"** 📋
3. La key debe verse así: `AIzaSyC...` (empieza con "AIza")

## Paso 5: Configurar en tu Proyecto

### 5.1 Actualizar .env.local
1. Abre el archivo `.env.local` en tu proyecto
2. Actualiza o agrega la línea:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```
3. **¡IMPORTANTE!** Reemplaza `tu_api_key_aqui` con la key que copiaste
4. Guarda el archivo

### 5.2 Reiniciar el Servidor de Desarrollo
1. Si tienes el servidor corriendo, deténlo (Ctrl+C)
2. Ejecuta nuevamente:
   ```bash
   npm run dev
   ```

## Paso 6: Verificar que Funciona

1. Ve al panel de administración de propiedades
2. Intenta agregar una URL de Google Maps
3. Deberías ver la vista previa del mapa correctamente

## Solución de Problemas Comunes

### Error: "This page can't load Google Maps correctly"
**Causa:** API key no válida o APIs no habilitadas
**Solución:** 
- Verifica que copiaste la API key completa
- Asegúrate de haber habilitado "Maps Embed API"
- Revisa que no haya espacios extra en el .env.local

### Error: "Refused to display"
**Causa:** Restricciones de dominio
**Solución:**
- Ve a Google Cloud Console → Credenciales
- Edita tu API key
- Agrega tu dominio a las restricciones de referente HTTP

### Error: "API key not found"
**Causa:** Variable de entorno no configurada
**Solución:**
- Verifica que el archivo .env.local esté en la raíz del proyecto
- Asegúrate de que la variable empiece con `NEXT_PUBLIC_`
- Reinicia el servidor de desarrollo

## Costos

- Google Maps ofrece **$200 USD de crédito gratuito mensual**
- Maps Embed API: **Gratuita** para uso básico
- Para sitios web pequeños/medianos, raramente excederás el límite gratuito

## Contacto

Si sigues teniendo problemas después de seguir estos pasos, contacta al equipo de desarrollo con:
- Capturas de pantalla de los errores
- Tu configuración de Google Cloud Console
- El contenido de tu archivo .env.local (sin mostrar la API key completa)