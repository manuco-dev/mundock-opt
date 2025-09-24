// Usar fetch nativo de Node.js (disponible desde Node 18+)

// Función para hacer login y obtener token
async function login() {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123456'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    // Extraer cookie del header
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    return setCookieHeader;
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
}

// Función para listar usuarios
async function listUsers(cookie) {
  try {
    const response = await fetch('http://localhost:3001/api/admin/users', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });

    const data = await response.json();
    console.log('\n=== LISTAR USUARIOS ==');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error al listar usuarios:', error);
  }
}

// Función para crear usuario
async function createUser(cookie) {
  try {
    const newUser = {
      username: 'test_user_' + Date.now(),
      password: 'password123',
      email: 'test@example.com',
      role: 'admin'
    };

    const response = await fetch('http://localhost:3001/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify(newUser)
    });

    const data = await response.json();
    console.log('\n=== CREAR USUARIO ==');
    console.log('Status:', response.status);
    console.log('Request body:', JSON.stringify(newUser, null, 2));
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
  }
}

// Función principal
async function testUserAPI() {
  console.log('=== PRUEBA DE API DE USUARIOS ===\n');
  
  // 1. Login
  console.log('1. Haciendo login...');
  const cookie = await login();
  
  if (!cookie) {
    console.error('No se pudo obtener cookie de autenticación');
    return;
  }
  
  // 2. Listar usuarios antes
  console.log('\n2. Listando usuarios existentes...');
  await listUsers(cookie);
  
  // 3. Crear nuevo usuario
  console.log('\n3. Creando nuevo usuario...');
  await createUser(cookie);
  
  // 4. Listar usuarios después
  console.log('\n4. Listando usuarios después de crear...');
  await listUsers(cookie);
}

// Ejecutar prueba
testUserAPI().catch(console.error);