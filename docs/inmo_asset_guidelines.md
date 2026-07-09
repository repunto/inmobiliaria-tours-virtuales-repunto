# Guía de Optimización y Estándares Multimedia Inmobiliarios

Este documento establece las directrices técnicas obligatorias para la captura, procesamiento, optimización y exportación de todos los recursos gráficos, audiovisuales y de programación para la visualización de inmuebles en la plataforma. Su objetivo es garantizar una carga instantánea en dispositivos móviles, navegación ultra-fluida (60 FPS) y una presentación premium hiperrealista de los inmuebles.

---

## 📸 1. Imágenes 360° (Panorámicas Equirrectangulares)

Las panorámicas deben capturarse con cámaras SLR y lentes de ojo de pez en HDR, o mediante cámaras de 360° profesionales (ej. Ricoh Theta Z1, Insta360 Pro 2).

### Parámetros Técnicos de Exportación

- **Proyección:** Equirrectangular (proporción 2:1 exacta).
- **Formatos:** 
  - **AVIF (Principal):** Mejor relación calidad-compresión para navegadores modernos.
  - **WebP (Soporte/Fallback):** Excelente compatibilidad general.
- **Resoluciones Recomendadas:**
  - **Nivel Máximo (Ultra):** 8192 × 4096 px (Solo para equipos de escritorio rápidos o multirresolución por niveles).
  - **Estándar Premium (Recomendado):** 6000 × 3000 px. Ofrece nitidez excepcional en pantallas móviles y Retina sin saturar la GPU.
- **Configuración de Compresión:**
  - WebP: Compresión con pérdida (*lossy*), factor de calidad entre **75% y 82%**.
  - AVIF: Esfuerzo de compresión 6, factor de calidad entre **65 y 72**.
- **Tamaño de Archivo Objetivo:** Cada panorama individual **no debe exceder 1.8 MB** (óptimo < 900 KB en AVIF).

---

## 📦 2. Modelos y Escenas 3D (BIM, Renders, Gemelos Digitales)

Para la visualización interactiva de planos en 3D o fachadas, el motor soporta la carga dinámica de archivos de malla tridimensional.

### Parámetros Técnicos de Exportación

- **Formato:** **GLB (gLTF Binario)**. Integra geometría, texturas y animaciones en un solo archivo compacto.
- **Optimización de Geometría:**
  - Eliminar geometría oculta o no visible.
  - Mantener el número de polígonos por debajo de **150,000 triángulos** para todo el modelo.
- **Compresión de Malla:** Uso obligatorio del algoritmo **Draco Compression** (`gltf-pipeline`). Esto reduce el peso geométrico hasta en un 80%.
- **Sistema de Materiales (PBR):**
  - Utilizar el flujo de trabajo Standard Roughness/Metalness.
  - Las texturas de los canales deben combinarse o empaquetarse en mapas combinados (*channel packing*).
  - Resolución máxima de texturas: **2048 × 2048 px** (usar 1024 px para objetos pequeños).
- **Baking de Luces (Iluminación Global):**
  - Las luces y oclusiones ambientales del inmueble deben estar previamente calculadas y "horneadas" (*baked*) en los mapas de textura para garantizar un renderizado fluido a 60 FPS en móviles.

---

## 🎥 3. Archivos de Vídeo & Animación

Utilizados para hotspots interactivos explicativos, renders animados o tomas de dron.

- **Códecs y Contenedores:**
  - **WebM (Codec VP9/AV1):** Para navegadores con alta tasa de compresión.
  - **MP4 (Codec H.264 / H.265):** Compatibilidad garantizada, especialmente en iOS Safari.
- **Resolución:**
  - **1080p (Full HD - 1920 × 1080 px):** Límite máximo para reproducciones embebidas.
  - **720p (HD - 1280 × 720 px):** Recomendado para hotspots flotantes o vistas rápidas.
- **Tasa de Bits (Bitrate):**
  - Para 1080p: Max 2.5 - 3.5 Mbps.
  - Para 720p: Max 1.2 - 1.8 Mbps.

---

## 🔊 4. Recursos de Audio e Hilo Musical

El sonido ambiental aporta inmersión psicológica, elevando la percepción de exclusividad de una propiedad.

- **Formato:** **MP3** (tasa de bits constante a 128 kbps) o **AAC / M4A** (96 kbps) para alta fidelidad.
- **Configuración Espacial:**
  - **Mono:** Requerido para audios espaciales 3D en donde el volumen y balance se calculan dinámicamente según la posición del usuario en la escena.
  - **Estéreo:** Para música ambiental de fondo global del inmueble.

---

## 📂 5. Convención de Nombres y Organización de Archivos

Para evitar problemas de enlaces rotos en servidores Linux/Unix (sensibles a mayúsculas), utiliza siempre nombres en **minúsculas** y separados por **guiones medios (kebab-case)**:

```bash
# Correcto
living-room-main-view.webp
bathroom-detail-audio.mp3

# Incorrecto
Living Room Main View.WEBP
Bathroom_Detail_Audio.MP3
```
