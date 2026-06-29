# scripts/extract_images_from_pdf.ps1
#
# Ejemplo de script PowerShell para extraer imágenes de un PDF en Windows.
# Requisitos (uno de los siguientes debe estar instalado):
# - ImageMagick (magick.exe disponible en PATH)
# - Poppler utils (pdftoppm o pdfimages)
#
# Uso (ImageMagick):
#   .\scripts\extract_images_from_pdf.ps1 -PdfPath "C:\Users\Anadeisy Ruano\Downloads\CATALOGO PRECIO.pdf" -OutDir "assets/productos"
#
# Nota: este script exporta imágenes por página. El renombrado y la asociación de texto
# con la imagen (nombre_precio_comentario.jpg) debe hacerse manualmente o con OCR.

param(
	[Parameter(Mandatory=$true)]
	[string]$PdfPath,

	[Parameter(Mandatory=$true)]
	[string]$OutDir
)

if (!(Test-Path $PdfPath)) {
	Write-Error "No se encontró el PDF: $PdfPath"
	exit 1
}

# Asegurar que el directorio de salida existe
if (!(Test-Path $OutDir)) {
	New-Item -ItemType Directory -Path $OutDir | Out-Null
}

# Intentar usar ImageMagick (magick)
$magick = Get-Command magick -ErrorAction SilentlyContinue
if ($magick) {
	Write-Host "Usando ImageMagick (magick) para exportar imágenes por página..."
	# Genera un archivo por página: output-0001.jpg, output-0002.jpg, ...
	$basename = Join-Path $OutDir "page"
	& magick convert -density 300 "$PdfPath" "$basename-%04d.jpg"
	Write-Host "Exportadas imágenes en: $OutDir"
	exit 0
}

# Si no hay magick, intentar pdftoppm (poppler)
$pdftoppm = Get-Command pdftoppm -ErrorAction SilentlyContinue
if ($pdftoppm) {
	Write-Host "Usando pdftoppm (poppler) para exportar imágenes por página..."
	$basename = Join-Path $OutDir "page"
	& pdftoppm -jpeg -r 300 "$PdfPath" "$basename"
	Write-Host "Exportadas imágenes en: $OutDir"
	exit 0
}

Write-Error "No se encontró ImageMagick ni pdftoppm en el sistema. Instala uno para usar este script."
exit 1
