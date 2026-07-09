# Estrategia de Marketing Inmobiliario Inmersivo y Video Marketing Proptech

Este documento detalla la estrategia de uso de nuestro **Centro de Operaciones de Inmuebles 3D y Vídeo (`composer.html`)**. Está redactado en un lenguaje claro y accesible para ayudarte a conseguir visitas y reservas recurrentes sin costes de licenciamiento.

---

## 🧭 1. Flujo de Trabajo Operativo (Paso a Paso)

Para lograr un resultado profesional y de alta calidad para tus propiedades, sigue este sencillo flujo:

1. **Captura Fotográfica:**
   - Toma fotografías 360° en cada habitación. Mantén la cámara a la altura de los ojos (aproximadamente 1.5 metros).
   - Asegúrate de encender todas las luces de la propiedad y abrir las cortinas para maximizar la luminosidad natural.
   - Retírate del espacio o escóndete detrás de una pared para no aparecer en la toma.
2. **Carga en el Compositor y Borradores:**
   - Abre `composer.html` haciendo doble clic desde tu ordenador.
   - Verás la cabecera limpia de la herramienta. El indicador discreto en la parte superior te mostrará en verde `● Auto-Guardado` indicando que tus cambios se guardan automáticamente en tu ordenador.
   - Empieza a rellenar la **Ficha Comercial** (título, precio, ubicación, etc.) directamente.
   - Si deseas recuperar un trabajo anterior, empezar un proyecto nuevo o borrar uno existente, haz clic en el botón **"📂 Borradores"** de la cabecera para abrir el panel de control histórico. Al escribir el título de la propiedad, verás que el nombre de lo que estás editando se actualiza allí dentro en tiempo real.
   - En la sección **"Fotos 360° y Espacios de la Propiedad"**, haz clic en **"Añadir Foto"** para subir las panorámicas de tus ambientes.
3. **Interconexión (Hotspots):**
   - Mira a través del visor del panel derecho y busca dónde quieres colocar una flecha para ir a la siguiente habitación.
   - Haz clic en esa parte exacta de la imagen. La herramienta capturará el `Pitch` y `Yaw`.
   - Rellena la información del hotspot, enlázalo con la escena destino y guárdalo.
4. **Exportación Final:**
   - Ve a la sección de **Exportación Avanzada** y haz clic en **"Descargar Archivo Web (.html)"**.
   - Esto compilará toda la información comercial y las imágenes en un único archivo de poco peso, listo para compartir.

---

## 🌐 2. Estrategia de Hosting Gratuito Ilimitado (Publicación Web)

Dado que el archivo exportado es un HTML estándar y 100% autocontenido (contiene toda la lógica y las fotos incrustadas como texto Base64), puedes alojarlo de forma gratuita en la web para obtener un enlace público ilimitado y compartirlo.

### Opción A: GitHub Pages (Recomendada para catalogar múltiples propiedades)
1. Créate una cuenta gratuita en [GitHub](https://github.com).
2. Crea un nuevo repositorio público (ejemplo: `mis-propiedades`).
3. Sube el archivo HTML que descargaste directamente a la interfaz web de GitHub y ponle un nombre amigable, por ejemplo `apartamento-lux.html`.
4. Activa **GitHub Pages** en la pestaña *Settings* -> *Pages* del repositorio, seleccionando la rama `main` y guardando.
5. Obtendrás un enlace permanente como: `https://tu-usuario.github.io/mis-propiedades/apartamento-lux.html`.

### Opción B: Netlify Drop (La más rápida y fácil, sin código)
1. Entra en [Netlify Drop](https://app.netlify.com/drop).
2. Arrastra una carpeta que contenga tu archivo HTML (asegúrate de renombrar el archivo a `index.html` para que sea tu página de inicio en esa carpeta).
3. Netlify creará un sitio web instantáneo y te dará un enlace público permanente de forma gratuita que puedes enviar por WhatsApp o correo.

---

## 🔗 3. Generación de Código Embed (Iframe) para tu Web

Una vez que tengas el enlace público de tu propiedad (usando GitHub o Netlify), puedes incrustar el tour virtual en la ficha técnica de tus portales o en tu web principal (WordPress, Wix, Webflow).

Utiliza la caja generadora del Compositor o el siguiente código estándar:

```html
<iframe 
  src="TU_ENLACE_PUBLICO_AQUI" 
  width="100%" 
  height="600px" 
  frameborder="0" 
  allowfullscreen 
  allow="gyroscope; accelerometer">
</iframe>
```

> [!TIP]
> Asegúrate de incluir los permisos `allow="gyroscope; accelerometer"` en el iframe. Esto permite que los clientes que abran tu página web desde un teléfono móvil puedan mirar a su alrededor inclinando o girando físicamente su smartphone, brindándoles una experiencia de realidad virtual inmersiva espectacular.

---

## 🎬 4. Estrategia de Video Marketing para Redes Sociales (TikTok, Reels, Shorts)

El formato de vídeo corto es actualmente la fuente de tráfico orgánico más potente para captar compradores e inversores inmobiliarios. La herramienta cuenta con un **Modo Video Marketing** diseñado para simplificar la creación de este contenido.

### Pasos para crear un Clip Viral (Formato 9:16):
1. **Activa el Lienzo Vertical:** En la barra de herramientas del Compositor, cambia el formato a **9:16 (Vertical)**. El visor se adaptará instantáneamente a la forma de una pantalla de móvil.
2. **Inicia el Auto-Tour (Modo Drone):** Haz clic en el botón de auto-rotación. El visor comenzará a girar de forma constante, simulando una toma fluida y estabilizada de interiores.
3. **Grabación de Pantalla:**
   - **En PC (OBS Studio):** Abre OBS Studio, añade una captura de ventana de tu navegador, ajusta el lienzo a 1080x1920 y graba el movimiento del visor.
   - **En Móvil:** Abre el Compositor en tu móvil o tablet, activa la grabación de pantalla nativa de iOS o Android, y realiza el recorrido.
4. **Edición Corta:**
   - Lleva la grabación a tu editor móvil preferido (CapCut, Premiere Rush).
   - Añade una música en tendencia de fondo (piano suave o ritmos lo-fi elegantes).
   - Pon textos en pantalla con ganchos comerciales potentes: *"¿Vivirías en un ático con esta vista al mar por USD 250k? Escribe INFO en comentarios"*.
   - Añade una narración de voz explicando los acabados que se muestran en los hotspots de información.

---

## 🔮 5. Visión Proptech de Vanguardia

Este compositor es solo la primera pieza de un ecosistema que podemos construir en este espacio de trabajo:
- **Tasador Virtual con IA:** Un estimador que analice los m², baños e historial de la zona para dar un precio sugerido de salida.
- **Generador de Copywriting Inmobiliario:** Un módulo de IA local que redacte descripciones persuasivas con técnicas de venta AIDA (Atención, Interés, Deseo, Acción) optimizadas para SEO.
- **CRM Inmobiliario Integrado:** Un pequeño panel para captar los leads que dejen sus datos directamente dentro del tour virtual de la propiedad.
