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

// Función para subir imágenes hero
async function uploadHeroImages() {
  console.log('\n=== Subiendo Imágenes Hero a Cloudinary ===');
  
  const heroDir = path.join(__dirname, '..', 'public', 'uploads', 'hero');
  
  if (!fs.existsSync(heroDir)) {
    console.log('No se encontró el directorio de imágenes hero');
    return [];
  }
  
  const files = fs.readdirSync(heroDir);
  console.log(`Encontrados ${files.length} archivos en el directorio hero`);
  
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(heroDir, file);
    
    try {
      console.log(`Subiendo imagen hero: ${file}`);
      
      // Subir a Cloudinary
      const cloudinaryResult = await uploadToCloudinary(filePath, 'hero');
      
      results.push({
        originalFile: file,
        localPath: `/uploads/hero/${file}`,
        cloudinaryUrl: cloudinaryResult.url,
        publicId: cloudinaryResult.public_id
      });
      
      console.log(`✓ Subida: ${file} -> ${cloudinaryResult.url}`);
    } catch (error) {
      console.error(`✗ Error subiendo ${file}:`, error.message);
    }
  }
  
  return results;
}

// Función para subir banners promocionales
async function uploadPromotionBanners() {
  console.log('\n=== Subiendo Banners Promocionales a Cloudinary ===');
  
  const bannersDir = path.join(__dirname, '..', 'public', 'uploads', 'promotion-banners');
  
  if (!fs.existsSync(bannersDir)) {
    console.log('No se encontró el directorio de banners promocionales');
    return [];
  }
  
  const files = fs.readdirSync(bannersDir);
  console.log(`Encontrados ${files.length} archivos en el directorio promotion-banners`);
  
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(bannersDir, file);
    
    try {
      console.log(`Subiendo banner: ${file}`);
      
      // Subir a Cloudinary
      const cloudinaryResult = await uploadToCloudinary(filePath, 'banners');
      
      results.push({
        originalFile: file,
        localPath: `/uploads/promotion-banners/${file}`,
        cloudinaryUrl: cloudinaryResult.url,
        publicId: cloudinaryResult.public_id
      });
      
      console.log(`✓ Subido: ${file} -> ${cloudinaryResult.url}`);
    } catch (error) {
      console.error(`✗ Error subiendo ${file}:`, error.message);
    }
  }
  
  return results;
}

// Función principal
async function uploadImagesToCloudinary() {
  try {
    // Verificar configuración de Cloudinary
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Las variables de entorno de Cloudinary no están configuradas');
      console.error('Verificar: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
      return;
    }

    console.log('✓ Cloudinary configurado');
    console.log(`Cloud Name: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);

    // Subir imágenes hero
    const heroResults = await uploadHeroImages();
    
    // Subir banners promocionales
    const bannerResults = await uploadPromotionBanners();
    
    console.log('\n=== Resumen de Subida ===');
    console.log(`Imágenes Hero subidas: ${heroResults.length}`);
    console.log(`Banners subidos: ${bannerResults.length}`);
    
    if (heroResults.length > 0) {
      console.log('\n--- URLs de Imágenes Hero ---');
      heroResults.forEach(result => {
        console.log(`${result.originalFile}: ${result.cloudinaryUrl}`);
      });
    }
    
    if (bannerResults.length > 0) {
      console.log('\n--- URLs de Banners ---');
      bannerResults.forEach(result => {
        console.log(`${result.originalFile}: ${result.cloudinaryUrl}`);
      });
    }
    
    console.log('\n=== Subida Completada ===');
    console.log('Todas las imágenes han sido subidas a Cloudinary');
    console.log('Ahora puedes actualizar manualmente las URLs en la base de datos o usar el dashboard para reemplazar las imágenes.');
    
  } catch (error) {
    console.error('Error durante la subida:', error);
  }
}

// Ejecutar subida
if (require.main === module) {
  uploadImagesToCloudinary();
}

module.exports = { uploadImagesToCloudinary };