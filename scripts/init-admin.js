const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Esquema del usuario admin (duplicado aquí para el script)
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

async function initAdmin() {
  try {
    // Conectar a MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:xhuDDNBuPGpZgnibDMmKCdYnInHFnaEl@caboose.proxy.rlwy.net:58303/mundock';
    
    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB exitosamente');

    // Verificar si ya existe un admin
    const existingAdmin = await AdminUser.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('El usuario admin ya existe');
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      console.log('Created:', existingAdmin.createdAt);
      return;
    }

    // Crear hash de la contraseña
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123456';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario admin
    const adminUser = new AdminUser({
      username: username,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    });

    await adminUser.save();
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Role: super_admin');
    console.log('');
    console.log('Puedes acceder al panel de administración en: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

// Ejecutar script
initAdmin();