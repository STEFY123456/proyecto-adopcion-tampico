# Salvando Patitas Tampico

Sitio con cinco páginas HTML independientes y CSS convencional. La navegación
abre documentos reales y no depende de JavaScript, React ni Tailwind.

## Archivos

- `index.html`: Inicio.
- `adopcion.html`: Perritos en Adopción.
- `proceso.html`: Proceso de Adopción y testimonios.
- `ayudar.html`: Cómo Puedes Ayudar.
- `contacto.html`: información de contacto y formulario de muestra.
- `src/index.css`: estilos compartidos.
- `src/assets/dogs.svg`: ilustración original de los nueve perros.

Los enlaces abren cada página en la misma pestaña. El menú móvil usa el elemento
HTML nativo `details`. Todos los perritos y testimonios se muestran sin depender
de paginación ni carruseles de JavaScript. Los antiguos archivos `src/main.js`
y `src/main.tsx` no se cargan desde las páginas actuales.

## Uso

En Figma Make, la vista previa ya está ejecutándose y se actualiza automáticamente.
Vite se conserva únicamente como herramienta de desarrollo y empaquetado.

- `pnpm build`: generar las cinco páginas de producción en `dist/`.
- `pnpm format`: aplicar el formateador del proyecto.
- `python3 scripts/export-html.py`: actualizar el ZIP para la profesora.

Puedes abrir `index.html` directamente en el navegador. Mantén los archivos
HTML y la carpeta `src` juntos. Las fuentes de Google y las fotos existentes
de Unsplash necesitan conexión a Internet.

## Entrega para la profesora

El enlace del pie de página descarga
`public/entrega/salvando-patitas-html-css.zip`. Extrae todo el ZIP y abre
`Salvando-Patitas/index.html` con doble clic.

Contiene los cinco archivos HTML enlazados, `estilos.css`, la ilustración SVG
y las instrucciones. No contiene JavaScript ni requiere instalar herramientas.

## Contacto

El formulario es una muestra visual para la entrega académica y no envía datos.
El enlace de correo abre la aplicación de email. Los datos de contacto e impacto
deben verificarse antes de publicar.
# Proyecto-adopcion
