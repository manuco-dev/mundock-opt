# Cómo Obtener URLs con output=embed de Google Maps

## 🎯 Problema Identificado

Las URLs con el parámetro `output=embed` funcionan perfectamente en el sistema, pero las URLs normales de Google Maps no se convierten automáticamente. Aquí te explico cómo obtener el formato correcto.

## ✅ Método 1: Desde Google Maps (Recomendado)

### Pasos Detallados:

1. **Ve a Google Maps**
   - Abre [https://maps.google.com](https://maps.google.com)

2. **Busca la ubicación**
   - Escribe la dirección o nombre del lugar
   - Haz clic en el resultado correcto

3. **Obtén el código de inserción**
   - Haz clic en el botón **"Compartir"** (ícono de compartir)
   - Selecciona la pestaña **"Insertar un mapa"**
   - Verás un código HTML como este:
   ```html
   <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
   ```

4. **Extrae la URL**
   - Copia SOLO la URL que está dentro de `src="..."`
   - Ejemplo: `https://www.google.com/maps/embed?pb=!1m18!1m12...`

## ✅ Método 2: Conversión Manual con Coordenadas

Si tienes las coordenadas exactas (latitud, longitud):

### Formato:
```
https://maps.google.com/maps?q=LATITUD,LONGITUD&t=&z=15&ie=UTF8&iwloc=&output=embed
```

### Ejemplo Real:
- **Coordenadas:** 10.3934749, -75.5025325 (Cartagena)
- **URL resultante:**
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed
```

### Cómo obtener coordenadas:
1. Ve a Google Maps
2. Haz clic derecho en la ubicación exacta
3. Selecciona las coordenadas que aparecen en el menú
4. Úsalas en el formato de arriba

## ✅ Método 3: Herramienta de Conversión Automática

### Crear un Convertidor Simple:

Puedes usar esta fórmula para convertir URLs normales:

**URL normal de Google Maps:**
```
https://www.google.com/maps/place/Cartagena,+Bol%C3%ADvar/@10.3997222,-75.5144444,13z
```

**Extraer coordenadas del @:**
- Busca el símbolo `@` en la URL
- Las coordenadas están después: `@10.3997222,-75.5144444`
- Usa esas coordenadas en el formato del Método 2

## 🔧 Parámetros de la URL Explicados

- `q=LAT,LNG`: Coordenadas de latitud y longitud
- `t=`: Tipo de mapa (vacío = normal, `k` = satélite, `h` = híbrido)
- `z=15`: Nivel de zoom (1-20, donde 20 es máximo acercamiento)
- `ie=UTF8`: Codificación de caracteres
- `iwloc=`: Configuración de ventana de información
- `output=embed`: **CRÍTICO** - Hace que la URL funcione en iframe

## 🎯 Ejemplos Prácticos

### Cartagena Centro:
```
https://maps.google.com/maps?q=10.4236,-75.5378&t=&z=16&ie=UTF8&iwloc=&output=embed
```

### Bocagrande:
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed
```

### Con vista satelital:
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&t=k&z=15&ie=UTF8&iwloc=&output=embed
```

## ⚠️ Errores Comunes

### ❌ URL que NO funciona:
```
https://www.google.com/maps/place/Cartagena/@10.3997222,-75.5144444,13z
```
**Problema:** Falta `output=embed`

### ✅ URL que SÍ funciona:
```
https://maps.google.com/maps?q=10.3997222,-75.5144444&t=&z=13&ie=UTF8&iwloc=&output=embed
```
**Solución:** Tiene `output=embed`

## 🚀 Uso en el Sistema

1. **Obtén la URL** usando cualquiera de los métodos anteriores
2. **Ve al panel de administración** → Propiedades
3. **Pega la URL completa** en el campo "URL del Mapa de Google"
4. **Verifica la vista previa** - debería cargar inmediatamente
5. **Guarda la propiedad**

## 💡 Consejo Pro

**Guarda este formato como plantilla:**
```
https://maps.google.com/maps?q=LATITUD,LONGITUD&t=&z=15&ie=UTF8&iwloc=&output=embed
```

Solo cambia `LATITUD,LONGITUD` por las coordenadas reales y tendrás una URL que siempre funciona.

---

**¿Necesitas ayuda?** Revisa el archivo `GUIA_URL_IFRAME_GOOGLE_MAPS.md` para más detalles técnicos.