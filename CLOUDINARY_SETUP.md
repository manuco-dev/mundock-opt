# Configuración e Implementación de Cloudinary

Esta guía te ayudará a configurar y usar Cloudinary en tu proyecto Mundo Vacacional.

## 📋 Requisitos Previos

1. Cuenta en [Cloudinary](https://cloudinary.com) (gratis)
2. Next.js 13+ con App Router
3. Dependencias instaladas: `next-cloudinary` y `cloudinary`

## 🔧 Configuración Inicial

### 1. Obtener Credenciales de Cloudinary

1. Regístrate en [Cloudinary](https://cloudinary.com)
2. Ve a tu Dashboard
3. Copia las siguientes credenciales:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### 2. Configurar Variables de Entorno

Actualiza tu archivo `.env.local`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### 3. Crear Upload Preset

1. Ve a Settings → Upload → Upload presets en tu dashboard de Cloudinary
2. Crea un nuevo preset con el nombre: `ml_default`
3. Configura como "Unsigned" para permitir uploads desde el frontend
4. Opcional: Configura transformaciones automáticas

## 🚀 Uso de Componentes

### ImageUpload - Subida de Imágenes

```tsx
import ImageUpload from '@/components/ImageUpload';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      onRemove={() => setImageUrl('')}
    />
  );
}
```

### OptimizedImage - Visualización Optimizada

```tsx
import OptimizedImage from '@/components/OptimizedImage';

function MyComponent() {
  return (
    <OptimizedImage
      src="cloudinary-url-or-public-id"
      alt="Descripción"
      width={400}
      height={300}
      quality="auto"
      format="auto"
    />
  );
}
```

### Componentes Especializados

```tsx
import { AvatarImage, BannerImage, GalleryImage } from '@/components/OptimizedImage';

// Avatar circular con detección de rostro
<AvatarImage src="image-url" alt="Avatar" size={100} />

// Banner con overlay de texto
<BannerImage 
  src="image-url" 
  alt="Banner"
  overlay={{
    text: 'Mundo Vacacional',
    color: 'white',
    fontSize: 48
  }}
/>

// Imagen de galería con hover effect
<GalleryImage src="image-url" alt="Galería" size={300} />
```

## 🎣 Hooks Personalizados

### useCloudinary - Hook Principal

```tsx
import { useCloudinary } from '@/hooks/use-cloudinary';

function MyComponent() {
  const {
    uploadImage,
    isUploading,
    error,
    getOptimizedUrl,
    deleteImage
  } = useCloudinary({
    folder: 'mi-carpeta',
    maxFileSize: 5000000, // 5MB
    onSuccess: (result) => console.log('Subida exitosa:', result),
    onError: (error) => console.error('Error:', error)
  });

  const handleFileUpload = async (file: File) => {
    const result = await uploadImage(file);
    if (result) {
      console.log('URL de la imagen:', result.secure_url);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />
      {isUploading && <p>Subiendo...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### useCloudinaryMultiple - Múltiples Imágenes

```tsx
import { useCloudinaryMultiple } from '@/hooks/use-cloudinary';

function GalleryUpload() {
  const {
    images,
    uploadMultiple,
    removeImage,
    isUploading
  } = useCloudinaryMultiple();

  const handleMultipleUpload = async (files: FileList) => {
    await uploadMultiple(files);
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        onChange={(e) => {
          if (e.target.files) {
            handleMultipleUpload(e.target.files);
          }
        }}
      />
      
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.public_id}>
            <img src={image.secure_url} alt={`Imagen ${index}`} />
            <button onClick={() => removeImage(index)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🛠 Utilidades

### Funciones de Cloudinary Utils

```tsx
import { cloudinaryUtils } from '@/lib/cloudinary';

// Extraer public_id de una URL
const publicId = cloudinaryUtils.getPublicIdFromUrl('https://res.cloudinary.com/...');

// Generar URL optimizada
const optimizedUrl = cloudinaryUtils.getOptimizedUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto'
});

// Generar thumbnail
const thumbnailUrl = cloudinaryUtils.getThumbnailUrl(publicId, 150);

// Generar avatar circular
const avatarUrl = cloudinaryUtils.getAvatarUrl(publicId, 100);

// Eliminar imagen
await cloudinaryUtils.deleteImage(publicId);
```

## 🌐 API Routes

### Subir Imagen (Server-side)

```tsx
// POST /api/cloudinary/upload
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'mi-carpeta');

const response = await fetch('/api/cloudinary/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

### Eliminar Imagen

```tsx
// POST /api/cloudinary/delete
const response = await fetch('/api/cloudinary/delete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ publicId: 'imagen-id' })
});
```

## 🎨 Transformaciones Avanzadas

### Efectos y Filtros

```tsx
<OptimizedImage
  src="image-url"
  alt="Imagen con efectos"
  width={400}
  height={300}
  blur={true}           // Efecto blur
  grayscale={true}      // Escala de grises
  sepia={true}          // Efecto sepia
  transformation={[     // Transformaciones personalizadas
    { effect: 'sharpen:100' },
    { border: '5px_solid_black' }
  ]}
/>
```

### Overlay de Texto

```tsx
<OptimizedImage
  src="image-url"
  alt="Banner con texto"
  width={800}
  height={400}
  overlay={{
    text: 'Mundo Vacacional',
    color: 'white',
    fontSize: 60,
    fontFamily: 'Arial',
    gravity: 'center'
  }}
/>
```

## 📱 Página de Demo

Visita `/cloudinary-demo` para ver todos los componentes en acción y probar la funcionalidad.

## 🔒 Límites del Plan Gratuito

- **Almacenamiento**: 25 GB
- **Ancho de banda**: 25 GB/mes
- **Transformaciones**: 25,000/mes
- **Tamaño máximo de imagen**: 10 MB
- **Tamaño máximo de video**: 100 MB

## 🚨 Solución de Problemas

### Error: "Upload preset not found"
- Verifica que hayas creado el upload preset `ml_default`
- Asegúrate de que esté configurado como "Unsigned"

### Error: "Invalid cloud name"
- Verifica que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` esté correctamente configurado
- Reinicia el servidor de desarrollo después de cambiar variables de entorno

### Imágenes no se cargan
- Verifica que las URLs de Cloudinary sean accesibles
- Revisa la consola del navegador para errores de CORS

### Upload falla
- Verifica el tamaño del archivo (máximo 10MB)
- Asegúrate de que sea un archivo de imagen válido
- Revisa las credenciales de API

## 📚 Recursos Adicionales

- [Documentación de Cloudinary](https://cloudinary.com/documentation)
- [Next Cloudinary Docs](https://next.cloudinary.dev/)
- [Transformaciones de Cloudinary](https://cloudinary.com/documentation/image_transformations)
- [Upload Presets](https://cloudinary.com/documentation/upload_presets)

---

¡Cloudinary está listo para usar en tu proyecto Mundo Vacacional! 🎉