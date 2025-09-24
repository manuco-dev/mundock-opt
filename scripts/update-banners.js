const mongoose = require('mongoose');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Definir el esquema del banner
const promotionBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  customTitle: { type: String },
  customDescription: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const PromotionBanner = mongoose.model('PromotionBanner', promotionBannerSchema);

async function updateBanners() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI no está definida en las variables de entorno');
      return;
    }

    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');

    // Buscar todos los banners
    const allBanners = await PromotionBanner.find({});
    console.log(`Encontrados ${allBanners.length} banners en total`);

    // Buscar banners que no tengan los campos customTitle o customDescription
    const bannersToUpdate = await PromotionBanner.find({
      $or: [
        { customTitle: { $exists: false } },
        { customDescription: { $exists: false } }
      ]
    });

    console.log(`Encontrados ${bannersToUpdate.length} banners para actualizar`);

    for (const banner of bannersToUpdate) {
      console.log(`Actualizando banner: ${banner._id}`);
      
      await PromotionBanner.updateOne(
        { _id: banner._id },
        {
          $set: {
            customTitle: banner.customTitle || null,
            customDescription: banner.customDescription || null
          }
        }
      );
    }

    console.log('Actualización completada');
    
    // Mostrar todos los banners actualizados
    const updatedBanners = await PromotionBanner.find({});
    console.log('\nBanners en la base de datos:');
    updatedBanners.forEach(banner => {
      console.log(`- ID: ${banner._id}`);
      console.log(`  Title: ${banner.title}`);
      console.log(`  Custom Title: ${banner.customTitle || 'No definido'}`);
      console.log(`  Custom Description: ${banner.customDescription || 'No definido'}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateBanners();