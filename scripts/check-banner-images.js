require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function checkBannerImages() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('mundock');
    const banners = await db.collection('promotionbanners').find({}).toArray();
    
    console.log(`\nEncontrados ${banners.length} banners:\n`);
    
    banners.forEach((banner, index) => {
      console.log(`Banner ${index + 1}:`);
      console.log(`  ID: ${banner._id}`);
      console.log(`  Título: ${banner.title}`);
      console.log(`  URL de imagen: ${banner.imageUrl || 'NO DEFINIDA'}`);
      console.log(`  Activo: ${banner.isActive}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkBannerImages();