/**
 * Script para asegurar que los directorios de carga existan
 * Ejecutar con: node scripts/ensure-upload-dirs.js
 */

const fs = require('fs');
const path = require('path');

// Directorios que deben existir
const directories = [
  path.join('/data', 'files'),
  path.join('/data', 'files', 'uploads'),
  path.join('/data', 'files', 'uploads', 'properties'),
  path.join('/data', 'files', 'uploads', 'reviews'),
  path.join('/data', 'files', 'uploads', 'hero-images'),
];

// Crear directorios si no existen
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creando directorio: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`El directorio ya existe: ${dir}`);
  }
});

console.log('Directorios de carga verificados correctamente.');