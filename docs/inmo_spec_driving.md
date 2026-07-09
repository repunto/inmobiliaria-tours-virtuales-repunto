# Ingeniería de Inmuebles Guiada por Especificaciones (Spec-Driving)

Este documento define el estándar del esquema de datos JSON utilizado para alimentar el motor de renderizado y visualización interactiva de inmuebles (`InmoEngine`). Cada propiedad se describe en su propio archivo de especificación (`inmo-spec.json`), desacoplando por completo la lógica del código de la presentación visual y espacial de las unidades inmobiliarias.

---

## 📐 Esquema de Datos del Inmueble (`inmo-spec.json`)

El archivo de configuración principal de cada propiedad debe seguir estrictamente la siguiente estructura de datos JSON.

```json
{
  "$schema": "./schema.json",
  "id": "propiedad-id-uuid",
  "title": "Apartamento Lux Vista",
  "description": "Exclusivo ático con vistas panorámicas al mar.",
  "coverImage": "/assets/inmuebles/lux-vista/media/cover.jpg",
  "author": "Samimunay Real Estate",
  "createdAt": "2026-07-09T08:00:00Z",
  "settings": {
    "initialSceneId": "lobby",
    "defaultTransitionDuration": 800,
    "autoRotate": {
      "enabled": true,
      "speed": 0.05,
      "idleDelay": 5000
    },
    "audio": {
      "ambientEnabled": true,
      "ambientVolume": 0.3
    }
  },
  "scenes": [
    {
      "id": "lobby",
      "name": "Recibidor Principal",
      "type": "panorama",
      "panoramaUrl": "/assets/inmuebles/lux-vista/panos/lobby.webp",
      "initialView": {
        "yaw": 0,
        "pitch": 0,
        "fov": 75
      },
      "limits": {
        "pitchMin": -60,
        "pitchMax": 60,
        "fovMin": 40,
        "fovMax": 100
      },
      "audio": {
        "url": "/assets/inmuebles/lux-vista/audio/ambient_lobby.mp3",
        "loop": true
      },
      "hotspots": [
        {
          "id": "to_living",
          "type": "navigation",
          "yaw": 45.2,
          "pitch": -5.0,
          "targetSceneId": "living_room",
          "title": "Ir al Salón Principal",
          "style": {
            "icon": "arrow-up",
            "color": "#d4af37",
            "pulse": true
          }
        },
        {
          "id": "info_chandelier",
          "type": "info",
          "yaw": -12.5,
          "pitch": 25.0,
          "title": "Lámpara de Cristal Murano",
          "description": "Lámpara de cristal soplado artesanal importada directamente de Italia.",
          "mediaUrl": "/assets/inmuebles/lux-vista/media/murano_detail.jpg",
          "style": {
            "icon": "info",
            "color": "#ffffff"
          }
        }
      ]
    }
  ],
  "floorPlan": {
    "imageUrl": "/assets/inmuebles/lux-vista/media/floorplan.png",
    "rooms": [
      {
        "sceneId": "lobby",
        "coords": { "x": 120, "y": 80 },
        "name": "Recibidor"
      }
    ]
  }
}
```

---

## 🛠️ Especificación de Parámetros Clave

### 1. Sistema de Coordenadas de la Escena (Spherical Coordinates)
Para simplificar la colocación de Hotspots en los panoramas equirrectangulares de 360°, utilizamos el sistema de ángulos esféricos:
- **`yaw` (Guiñada):** Ángulo horizontal expresado en grados sexagesimales de `[-180, 180]`. `0` representa el frente de la cámara, `90` derecha, `-90` izquierda, `180` o `-180` atrás.
- **`pitch` (Cabeceo):** Ángulo vertical expresado en grados de `[-90, 90]`. `0` es el horizonte, `90` cenit, `-90` nadir.
- **`fov` (Campo de Visión):** Controla el nivel de zoom o apertura focal en grados de `[10, 120]`.

---

### 2. Tipología de Hotspots (`hotspots[].type`)

El motor de renderizado instanciará componentes UI dinámicos según el tipo de Hotspot configurado:

| Tipo (`type`) | Parámetros Requeridos | Comportamiento en Click | Caso de Uso |
| :--- | :--- | :--- | :--- |
| **`navigation`** | `targetSceneId` | Transiciona la vista 3D hacia la escena indicada, aplicando efectos de fundido visual. | Moverse entre habitaciones del inmueble. |
| **`info`** | `title`, `description` | Abre un modal emergente con diseño premium (glassmorphic) con texto e imagen descriptiva opcional. | Resaltar materiales, acabados premium o mobiliario. |
| **`video`** | `mediaUrl` | Abre un reproductor de vídeo flotante o empotra un vídeo interactivo directamente en la escena. | Mostrar vistas de dron, encendido de chimeneas o automatización domótica. |
| **`link`** | `contentUrl` | Abre una pestaña externa con una URL especificada. | Redirigir a reservas, pasarela de pago o ficha catastral. |

---

### 3. Ajustes de la Planta Interactiva (`floorPlan`)
- **`floorPlan.imageUrl`:** Plano de distribución 2D del inmueble optimizado en formato transparente PNG o SVG.
- **`rooms[].coords`:** Coordenadas en píxeles `(x, y)` relativas al tamaño original del plano, para posicionar un radar interactivo de mirada (`yaw`).

---

## 💡 Ventajas de este Modelo
- **Escalabilidad Inmobiliaria:** Permite añadir nuevas propiedades subiendo archivos `inmo-spec.json` a la CDN, sin compilar de nuevo la aplicación.
- **Fácil Edición:** Asistentes y agentes inmobiliarios pueden estructurar los recorridos rellenando plantillas.
- **Optimización de Caché:** Archivos de especificación ligeros para una carga ultrarrápida.
