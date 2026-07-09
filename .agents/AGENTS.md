# Reglas del Agente y Pautas del Proyecto (tours-virtuales)

Este documento define las reglas de comportamiento locales y pautas de diseño específicas para mí (copiloto de IA Antigravity) al trabajar en este proyecto.

---

## 🛠️ 1. Reglas Técnicas de Codificación

- **Estándar de Nomenclatura (Prefijo `inmo`):**
  - Nunca utilices el prefijo genérico "tour" o "tours" en este espacio de trabajo (para evitar conflictos con otros proyectos globales).
  - Utiliza siempre el prefijo **`inmo`** para tipos, configuraciones, bases de datos y scripts (ej: `InmoData`, `InmoSettings`, `InmoViewer.tsx`, `inmo-spec.json`, `inmo-composer.html`).
- **Sistema de Tipos Estricto:**
  - Cualquier cambio en la especificación JSON del inmueble debe sincronizarse y declararse formalmente en el archivo de tipos `src/types/inmo.ts`.
- **Validación Post-Edición:**
  - Tras modificar cualquier archivo de React o TypeScript, ejecuta siempre `npx tsc --noEmit` y `npm run build` para asegurar que el proyecto compile limpiamente y no rompa la visualización local del usuario.

---

## 🎨 2. Sistema de Diseño Premium Dark Inmobiliario

Cualquier nuevo componente UI o estilo añadido al proyecto debe adherirse estrictamente a los tokens del sistema de diseño definidos en `src/styles/variables.css`:

- **Colores de Fondo:** Gris oscuro / antracita (HLS `220, 15%, 8%` y `220, 15%, 12%`).
- **Acento Principal:** Dorado Champán (`var(--accent-gold): #d4af37`). Denota estatus, elegancia y exclusividad.
- **Tipografía:**
  - Sans-serif: `Outfit` (para menús, etiquetas, datos de ficha y UI interactiva).
  - Serif: `Playfair Display` (exclusivamente para títulos de propiedades y secciones destacadas).
- **Estilos de Cristal (Glassmorphic):**
  - Paneles flotantes deben usar fondos semitransparentes con desenfoque (`backdrop-filter: blur(12px)`) y bordes dorados tenues (`rgba(212, 175, 55, 0.15)`).

---

## 🤖 3. Directrices para Procesamiento de Imágenes (Unión, Limpieza y Decoración)

Cuando el usuario solicite procesar fotos de inmuebles (unión a 360°, eliminar desorden, limpiar paredes o amueblar virtualmente):

1. **Unión de fotos a 360° (Stitching):**
   - Toma las fotos planas de referencia en `ImagePaths`.
   - Llama a `generate_image` con un prompt técnico que indique fusionar las fotos en una proyección equirrectangular 360° sin distorsiones en las costuras.
2. **Limpieza Digital (Declutter & Clean):**
   - Llama a `generate_image` indicando en el prompt eliminar objetos personales, desorden, cables, logos y reparar/blanquear paredes sucias o con imperfecciones.
3. **Decoración y Amueblado Virtual (Virtual Staging):**
   - Conserva la escala y perspectiva de la foto original.
   - Aplica mobiliario fotorrealista según el estilo solicitado por el usuario (ej: *Minimalista*, *Vanguardia/Moderno*, *Industrial*).

---

## 🗄️ 4. Arquitectura de Almacenamiento Local (IndexedDB y Auto-Guardado)

Para evitar la pérdida accidental de datos por recargas de página en el visualizador o compositor:

- **Buzón Local Obligatorio:** Todos los borradores creados en el compositor deben auto-guardarse de forma local y persistente en la base de datos **IndexedDB** del navegador del usuario.
- **Mecanismo de Debounce (Auto-Guardado):** Implementar siempre un retardo de debounce de mínimo 800ms en el guardado automático ante eventos de teclado para evitar colapsar la base de datos durante la escritura en tiempo real.
- **Sincronización de Estado y Colapsibilidad (UX):**
  - **No intrusión:** El gestor de borradores debe estar en un panel colapsable (`#collapseBorradores`) oculto por defecto para evitar distraer al usuario nuevo, permitiéndole centrar su atención inmediata en rellenar la Ficha Comercial.
  - **Auto-Guardado en la Cabecera:** Mantener un indicador visual discreto del estado del auto-guardado en la cabecera del panel (`#autosave-badge`), siempre visible.
  - **Editando en tiempo real:** Mostrar el nombre activo (`Editando: [Nombre del Proyecto]`) conectado al campo de texto del título y actualizarlo en tiempo real al escribir.
  - **Sincronización del selector:** Asegurar que el selector dropdown de borradores esté sincronizado programáticamente con el ID del proyecto cargado (`selector.value = appState.projectId`).

