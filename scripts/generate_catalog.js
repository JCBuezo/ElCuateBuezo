/*
  scripts/generate_catalog.js
  - Lee los archivos en assets/productos
  - Interpreta el nombre del archivo con el formato: Nombre _ Precio _ Comentario.ext
  - Genera catalogo.json con una entrada por archivo:
    { filename, nombre, precio, comentario }

  Uso:
    node scripts/generate_catalog.js

  Requisitos:
    - Node.js instalado
*/

const fs = require('fs');
const path = require('path');

const productosDir = path.join(__dirname, '..', 'assets', 'productos');
const outputFile = path.join(__dirname, '..', 'catalogo.json');

function parseFilename(file) {
  // Elimina extensión
  const nameOnly = file.replace(/\.[^/.]+$/, '');

  // Separar por ' _ ' (espacio-guion bajo-espacio) o por '_' simple para robustez
  let parts = nameOnly.split(' _ ');
  if (parts.length === 1) parts = nameOnly.split('_');

  // Trim de cada parte
  parts = parts.map(p => p.trim());

  // Asignar campos
  const nombre = parts[0] || '';
  const precio = parts[1] || '';
  const comentario = parts.slice(2).join(' _ ') || ''; // permitir '_' dentro del comentario

  return { nombre, precio, comentario };
}

function generateCatalog() {
  if (!fs.existsSync(productosDir)) {
    console.error('Directorio no encontrado:', productosDir);
    process.exit(1);
  }

  const files = fs.readdirSync(productosDir).filter(f => {
    // Ignorar archivos ocultos y .gitkeep
    return !f.startsWith('.') && f.toLowerCase() !== '.gitkeep';
  });

  const catalog = files.map(file => {
    const parsed = parseFilename(file);
    return {
      filename: file,
      nombre: parsed.nombre,
      precio: parsed.precio,
      comentario: parsed.comentario
    };
  });

  fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('catalogo.json generado con', catalog.length, 'elementos.');
}

// Ejecutar cuando se invoca directamente
if (require.main === module) {
  generateCatalog();
}

module.exports = { generateCatalog };
