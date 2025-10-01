const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Esquemas de base de datos
const HeroImageSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  url: String,
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PromotionBannerSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  linkUrl: String,
  customTitle: String,
  customDescription: String,
  filename: String,
  originalName: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const HeroImage = mongoose.model('HeroImage', HeroImageSchema);
const PromotionBanner = mongoose.model('PromotionBanner', PromotionBannerSchema);

// Función para subir archivo a Cloudinary
async function uploadToCloudinary(filePath, folder, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `mundo-vacacional/${folder}`,
      resource_type: resourceType,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        { width: 1920, height: 1080, crop: 'limit' }
      ]
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      original_filename: result.original_filename
    };
  } catch (error) {
    console.error(`Error uploading ${filePath} to Cloudinary:`, error);
    throw error;
  }
}

// Función para migrar imágenes hero
async function migrateHeroImages() {
  console.log('\n=== Migrando Imágenes Hero ===');
  
  const heroDir = path.join(__dirname, '..', 'public', 'uploads', 'hero');
  
  if (!fs.existsSync(heroDir)) {
    console.log('No se encontró el directorio de imágenes hero');
    return;
  }
  
  const files = fs.readdirSync(heroDir);
  console.log(`Encontrados ${files.length} archivos en el directorio hero`);
  
  for (const file of files) {
    const filePath = path.join(heroDir, file);
    const localUrl = `/uploads/hero/${file}`;
    
    try {
      // Buscar en la BD si existe una imagen con esta URL local
      const existingImage = await HeroImage.findOne({ url: localUrl });
      
      if (existingImage) {
        console.log(`Migrando imagen hero: ${file}`);
        
        // Subir a Cloudinary
        const cloudinaryResult = await uploadToCloudinary(filePath, 'hero');
        
        // Actualizar en la BD
        await HeroImage.findByIdAndUpdate(existingImage._id, {
          url: cloudinaryResult.url,
          filename: cloudinaryResult.public_id,
          originalName: existingImage.originalName || file,
          updatedAt: new Date()
        });
        
        console.log(`✓ Migrada: ${file} -> ${cloudinaryResult.url}`);
      } else {
        console.log(`⚠ No se encontró registro en BD para: ${file}`);
      }
    } catch (error) {
      console.error(`✗ Error migrando ${file}:`, error.message);
    }
  }
}

// Función para migrar banners promocionales
async function migratePromotionBanners() {
  console.log('\n=== Migrando Banners Promocionales ===');
  
  const bannersDir = path.join(__dirname, '..', 'public', 'uploads', 'promotion-banners');
  
  if (!fs.existsSync(bannersDir)) {
    console.log('No se encontró el directorio de banners promocionales');
    return;
  }
  
  const files = fs.readdirSync(bannersDir);
  console.log(`Encontrados ${files.length} archivos en el directorio promotion-banners`);
  
  for (const file of files) {
    const filePath = path.join(bannersDir, file);
    const localUrl = `/uploads/promotion-banners/${file}`;
    
    try {
      // Buscar en la BD si existe un banner con esta URL local
      const existingBanner = await PromotionBanner.findOne({ imageUrl: localUrl });
      
      if (existingBanner) {
        console.log(`Migrando banner: ${file}`);
        
        // Subir a Cloudinary
        const cloudinaryResult = await uploadToCloudinary(filePath, 'banners');
        
        // Actualizar en la BD
        await PromotionBanner.findByIdAndUpdate(existingBanner._id, {
          imageUrl: cloudinaryResult.url,
          filename: cloudinaryResult.public_id,
          originalName: existingBanner.originalName || file,
          updatedAt: new Date()
        });
        
        console.log(`✓ Migrado: ${file} -> ${cloudinaryResult.url}`);
      } else {
        console.log(`⚠ No se encontró registro en BD para: ${file}`);
      }
    } catch (error) {
      console.error(`✗ Error migrando ${file}:`, error.message);
    }
  }
}

// Función principal
async function migrateToCloudinary() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI no está definida en las variables de entorno');
      return;
    }

    // Verificar configuración de Cloudinary
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Las variables de entorno de Cloudinary no están configuradas');
      console.error('Verificar: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
      return;
    }

    await mongoose.connect(uri);
    console.log('✓ Conectado a MongoDB');
    console.log('✓ Cloudinary configurado');

    // Migrar imágenes hero
    await migrateHeroImages();
    
    // Migrar banners promocionales
    await migratePromotionBanners();
    
    console.log('\n=== Migración Completada ===');
    console.log('Todas las imágenes han sido migradas a Cloudinary');
    console.log('Puedes eliminar manualmente el directorio public/uploads si todo funciona correctamente');
    
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateToCloudinary();
}

module.exports = { migrateToCloudinary };