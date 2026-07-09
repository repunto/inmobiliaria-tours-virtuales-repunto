---
name: inmo-spec-builder
description: Habilidad local para gestionar, compilar y validar archivos de especificación JSON para inmuebles en 360 grados y maquetas 3D.
---

# Habilidad: Gestor de Especificaciones Inmobiliarias (inmo-spec-builder)

Esta habilidad le permite al agente validar, depurar y estructurar adecuadamente las especificaciones de propiedades inmobiliarias (`inmo-spec.json`) e integrarlas correctamente con el compositor local.

---

## 🛠️ 1. Validación de Esquema JSON

Cuando el usuario cree o modifique un archivo `inmo-spec.json`, debes comprobar:
1. **Consistencia de Escenas:** Todas las escenas del tour deben tener IDs únicos y un tipo definido (`panorama` o `3d-model`).
2. **Escena Inicial:** El campo `settings.initialSceneId` debe apuntar a una escena existente en el catálogo.
3. **Consistencia de Navegación (Hotspots):** Cada hotspot de tipo `navigation` debe tener un `targetSceneId` que apunte a una escena válida en el mismo archivo.
4. **Coordenadas de Plano de Planta:** Los cuartos en el plano `floorPlan.rooms` deben corresponder a IDs de escenas reales en el tour.

Puedes ejecutar el validador en scratch para asegurarte de que es semánticamente correcto:
```bash
node <appDataDir>\brain\<conversation-id>\scratch\validate_spec.js
```

---

## 🤖 2. Instrucciones para la Edición de Panoramas (Decoración y Staging con IA)

Cuando se procese una imagen con IA para incorporarla en el tour:
- **Limpieza de Paredes y logos:** El prompt de edición debe instruir remover marcas de agua, logos flotantes, imperfecciones de pintura en paredes y suciedad del suelo, manteniendo las texturas de los materiales originales si son de calidad.
- **Distribución de Luces:** El render debe aparentar tener iluminación horneada (iluminación global suave, sombras suaves bajo los muebles nuevos) para dar sensación de realismo tridimensional.
- **Alineación de Escala:** El mobiliario nuevo generado debe corresponder a la escala real de la habitación (evitar sofás gigantescos en cuartos pequeños o viceversa).


---

## 🌍 3. Integración de Entornos Google Earth & Street View con IA

Cuando el usuario use el botón de "Solicitar Entorno AI" e indique las coordenadas o dirección:

### Procedimiento de Captura:
1. Usar el navegador (`browser_subagent`) para buscar la dirección en Google Maps.
2. Hacer captura de pantalla del Street View (nivel de calle) apuntando a la fachada principal.
3. Activar la vista satelital / 3D orbitando el edificio (Google Earth) para capturar el contorno y terreno.

### Prompts de Generación de IA (`generate_image`):
- **Para la Fachada (Street View):**
  > "High-resolution equirectangular 360 panorama of a premium luxury house facade, clean exterior architectural rendering, warm sunset lighting, no cars, no electric wires, no pedestrians, no watermarks, professional real estate photography style, realistic textures, outfit-serif aesthetic context."
- **Para el Plano Satelital 3D (Google Earth):**
  > "3D orthographic architectural plot plan model, architectural maquette style of the house and its neighborhood surroundings, clean borders, minimal design, realistic grass and asphalt, no labels or symbols, representation of premium real estate property presentation."
