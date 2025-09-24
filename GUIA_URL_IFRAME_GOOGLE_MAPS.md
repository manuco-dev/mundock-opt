# Guía: Usar URLs de Iframe de Google Maps

## ✅ Formatos de URL Soportados

El componente `EmbeddedGoogleMap` ahora soporta completamente URLs de iframe de Google Maps con el parámetro `output=embed`.

### Ejemplo de URL Válida
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed
```

## 🔧 Cómo Obtener una URL de Iframe

### Método 1: Desde Google Maps
1. Ve a [Google Maps](https://maps.google.com)
2. Busca la ubicación deseada
3. Haz clic en "Compartir" → "Insertar un mapa"
4. Copia la URL del atributo `src` del iframe

### Método 2: Formato Manual
Puedes crear manualmente una URL usando coordenadas:
```
https://maps.google.com/maps?q=LATITUD,LONGITUD&t=&z=15&ie=UTF8&iwloc=&output=embed
```

**Ejemplo:**
- Latitud: 10.3934749
- Longitud: -75.5025325
- URL: `https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed`

## 🎯 Parámetros de la URL

- `q=LAT,LNG`: Coordenadas de latitud y longitud
- `z=15`: Nivel de zoom (1-20)
- `output=embed`: **Requerido** para que funcione en iframe
- `t=`: Tipo de mapa (vacío = mapa normal)
- `ie=UTF8`: Codificación de caracteres
- `iwloc=`: Configuración de ventana de información

## 🧪 Modo de Depuración

En modo desarrollo, el componente muestra información de depuración:
- URL original ingresada
- URL de embed procesada
- Estado de la carga del mapa

## ⚠️ Notas Importantes

1. **Parámetro `output=embed` es obligatorio** para URLs de iframe
2. El componente detecta automáticamente URLs con este parámetro
3. No necesitas configurar API key para URLs de embed básicas
4. Las URLs funcionan inmediatamente sin configuración adicional

## 🔍 Solución de Problemas

### El mapa no se carga
- Verifica que la URL contenga `output=embed`
- Asegúrate de que las coordenadas sean válidas
- Revisa la consola del navegador para errores

### Vista previa muestra "Vista previa no disponible"
- La URL puede no tener el formato correcto
- Usa el modo de depuración para ver la URL procesada
- Verifica que la URL contenga `google.com/maps`

## 📝 Ejemplo de Uso en el Formulario

En el panel de administración:
1. Ve a "Propiedades" → "Crear nueva propiedad"
2. En el campo "URL del Mapa de Google", pega la URL completa:
   ```
   https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed
   ```
3. La vista previa del mapa debería cargar automáticamente
4. Guarda la propiedad

¡El mapa ahora funcionará perfectamente como iframe en tu sitio web!