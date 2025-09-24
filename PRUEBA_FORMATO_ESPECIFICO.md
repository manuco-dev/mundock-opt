# Prueba del Formato Específico de Conversión

## Formato Objetivo
Las URLs deben convertirse al formato:
```
https://maps.google.com/maps?q=LATITUD,LONGITUD&t=&z=15&ie=UTF8&iwloc=&output=embed
```

## Ejemplos de Conversión

### 1. URL con coordenadas @lat,lng
**Entrada:**
```
https://www.google.com/maps/@10.3934749,-75.5025325,17z
```
**Salida esperada:**
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed
```

### 2. URL con parámetros 3d/4d
**Entrada:**
```
https://www.google.com/maps/place/Torre+del+Reloj/@10.4236077,-75.5518373,17z/data=!3m1!4b1!4m6!3m5!1s0x8ef625e7d1f8b7e5:0x8b1e8b1e8b1e8b1e!8m2!3d10.4236077!4d-75.5518373
```
**Salida esperada:**
```
https://maps.google.com/maps?q=10.4236077,-75.5518373&t=&z=15&ie=UTF8&iwloc=&output=embed
```

### 3. URL con parámetro q=lat,lng
**Entrada:**
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&z=17
```
**Salida esperada:**
```
https://maps.google.com/maps?q=10.3934749,-75.5025325&t=&z=15&ie=UTF8&iwloc=&output=embed
```

### 4. URL con nombre de lugar
**Entrada:**
```
https://www.google.com/maps/place/Torre+del+Reloj,+Cartagena
```
**Salida esperada:**
```
https://maps.google.com/maps?q=Torre%20del%20Reloj%2C%20Cartagena&t=&z=15&ie=UTF8&iwloc=&output=embed
```

## Cómo Probar

1. Ve a `http://localhost:3001/admin/properties`
2. Haz clic en "Agregar Nueva Propiedad"
3. Pega cualquiera de las URLs de entrada en el campo "URL del Mapa de Google"
4. Verifica que la URL convertida coincida con el formato esperado
5. Confirma que el mapa se muestre correctamente en la vista previa

## Características del Formato

- ✅ Dominio: `maps.google.com`
- ✅ Parámetro `q=` con coordenadas o ubicación
- ✅ Parámetros estándar: `&t=&z=15&ie=UTF8&iwloc=`
- ✅ Parámetro final: `&output=embed`
- ✅ Zoom fijo en 15 para consistencia
- ✅ Codificación URL apropiada para nombres de lugares

## Ventajas de este Formato

1. **Universalmente compatible** - No requiere API key
2. **Formato consistente** - Todas las URLs siguen el mismo patrón
3. **Zoom estandarizado** - Nivel 15 apropiado para propiedades
4. **Funciona en iframe** - Compatible con embed directo
5. **Extrae coordenadas precisas** - Mantiene la ubicación exacta