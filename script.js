/*
  Archivo: script.js
  Propósito: Lógica de cliente (interactividad ligera) para la página.

  Esta versión mantiene la funcionalidad existente (menú, año, enlaces genéricos de WhatsApp)
  y añade carga dinámica del catálogo a partir de catalogo.json.
*/

// Número de teléfono destino en formato internacional (sin signos ni espacios)
const whatsappNumber = "50258746963";

// Mensaje por defecto que se incluirá en la conversación de WhatsApp (enlaces globales)
const defaultMessage =
  "Hola, quiero informacion sobre ELCUATEBUEZOWEB.";

// Construcción de la URL de WhatsApp (wa.me) con el mensaje codificado
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

// Asigna la URL por defecto a enlaces globales (header/footer)
const whatsappLinks = document.querySelectorAll(".js-whatsapp-link");
whatsappLinks.forEach((link) => {
  link.href = whatsappUrl;
});

// --- Actualizar año dinámicamente en el footer ---
const currentYear = document.getElementById("currentYear");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// --- Lógica del menú responsive ---
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =============================
// Catálogo dinámico
// =============================

const catalogFile = 'catalogo.json';
const catalogContainer = document.getElementById('catalogoGrid');

// Mensaje de WhatsApp para un producto (requerimiento: mensaje personalizado)
function buildWhatsappLink(product) {
  const message = `Hola, vi el catálogo y quiero información sobre: ${product.nombre}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Crea una tarjeta DOM a partir del objeto producto (estructura esperada en catalogo.json):
// { nombre, categoria, descripcion, precio, imagen }
function createProductCard(product) {
  const article = document.createElement('article');
  article.className = 'product-card';

  // Imagen: product.imagen ya incluye la ruta relativa (assets/productos/archivo.jpg)
  const img = document.createElement('img');
  img.src = product.imagen;
  img.alt = product.nombre || 'Producto';
  article.appendChild(img);

  // Contenedor de info
  const info = document.createElement('div');
  info.className = 'product-info';

  const tag = document.createElement('p');
  tag.className = 'product-tag';
  tag.textContent = product.categoria || '';
  info.appendChild(tag);

  const title = document.createElement('h3');
  title.textContent = product.nombre || '';
  info.appendChild(title);

  if (product.descripcion) {
    const comment = document.createElement('p');
    comment.className = 'product-comment';
    comment.textContent = product.descripcion;
    info.appendChild(comment);
  }

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = product.precio || 'Consultar';
  info.appendChild(price);

  // Acciones (botón consultar por WhatsApp)
  const actions = document.createElement('div');
  actions.className = 'product-actions';

  const btn = document.createElement('a');
  btn.className = 'btn btn-primary';
  btn.textContent = 'Consultar por WhatsApp';
  btn.href = buildWhatsappLink(product);
  btn.target = '_blank';
  btn.rel = 'noopener';

  actions.appendChild(btn);
  info.appendChild(actions);

  article.appendChild(info);
  return article;
}

// Carga el catálogo desde catalogo.json y renderiza las tarjetas
async function loadCatalog() {
  if (!catalogContainer) return;

  try {
    const res = await fetch(catalogFile, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo cargar catalogo.json');

    const products = await res.json();

    // Vaciar contenido previo
    catalogContainer.innerHTML = '';

    if (!Array.isArray(products) || products.length === 0) {
      catalogContainer.innerHTML = '<p>No hay productos en el catálogo. Agrega imágenes a assets/productos y genera catalogo.json.</p>';
      return;
    }

    // Renderizar cada producto
    products.forEach(product => {
      const card = createProductCard(product);
      catalogContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    catalogContainer.innerHTML = '<p>Error cargando el catálogo. Revisa catalogo.json en la raíz del proyecto.</p>';
  }
}

// Ejecutar la carga del catálogo al final del script
loadCatalog();

// Fin de script
