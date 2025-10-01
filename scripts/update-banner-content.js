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

async function updateBannerContent() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI no está definida en las variables de entorno');
      return;
    }

    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');

    // Actualizar banners con contenido personalizado
    const updates = [
      {
        title: 'Descuento4',
        customTitle: '🏖️ 25% DESCUENTO',
        customDescription: 'Apartamentos frente al mar en Cartagena. ¡Reserva ahora y ahorra!'
      },
      {
        title: 'Oferta Junio',
        customTitle: '🏡 Casa Finca Turbaco',
        customDescription: 'Piscina privada, jardín tropical y tranquilidad absoluta'
      },
      {
        title: 'Oferya diciembre',
        customTitle: '🎄 Oferta Especial Diciembre',
        customDescription: 'Celebra las fiestas en el paraíso. Precios únicos por temporada'
      },
      {
        title: 'Oferta Vans',
        customTitle: '🚐 Aventura en Van',
        customDescription: 'Explora Colombia con comodidad. Van totalmente equipada'
      }
    ];

    for (const update of updates) {
      const result = await PromotionBanner.updateOne(
        { title: update.title },
        {
          $set: {
            customTitle: update.customTitle,
            customDescription: update.customDescription
          }
        }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✓ Actualizado banner: ${update.title}`);
      } else {
        console.log(`⚠ No se encontró banner con título: ${update.title}`);
      }
    }

    console.log('\nActualización de contenido completada');
    
    // Mostrar todos los banners actualizados
    const updatedBanners = await PromotionBanner.find({ isActive: true }).sort({ order: 1 });
    console.log('\nBanners activos en la base de datos:');
    updatedBanners.forEach((banner, index) => {
      console.log(`${index + 1}. ${banner.customTitle || banner.title}`);
      console.log(`   Descripción: ${banner.customDescription || 'No definida'}`);
      console.log(`   URL: ${banner.imageUrl}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateBannerContent();