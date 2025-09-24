# Configuración de Almacenamiento Local en Railway

## Descripción

Este documento describe cómo se ha implementado el almacenamiento local de imágenes en Railway para la sección de apartamentos del proyecto Mundo Vacacional.

## Estructura de Almacenamiento

Las imágenes se almacenan en el directorio `/data/files/uploads/properties/` dentro del volumen de Railway. Este directorio se crea automáticamente si no existe cuando se sube una imagen. El volumen se monta en la ruta `/data` en el contenedor de Railway y comparte espacio con la base de datos MongoDB que utiliza `/data/db`.

## Implementación

1. **API de Carga Local**: Se ha creado un endpoint en `/api/upload-local` que maneja la carga de archivos al sistema de archivos local en el volumen montado en `/data/files/uploads/properties`.

2. **API para Servir Imágenes**: Se ha creado un endpoint en `/api/uploads/properties/[filename]` que sirve las imágenes almacenadas en el volumen.

3. **Componente ApartmentImageUpload**: Se ha creado un componente específico para la carga de imágenes de apartamentos que utiliza el almacenamiento local en lugar de Cloudinary.

4. **Integración Condicional**: En la página de administración de propiedades, se utiliza el componente ApartmentImageUpload para propiedades de tipo 'apartment' y se mantiene AlternativeImageUpload (Cloudinary) para propiedades de tipo 'country_house'.

## Ventajas del Almacenamiento Local en Railway

- **Costos**: Reduce los costos asociados con servicios de almacenamiento en la nube como Cloudinary.
- **Control**: Mayor control sobre los archivos y su estructura.
- **Simplicidad**: No requiere configuración de servicios externos para la sección de apartamentos.

## Configuración del Volumen en Railway

1. **Usar Volumen Existente**: Utilizamos el volumen existente de MongoDB que ya está montado en la ruta `/data` en el contenedor.

2. **Estructura de Directorios**: MongoDB utiliza `/data/db` para sus archivos, mientras que nuestras imágenes se almacenan en `/data/files/uploads/properties` para evitar conflictos.

3. **Espacio Compartido**: El volumen de 5GB es compartido entre la base de datos MongoDB y las imágenes de apartamentos.

## Consideraciones para Producción

1. **Respaldos**: Configurar respaldos periódicos del volumen de Railway para evitar pérdida de datos tanto de la base de datos como de las imágenes.

2. **Monitoreo de Espacio**: Monitorear cuidadosamente el uso del espacio en disco compartido entre MongoDB y las imágenes. Considerar que el crecimiento de uno afectará al otro.

3. **Límites de Tamaño**: Implementar límites en el tamaño y número de imágenes que se pueden subir para evitar que consuman demasiado espacio del volumen compartido con MongoDB.

4. **Escalabilidad**: Evaluar periódicamente si es necesario aumentar el tamaño del volumen (actualmente 5GB) o separar las imágenes en un volumen independiente si el uso crece significativamente.

5. **Rendimiento**: Para mejorar el rendimiento, considerar la implementación de un CDN para servir las imágenes estáticas.

6. **Permisos**: Asegurar que el proceso de la aplicación tenga permisos de escritura en el directorio `/data/files`.

## Extensión a Otras Secciones

Para extender esta implementación a otras secciones del proyecto:

1. Crear componentes específicos para cada sección que utilicen la API de carga local.

2. Modificar las páginas correspondientes para utilizar estos componentes en lugar de los basados en Cloudinary.

3. Considerar la organización de archivos en subdirectorios específicos para cada sección (ej: `/data/files/uploads/country_houses/`).

4. Monitorear cuidadosamente el uso de espacio compartido con MongoDB al añadir nuevas secciones que almacenen archivos.