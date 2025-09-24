# Mundo Vacacional - Plataforma de Alquileres Vacacionales

Una plataforma web moderna para la gestión y promoción de apartamentos vacacionales y vans.

## 🚀 Despliegue en Railway

### Prerrequisitos
1. Cuenta en [Railway](https://railway.app)
2. Base de datos MongoDB (puedes usar Railway MongoDB o MongoDB Atlas)

### Variables de Entorno Requeridas

Configura las siguientes variables de entorno en Railway:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin&retryWrites=true&w=majority

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu-contraseña-segura

# NextAuth Configuration
NEXTAUTH_SECRET=tu-clave-secreta-nextauth-aqui
NEXTAUTH_URL=https://tu-app.railway.app

# JWT Secret
JWT_SECRET=tu-clave-jwt-secreta-aqui

# Environment
NODE_ENV=production
```

### Pasos para Desplegar

1. **Conecta tu repositorio a Railway:**
   - Ve a [Railway Dashboard](https://railway.app/dashboard)
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta este repositorio

2. **Configura las variables de entorno:**
   - En el dashboard de Railway, ve a tu proyecto
   - Haz clic en "Variables"
   - Agrega todas las variables listadas arriba

3. **Configura la base de datos:**
   - Si usas Railway MongoDB: agrega el servicio MongoDB a tu proyecto
   - Si usas MongoDB Atlas: usa la URI de conexión de Atlas

4. **Despliega:**
   - Railway detectará automáticamente que es un proyecto Next.js
   - El despliegue se iniciará automáticamente

### Configuración Post-Despliegue

1. **Accede al panel de administración:**
   - Ve a `https://tu-app.railway.app/admin/login`
   - Usa las credenciales configuradas en `ADMIN_USERNAME` y `ADMIN_PASSWORD`

2. **Sube contenido:**
   - Agrega imágenes hero desde el dashboard
   - Crea banners promocionales
   - Configura títulos y descripciones personalizadas

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install
# o
pnpm install

# Ejecutar en modo desarrollo
npm run dev
# o
pnpm dev
```

## 📁 Estructura del Proyecto

```
├── app/                 # App Router de Next.js
│   ├── admin/          # Panel de administración
│   ├── api/            # API Routes
│   └── page.tsx        # Página principal
├── components/         # Componentes React
├── lib/               # Utilidades y configuración
├── public/            # Archivos estáticos
└── scripts/           # Scripts de utilidad
```

## 🔧 Características

- ✅ Panel de administración completo
- ✅ Gestión de banners promocionales
- ✅ Integración con WhatsApp
- ✅ Subida de imágenes
- ✅ Diseño responsive
- ✅ Autenticación segura
- ✅ Base de datos MongoDB

## 📞 Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo.