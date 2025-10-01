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

async function addAdminUser() {
  try {
    // Obtener datos del usuario desde argumentos de línea de comandos
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('❌ Uso incorrecto del script');
      console.log('Uso: node scripts/add-admin-user.js <username> <password> [email] [role]');
      console.log('Ejemplo: node scripts/add-admin-user.js nuevo_admin mi_password123 admin@email.com admin');
      console.log('Roles disponibles: admin, super_admin (por defecto: admin)');
      process.exit(1);
    }

    const username = args[0];
    const password = args[1];
    const email = args[2] || null;
    const role = args[3] || 'admin';

    // Validar role
    if (!['admin', 'super_admin'].includes(role)) {
      console.log('❌ Role inválido. Debe ser "admin" o "super_admin"');
      process.exit(1);
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      console.log('❌ La contraseña debe tener al menos 6 caracteres');
      process.exit(1);
    }

    // Conectar a MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:xhuDDNBuPGpZgnibDMmKCdYnInHFnaEl@caboose.proxy.rlwy.net:58303/mundock';
    
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');

    // Verificar si el usuario ya existe
    const existingUser = await AdminUser.findOne({ username: username });
    
    if (existingUser) {
      console.log(`❌ El usuario "${username}" ya existe`);
      console.log('Usuarios existentes:');
      const allUsers = await AdminUser.find({}, 'username role isActive createdAt');
      allUsers.forEach(user => {
        console.log(`  - ${user.username} (${user.role}) - Activo: ${user.isActive} - Creado: ${user.createdAt.toLocaleDateString()}`);
      });
      return;
    }

    // Crear hash de la contraseña
    console.log('🔄 Encriptando contraseña...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear nuevo usuario admin
    const newAdminUser = new AdminUser({
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
      isActive: true,
    });

    await newAdminUser.save();
    
    console.log('\n✅ Usuario administrador creado exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`📧 Email: ${email || 'No especificado'}`);
    console.log(`🛡️  Role: ${role}`);
    console.log(`📅 Creado: ${new Date().toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Puedes acceder al panel de administración en:');
    console.log('   http://localhost:3000/admin/login');
    console.log('   http://localhost:3001/admin/login (si el puerto 3000 está ocupado)');
    
    // Mostrar todos los usuarios admin existentes
    console.log('\n📋 Usuarios administradores actuales:');
    const allUsers = await AdminUser.find({}, 'username role isActive createdAt');
    allUsers.forEach((user, index) => {
      const status = user.isActive ? '🟢' : '🔴';
      console.log(`   ${index + 1}. ${status} ${user.username} (${user.role}) - ${user.createdAt.toLocaleDateString()}`);
    });
    
  } catch (error) {
    if (error.code === 11000) {
      console.log(`❌ Error: El usuario "${username}" ya existe en la base de datos`);
    } else {
      console.error('❌ Error al crear usuario admin:', error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar script
addAdminUser();