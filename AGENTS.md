# Guía del repositorio (para humanos y agentes)

## Qué es este proyecto

Landing one-page estática para un estudio / diseñador independiente boutique, premium y oscura. Sin frameworks ni build obligatorio.

## Stack

- HTML5 semántico
- CSS modular en `styles/` (tokens, base, layout, componentes, secciones)
- JavaScript vanilla en `js/` (módulos cargados como `<script type="module">`)

## Estructura

```
index.html
styles/
  main.css      → importa el resto en orden
  tokens.css
  base.css
  layout.css
  components.css
  sections.css
  motion.css    → animaciones y reduced-motion
js/
  main.js       → orquestación
  nav.js
  cursor.js
  magnetic.js
  ripple.js
```

## Fuente de verdad

Antes de implementar o cambiar comportamiento visual, lee **[VISION.md](VISION.md)**. Los prompts por fase deben citar la sección correspondiente (p. ej. `@VISION.md` § FAQ).

## Cómo ver el sitio localmente

- Con **Live Server** (extensión VS Code / Cursor): abrir `index.html` con “Open with Live Server”.
- O con Node: `npx --yes serve .` y abrir la URL que muestre el CLI.

No hay paso de compilación.

## Convención de trabajo en Cursor

1. Mantener tipografía de **tamaño fijo** (ver VISION y reglas CSS): no reescalar `font-size` por viewport.
2. Las animaciones deben respetar **accesibilidad** y `prefers-reduced-motion`.
3. El cursor personalizado es opcional en runtime: ver README para desactivarlo.

## Contenido para buscadores e IA (obligatorio)

Cada vez que cambie el contenido de la web (servicios, precios, plazos, qué incluye cada tarifa, FAQ, contacto, zona, redes o páginas nuevas), actualiza en el **mismo cambio**:

1. **[llms.txt](llms.txt)**: resumen del estudio que leen las IA. Tiene que decir lo mismo que la web.
2. **JSON-LD de `index.html`**: el bloque `ProfessionalService` (precios, contacto, `sameAs`) y el bloque `FAQPage`, que repite el texto de la sección `#faq`.
3. **`sitemap.xml`** si se añade o se quita una página.

El número de WhatsApp vive en `js/whatsapp.js`; si cambia, actualiza también los `href` de respaldo del HTML, el JSON-LD y `llms.txt`.
