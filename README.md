# Visualizador de Inmuebles Premium (Real Estate)

Plataforma interactiva de visualización 3D, panoramas y soluciones multimedia avanzadas para el sector inmobiliario de alto nivel. Este proyecto está diseñado bajo un enfoque **dirigido por especificaciones (Spec-Driven)**, lo que permite renderizar y configurar cualquier propiedad de manera dinámica mediante la edición de archivos JSON de especificación estructurados.

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** v18.0 o superior
- **npm** v9.0 o superior

### Instalación de Dependencias

Instala los módulos de Node especificados:

```bash
npm install
```

### Ejecutar el Entorno de Desarrollo

Inicia el servidor local de desarrollo con recarga rápida (HMR):

```bash
npm run dev
```

El servidor se abrirá automáticamente en `http://localhost:3000`.

### Construcción para Producción

Genera el paquete optimizado y comprimido listo para producción en la carpeta `dist/`:

```bash
npm run build
```

---

## 📂 Estructura del Proyecto

El espacio de trabajo está organizado de la siguiente manera:

```
tours-virtuales/
├── docs/                     # Documentación técnica y especificaciones
│   ├── inmo_spec_driving.md  # Definición detallada del esquema JSON de inmuebles
│   └── inmo_asset_guidelines.md # Estándares de calidad y optimización multimedia
├── public/                   # Archivos estáticos de acceso directo
│   └── assets/
│       └── inmuebles/        # Carpetas estructuradas por propiedad/inmueble
│           └── propiedad-ejemplo/
│               └── inmo-spec.json # Datos de especificación de la propiedad
├── src/                      # Código fuente principal de la aplicación
│   ├── components/           # Componentes UI de React (visores 3D, paneles, etc.)
│   ├── core/                 # Motores lógicos y renderizado (Three.js/Fiber)
│   ├── styles/               # Sistema de diseño y variables visuales CSS
│   ├── types/                # Definiciones de tipos de TypeScript
│   │   └── inmo.ts           # Interfaces asociadas al esquema del inmueble
│   ├── App.tsx               # Componente principal
│   └── main.tsx              # Punto de entrada de la aplicación
```

---

## 🛠️ Desarrollo Basado en Especificaciones (Spec-Driven)

En lugar de programar de forma rígida cada pantalla y panorama para cada propiedad, la lógica visual y espacial se describe en un archivo JSON independiente (`inmo-spec.json`). 

El **InmoEngine** de la aplicación lee este archivo en tiempo de ejecución para:
1. Cargar y renderizar la escena activa (ya sea un panorama de 360° o un modelo 3D).
2. Posicionar hotspots interactivos (flechas de navegación, videos empotrados, popups de información) en coordenadas específicas.
3. Cargar música ambiental, audios de narración y galerías de fotos.

Para conocer el esquema detallado y la sintaxis de configuración, consulta [docs/inmo_spec_driving.md](file:///d:/Proyectos/tours-virtuales/docs/inmo_spec_driving.md).

---

## 📸 Estándares de Contenido Inmobiliario (Gráficos/Audiovisual)

Para mantener una experiencia de usuario fluida, interactiva y con tiempos de carga mínimos sin sacrificar la nitidez de los espacios inmobiliarios, los contenidos multimedia deben seguir estrictamente las pautas de exportación y optimización.

Consulte [docs/inmo_asset_guidelines.md](file:///d:/Proyectos/tours-virtuales/docs/inmo_asset_guidelines.md) para más detalles sobre resoluciones, bitrates y formatos recomendados (WebP, AVIF, GLTF/Draco, H.265).
