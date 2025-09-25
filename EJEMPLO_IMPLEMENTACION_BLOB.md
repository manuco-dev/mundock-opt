# Ejemplo de Implementación - Vercel Blob Store

## 🎯 Implementación en Panel de Administración

### 1. Formulario de Hero Images

```tsx
// app/admin/dashboard/page.tsx (ejemplo)
import { useState } from 'react';
import HeroBlobUpload from '@/components/HeroBlobUpload';

export default function AdminDashboard() {
  const [heroImage, setHeroImage] = useState('');
  const [heroVideo, setHeroVideo] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = (url: string, type: 'image' | 'video') => {
    setIsUploading(false);
    console.log(`${type} subido exitosamente:`, url);
  };

  const handleUploadError = (error: any) => {
    setIsUploading(false);
    console.error('Error al subir:', error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Imágenes Hero</h1>
      
      <div className="max-w-2xl">
        <HeroBlobUpload
          imageValue={heroImage}
          videoValue={heroVideo}
          onImageChange={setHeroImage}
          onVideoChange={setHeroVideo}
          onImageRemove={() => setHeroImage('')}
          onVideoRemove={() => setHeroVideo('')}
          disabled={isUploading}
          onUploadStart={handleUploadStart}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
      </div>
      
      {/* Mostrar URLs para debugging */}
      {heroImage && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm font-medium">Imagen Hero URL:</p>
          <p className="text-xs text-gray-600 break-all">{heroImage}</p>
        </div>
      )}
      
      {heroVideo && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm font-medium">Video Hero URL:</p>
          <p className="text-xs text-gray-600 break-all">{heroVideo}</p>
        </div>
      )}
    </div>
  );
}
```

### 2. Formulario de Propiedades

```tsx
// app/admin/properties/page.tsx (ejemplo de integración)
import { useState } from 'react';
import PropertyBlobUpload from '@/components/PropertyBlobUpload';

interface PropertyForm {
  title: string;
  description: string;
  images: string[];
  // ... otros campos
}

export default function PropertiesAdmin() {
  const [formData, setFormData] = useState<PropertyForm>({
    title: '',
    description: '',
    images: [],
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleImageRemove = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Propiedad creada exitosamente!');
        // Resetear formulario
        setFormData({ title: '', description: '', images: [] });
      }
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      alert('Error al crear la propiedad');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Propiedad</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Título de la Propiedad
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border rounded-md h-24"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Imágenes de la Propiedad
          </label>
          <PropertyBlobUpload
            value={formData.images}
            onChange={handleImagesChange}
            onRemove={handleImageRemove}
            disabled={isUploading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isUploading || formData.images.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? 'Creando...' : 'Crear Propiedad'}
        </button>
      </form>
      
      {/* Preview de imágenes */}
      {formData.images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Vista Previa de URLs:</h3>
          <div className="space-y-2">
            {formData.images.map((url, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded text-xs break-all">
                <span className="font-medium">Imagen {index + 1}:</span> {url}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🔄 Migración de Componente Existente

### Antes (usando Cloudinary)
```tsx
import PropertyImageUpload from '@/components/PropertyImageUpload';

<PropertyImageUpload
  value={images}
  onChange={setImages}
  onRemove={removeImage}
  useCloudinary={true} // Cloudinary
  folder="properties"
/>
```

### Después (usando Vercel Blob)
```tsx
import PropertyBlobUpload from '@/components/PropertyBlobUpload';

<PropertyBlobUpload
  value={images}
  onChange={setImages}
  onRemove={removeImage}
  // No necesita configuración adicional
/>
```

## 🧪 Testing

### 1. Test de Upload Hero
```bash
# Navega a tu panel de admin
# Sube una imagen (máx 20MB)
# Sube un video (máx 100MB)
# Verifica que las URLs se generen correctamente
```

### 2. Test de Upload Propiedades
```bash
# Navega a crear/editar propiedad
# Sube múltiples imágenes
# Verifica drag & drop
# Prueba eliminar imágenes
```

## 📊 Comparación de Rendimiento

| Característica | Cloudinary | Vercel Blob |
|---|---|---|
| Velocidad de upload | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Transformaciones | ⭐⭐⭐⭐⭐ | ⭐ |
| Costo | ⭐⭐ | ⭐⭐⭐⭐ |
| Simplicidad | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| CDN Global | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🚀 Próximos Pasos

1. **Implementa** los componentes en tus formularios
2. **Prueba** la funcionalidad completa
3. **Monitorea** el uso de Vercel Blob Store
4. **Considera** migrar otros tipos de archivos

¡Ya tienes todo listo para usar Vercel Blob Store! 🎉