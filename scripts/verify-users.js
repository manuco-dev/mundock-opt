const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Esquema del usuario admin (duplicado para el script)
const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

async function verifyUsers() {
  try {
    // Conectar a MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:xhuDDNBuPGpZgnibDMmKCdYnInHFnaEl@caboose.proxy.rlwy.net:58303/mundock';
    
    console.log('🔍 Conectando a MongoDB para verificar usuarios...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');

    // Obtener todos los usuarios
    const users = await AdminUser.find({}).sort({ createdAt: -1 });
    
    console.log('\n📊 RESUMEN DE USUARIOS EN LA BASE DE DATOS:');
    console.log('=' .repeat(50));
    console.log(`Total de usuarios: ${users.length}`);
    
    if (users.length === 0) {
      console.log('⚠️  No se encontraron usuarios en la base de datos');
    } else {
      console.log('\n👥 LISTA DE USUARIOS:');
      console.log('-'.repeat(50));
      
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. Usuario: ${user.username}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Email: ${user.email || 'No especificado'}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   Estado: ${user.isActive ? 'Activo' : 'Inactivo'}`);
        console.log(`   Creado: ${user.createdAt.toLocaleString()}`);
        if (user.lastLogin) {
          console.log(`   Último login: ${user.lastLogin.toLocaleString()}`);
        } else {
          console.log(`   Último login: Nunca`);
        }
      });
    }
    
    // Estadísticas por rol
    const adminCount = users.filter(u => u.role === 'admin').length;
    const superAdminCount = users.filter(u => u.role === 'super_admin').length;
    const activeCount = users.filter(u => u.isActive).length;
    const inactiveCount = users.filter(u => !u.isActive).length;
    
    console.log('\n📈 ESTADÍSTICAS:');
    console.log('-'.repeat(30));
    console.log(`Administradores: ${adminCount}`);
    console.log(`Super Administradores: ${superAdminCount}`);
    console.log(`Usuarios activos: ${activeCount}`);
    console.log(`Usuarios inactivos: ${inactiveCount}`);
    
    // Verificar integridad de datos
    console.log('\n🔍 VERIFICACIÓN DE INTEGRIDAD:');
    console.log('-'.repeat(35));
    
    let hasIssues = false;
    
    users.forEach((user, index) => {
      const issues = [];
      
      if (!user.username || user.username.trim() === '') {
        issues.push('Username vacío');
      }
      
      if (!user.password || user.password.trim() === '') {
        issues.push('Password vacío');
      }
      
      if (!['admin', 'super_admin'].includes(user.role)) {
        issues.push('Rol inválido');
      }
      
      if (typeof user.isActive !== 'boolean') {
        issues.push('Estado isActive inválido');
      }
      
      if (issues.length > 0) {
        console.log(`❌ Usuario ${user.username} (${user._id}): ${issues.join(', ')}`);
        hasIssues = true;
      }
    });
    
    if (!hasIssues) {
      console.log('✅ Todos los usuarios tienen datos válidos');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Verificación completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    if (error.code === 'ENOTFOUND') {
      console.error('💡 Verifica que la URL de MongoDB sea correcta y que tengas conexión a internet');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar verificación
verifyUsers();

// Exportar función para uso en otros scripts
module.exports = { verifyUsers };