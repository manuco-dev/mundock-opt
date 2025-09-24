# 🗺️ Solución de Problemas - Google Maps

## Problema: "Vista previa muestra ubicación incorrecta"

### Posibles Causas y Soluciones

#### 1. **URL del Mapa Incorrecta**

**Síntomas:**
- El mapa se muestra pero en una ubicación diferente
- La vista previa no coincide con la ubicación esperada

**Solución:**
1. Ve a [Google Maps](https://maps.google.com)
2. Busca la ubicación EXACTA de tu propiedad
3. Haz clic en "Compartir" → "Insertar un mapa"
4. **IMPORTANTE:** Ajusta el zoom y la vista antes de copiar el código
5. Copia la URL completa del campo `src` del iframe

**Ejemplo de URL correcta:**
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.123...
```

#### 2. **Configuración de Google Cloud Console**

**Pasos para verificar/configurar:**

1. **Accede a Google Cloud Console:**
   - Ve a [console.cloud.google.com](https://console.cloud.google.com)
   - Selecciona tu proyecto

2. **Habilita las APIs necesarias:**
   - Ve a "APIs y servicios" → "Biblioteca"
   - Busca y habilita:
     - ✅ Maps Embed API
     - ✅ Maps JavaScript API
     - ✅ Places API (opcional)

3. **Configura la API Key:**
   - Ve a "APIs y servicios" → "Credenciales"
   - Crea una nueva API Key o edita la existente
   - **Restricciones de aplicación:**
     - Selecciona "Referentes HTTP (sitios web)"
     - Agrega estos dominios:
       ```
       http://localhost:3000/*
       https://tu-dominio.com/*
       https://*.railway.app/*
       ```

4. **Restricciones de API:**
   - Restringe la key solo a las APIs que necesitas:
     - Maps Embed API
     - Maps JavaScript API

#### 3. **Verificar Variables de Entorno**

**En tu archivo `.env.local`:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

**Verificaciones:**
- ✅ La API key no debe contener espacios
- ✅ No debe tener comillas adicionales
- ✅ Debe empezar con `AIza`

#### 4. **Formatos de URL Soportados**

La aplicación acepta estos formatos:

1. **URL de Embed (Recomendado):**
   ```
   https://www.google.com/maps/embed?pb=!1m18!1m12...
   ```

2. **Código iframe completo:**
   ```html
   <iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450"></iframe>
   ```

3. **URL de compartir:**
   ```
   https://maps.google.com/maps?q=10.4236,-75.5378
   ```

#### 5. **Herramientas de Depuración**

**En modo desarrollo:**
- Abre las herramientas de desarrollador (F12)
- Ve a la consola y busca mensajes que empiecen con "🗺️ Debug Google Maps"
- Verifica que la URL procesada sea correcta

**En la vista previa:**
- Haz clic en "🔍 Ver URL procesada" para verificar la URL original
- Si el mapa se muestra, usa "🔍 Info de depuración" para ver ambas URLs

### Errores Comunes

#### Error: "Refused to display"
**Causa:** Restricciones de dominio en Google Cloud Console
**Solución:** Agrega tu dominio a las restricciones de referente HTTP

#### Error: "This page can't load Google Maps correctly"
**Causa:** API key inválida o APIs no habilitadas
**Solución:** Verifica la API key y habilita Maps Embed API

#### Error: Mapa en blanco
**Causa:** URL malformada o coordenadas incorrectas
**Solución:** Usa el formato de URL recomendado desde Google Maps

### Contacto

Si el problema persiste después de seguir estos pasos, contacta al equipo de desarrollo con:
- La URL que estás intentando usar
- Capturas de pantalla del error
- Mensajes de la consola del navegador