# 🚂 Guía de Despliegue en Railway

## Variables de Entorno Obligatorias

Antes de desplegar, configura estas variables en Railway:

### 1. Base de Datos MongoDB
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mundo-vacacional?retryWrites=true&w=majority
```

### 2. Credenciales de Administrador
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TuContraseñaSegura123!
```

### 3. Configuración de NextAuth
```
NEXTAUTH_SECRET=tu-clave-secreta-muy-larga-y-segura-aqui
NEXTAUTH_URL=https://tu-proyecto.railway.app
```

### 4. JWT Secret
```
JWT_SECRET=otra-clave-secreta-para-jwt-tokens
```

### 5. Entorno
```
NODE_ENV=production
```

## 📋 Checklist de Despliegue

- [ ] ✅ Repositorio conectado a Railway
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Base de datos MongoDB configurada
- [ ] ✅ Dominio personalizado configurado (opcional)
- [ ] ✅ Primer despliegue exitoso
- [ ] ✅ Acceso al panel admin funcionando
- [ ] ✅ Subida de imágenes funcionando
- [ ] ✅ Integración WhatsApp funcionando

## 🔧 Configuración Post-Despliegue

1. **Accede al panel de administración:**
   ```
   https://tu-proyecto.railway.app/admin/login
   ```

2. **Sube contenido inicial:**
   - Imágenes hero para el carrusel
   - Banners promocionales
   - Configura títulos y descripciones

3. **Verifica funcionalidades:**
   - Navegación del sitio
   - Botones de WhatsApp
   - Responsive design

## 🚨 Solución de Problemas

### Error de Conexión a MongoDB
- Verifica que la URI de MongoDB sea correcta
- Asegúrate de que las IPs estén en whitelist (0.0.0.0/0 para Railway)

### Error de NextAuth
- Verifica que NEXTAUTH_URL coincida con tu dominio de Railway
- Asegúrate de que NEXTAUTH_SECRET esté configurado

### Imágenes no se cargan
- Las imágenes se guardan en `/public/uploads/`
- Para producción, considera usar un servicio de almacenamiento externo

## 📞 Contacto

Si necesitas ayuda con el despliegue, contacta al equipo de desarrollo.