Instrucciones para regenerar catalogo.json y agregar imágenes al catálogo

Resumen:
- Coloca las imágenes del catálogo en la carpeta: assets/productos
- Nombra cada archivo con el formato: Nombre del producto _ Precio _ Comentario.ext
  Ejemplo: Bateria 19 disparos _ Q 200 _ Ideal para fiestas familiares.jpg

Generar catalogo.json automáticamente (recomendado):
1. Asegúrate de tener Node.js instalado.
2. Ejecuta desde la raíz del proyecto:
   node scripts/generate_catalog.js
3. El script leerá todos los archivos dentro de assets/productos (ignora .gitkeep)
   y generará catalogo.json en la raíz del proyecto con una entrada por cada imagen.

Notas sobre el formato del nombre de archivo:
- El script busca separadores " _ " o "_". Separa en: nombre, precio, comentario.
- Si el nombre contiene "_" adicionales, el comentario incluirá todo el resto.
- Es importante revisar catalogo.json después de generar para corregir nombres si es necesario.

Extraer imágenes desde un PDF (Windows):
- Uso del script PowerShell incluido (scripts/extract_images_from_pdf.ps1):
  1. Instala ImageMagick (https://imagemagick.org) o Poppler (https://poppler.freedesktop.org).
  2. Ejecuta desde PowerShell (ejemplo):
	 .\scripts\extract_images_from_pdf.ps1 -PdfPath "C:\Users\Anadeisy Ruano\Downloads\CATALOGO PRECIO.pdf" -OutDir "assets/productos"
  3. El script exportará imágenes por página (page-0001.jpg, ...). Luego debes renombrar
	 cada imagen siguiendo el formato: Nombre _ Precio _ Comentario.jpg

Mantener compatibilidad con GitHub Pages:
- Todos los archivos son estáticos (HTML, CSS, JS, JSON, imágenes) y se pueden publicar
  directamente en GitHub Pages.
- Después de subir las imágenes y ejecutar node scripts/generate_catalog.js, confirma
  que catalogo.json está en la rama principal y los archivos están commiteados.

Prueba local rápida (sin servidor):
- En la mayoría de navegadores fetch() para archivos locales falla cuando se abre index.html
  con file://. Para probar localmente, usa un servidor estático sencillo.
  Ejemplo con Node (desde la raíz del proyecto):
	npx http-server -c-1 .
  o con Python 3:
	python -m http.server 8000
  Luego visita http://localhost:8080 o http://localhost:8000 según el servidor.

Soporte y comprobaciones:
- Si las imágenes no aparecen, revisa la consola del navegador para errores al cargar catalogo.json
  o recursos con nombres mal codificados.
- Si hay problemas con caracteres especiales en nombres de archivo, renómbralos con caracteres
  simples (espacios y guiones bajos permiten, pero evita símbolos raros).

