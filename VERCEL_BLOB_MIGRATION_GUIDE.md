# Guía de Migración a Vercel Blob Store

## 📋 Resumen

Esta guía te ayudará a implementar los nuevos componentes de Vercel Blob Store para imágenes hero y propiedades en tu aplicación.

## 🔧 Configuración Completada

✅ **Dependencia instalada**: `@vercel/blob` v2.0.0
✅ **Variable de entorno configurada**: `BLOB_READ_WRITE_TOKEN`
✅ **Componentes creados**: `HeroBlobUpload` y `PropertyBlobUpload`
✅ **APIs implementadas**: `/api/upload-blob-hero` y `/api/upload-blob-properties`

## 🚀 Cómo Implementar

### 1. Para Imágenes Hero (Panel de Administración)

**Reemplaza** el componente `HeroImageUpload` por `HeroBlobUpload`:

```tsx
// Antes
import HeroImageUpload from '@/components/HeroImageUpload';

// Después
import HeroBlobUpload from '@/components/HeroBlobUpload';

// Uso (la interfaz es idéntica)
<HeroBlobUpload
  imageValue={imageValue}
  videoValue={videoValue}
  onImageChange={setImageValue}
  onVideoChange={setVideoValue}
  onImageRemove={() => setImageValue('')}
  onVideoRemove={() => setVideoValue('')}
  disabled={isUploading}
/>
```

### 2. Para Imágenes de Propiedades (Panel de Administración)

**Reemplaza** el componente `PropertyImageUpload` por `PropertyBlobUpload`:

```tsx
// Antes
import PropertyImageUpload from '@/components/PropertyImageUpload';

// Después
import PropertyBlobUpload from '@/components/PropertyBlobUpload';

// Uso (la interfaz es idéntica)
<PropertyBlobUpload
  value={images}
  onChange={setImages}
  onRemove={removeImage}
  disabled={isUploading}
/>
```

## 📁 Archivos Creados

### Componentes
- `components/HeroBlobUpload.tsx` - Upload de imágenes/videos hero
- `components/PropertyBlobUpload.tsx` - Upload de imágenes de propiedades

### APIs
- `app/api/upload-blob-hero/route.ts` - Endpoint para hero images
- `app/api/upload-blob-properties/route.ts` - Endpoint para property images

## 🔍 Características

### HeroBlobUpload
- ✅ Soporte para imágenes y videos
- ✅ Drag & drop
- ✅ Validación de tamaño: 20MB (imágenes), 100MB (videos)
- ✅ Formatos soportados: JPG, PNG, WebP, MP4, MOV, AVI

### PropertyBlobUpload
- ✅ Múltiples imágenes
- ✅ Drag & drop
- ✅ Validación de tamaño: 10MB por imagen
- ✅ Formatos soportados: JPG, PNG, WebP
- ✅ Vista previa con opción de eliminar

## 🔄 Migración Gradual

Puedes migrar gradualmente:

1. **Fase 1**: Usa los nuevos componentes solo para contenido nuevo
2. **Fase 2**: Migra contenido existente cuando sea necesario
3. **Fase 3**: Elimina los componentes antiguos cuando ya no se usen

## 🛠️ Troubleshooting

### Error: "No se encontró ningún archivo"
- Verifica que el formulario esté enviando el archivo correctamente
- Asegúrate de que el input tenga el atributo `name="file"`

### Error: "Error interno del servidor"
- Verifica que `BLOB_READ_WRITE_TOKEN` esté configurado correctamente
- Revisa los logs del servidor para más detalles

### Archivos no se suben
- Verifica el tamaño del archivo (límites: 10MB propiedades, 20MB/100MB hero)
- Confirma que el formato sea compatible

## 📝 Notas Importantes

- Los archivos se almacenan en Vercel Blob Store con nombres únicos
- Las URLs generadas son públicas y accesibles directamente
- Los archivos antiguos en Cloudinary/local storage seguirán funcionando
- No es necesario migrar archivos existentes inmediatamente

## 🔗 Próximos Pasos

1. Implementa los componentes en tus formularios del admin
2. Prueba la funcionalidad de upload
3. Verifica que las imágenes se muestren correctamente
4. Considera migrar otros tipos de archivos si es necesario

---

¡La migración está lista para usar! 🎉