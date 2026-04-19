# Visión del producto — landing one-page boutique

## Objetivo

Construir una landing de una sola página para un diseñador independiente / estudio boutique, con sensación premium y oscura, ritmo visual inspirado en referencias de mercado (estructura, ritmo, microinteracciones y “feel”) **sin copiar** textos, marcas, assets ni layouts literales de terceros. Contenido placeholder **original y coherente**.

## Stack técnico (obligatorio)

- Solo **HTML + CSS + JS** (sin frameworks, sin build obligatorio).
- Organización modular por archivos: `index.html`, `styles/` (tokens + secciones/componentes), `js/` (navegación por anclas, animaciones, cursor, acordeón, carruseles/marquee).
- Imágenes: formatos modernos cuando sea posible (**webp/avif + fallback**), `loading="lazy"` fuera del hero; hero optimizado para **LCP** (`fetchpriority`, sin lazy en la imagen LCP, dimensiones explícitas).

## Arquitectura de página

- **Solo esta landing**: no hay rutas ni páginas aparte (About/Blog u otras); todo el contenido vive en `index.html`.
- **Menú** que hace scroll a secciones vía `#section-id` (Hero, Trusted, casos, servicios, tarifas, about, FAQ, contacto en footer).
- **Scroll suave** a anclas.
- Opcional: **sección activa** en el nav al intersectar (IntersectionObserver).

## Orden de secciones

1. **Header sticky**: anclas a las secciones de la página (p. ej. Hero / casos / servicios / tarifas / about / FAQ); CTA “Get in Touch / Book a Call” → scroll a `#contact` en footer o `mailto:`.
2. **Hero editorial**: título grande 2–3 líneas, subtítulo tipo “partner for startups”, CTA primario + secundario.
3. **Trusted by**: carrusel infinito de logos; **mismo set duplicado** para loop seamless.
4. **Casos destacados**: grid de cards grandes (mockup laptop/phone), overlay suave, título + outcome (métrica); hover: elevación, zoom suave de imagen, micro-movimiento de texto.
5. **Servicios**: 3 columnas (Visual Identity / Web Design / Webflow Dev o equivalente), iconografía mínima, hover.
6. **Tarifas**: bloque de pricing (tabla o cards): planes o paquetes claros, CTA por plan; legible y escaneable en móvil.
7. **About**: posicionamiento en 2 columnas (texto + imagen/collage); sustituye bloques “about extendido” / galería si no se usan en esta versión.
8. **FAQ**: acordeón con animación de panel (`grid-template-rows: 0fr` → `1fr` o equivalente) + chevron rotando 180°.
9. **Footer**: CTA grande + email + redes (+ ancla `#contact` si el header enlaza aquí).

_Fuera de alcance en esta versión de la visión_: testimonios, galería secundaria, about extendido con múltiples fotos, marquee inferior de palabras clave (se pueden reintroducir más adelante si encajan).

> Nota: en tu borrador el orden listaba **Servicios** dos veces; aquí queda **un** bloque Servicios antes de Tarifas. Si queréis dos bloques distintos (p. ej. resumen + “cómo trabajo”), duplicad el patrón con otro `id` y anclas distintas.

## Dirección visual

- Fondo **negro** base; superficies en **grises profundos**, bordes sutiles, **un acento** + neutros.
- Estética **startup-premium / estudio boutique**: aire, jerarquía, mockups/fotografía realistas, sombras suaves, radios moderados.
- Tipografía: **display audaz** + **body refinado** (fuentes con carácter; evitar protagonismo de packs genéricos tipo Inter/Roboto).
- Profundidad opcional: gradientes o mesh **muy ligeros**, sin competir con el contenido.

## Sistema de diseño (tokens en `:root`)

Definir variables CSS, por ejemplo:

- Espaciado: `--space-*`
- Radios: `--radius-*`
- Color: `--bg`, `--surface`, `--border`, `--text`, `--muted`, `--accent`
- Tipografía: **tokens de tamaño fijos** (ver siguiente sección), pesos/tracking si aplica
- Grid: **12 columnas** desktop / **4** mobile; contenedor `max-width` consistente (1200–1320px).

Jerarquía: hero con escala tipográfica alta **dentro del sistema fijo**; secciones alternan densidad (aire → densidad → aire).

## Responsive (prioridad alta)

Impecable en móvil, tablet y desktop: grids que colapsan, espaciados coherentes, carruseles/marquee sin romper layout, imágenes con proporciones controladas, header sticky usable con pulgar, **sin scroll horizontal no intencionado**. Marquee y loops revisados en pantallas estrechas (velocidad/altura/padding). El marquee en mobile puede ir **más lento** si mejora lectura (**sin** cambiar tipografía por breakpoint).

## Tipografía: tamaño fijo (requisito explícito)

- Los `font-size` **no cambian** por breakpoint ni por tipo de dispositivo: **mismos tamaños** en todo el rango responsive.
- **Prohibido** en CSS del proyecto:
  - Escalado fluido por viewport para tamaños (p. ej. `clamp()` para tamaños tipográficos).
  - Cambiar tamaños tipográficos en `@media` entre viewports.
- La adaptación responsive se resuelve con **layout** (columnas, `max-width`, wraps), **espaciado**, y ajustes **no escalares** con moderación (p. ej. `line-height` / `letter-spacing`), **no** cambiando la escala tipográfica.
- El zoom del navegador / preferencias del sistema debe seguir funcionando; lo prohibido es que el diseño “re-escale tipografía” según ancho.

## Animaciones

- **Carga**: stagger en hero (título → subtítulo → CTAs → logos): opacity + `translateY(12–24px)` con easing tipo `cubic-bezier` “premium”.
- **Scroll reveal**: secciones fade+slide; imágenes con parallax leve (2–6%) o `scale(1.02)` al entrar (IntersectionObserver).
- **Hover cards**: zoom suave en imagen, sombra más profunda, texto sube 4–8px, underline animado en links.
- **Botones**: ripple sutil o “magnetic button” (mover 2–4px hacia el cursor en un radio).
- **Trusted + marquee**: `translateX` continuo, timing **linear**; pausa en hover (opcional).
- **`prefers-reduced-motion`**: reducir/eliminar parallax, stagger agresivo, lag del cursor; priorizar usabilidad.

## Cursor personalizado (obligatorio)

- `cursor: none` solo en **desktop** (`pointer: fine`) y **no** en touch.
- **Dot** pequeño pegado al cursor + **ring** exterior con lag (lerp / spring / `requestAnimationFrame`).
- Hover en links/botones: ring crece (`scale` 1.2–1.6), cambio de mezcla/blend, opcional inversión.
- Hover en imágenes: modo “view” (crosshair o micro-label).
- Con **reduced motion**: cursor del sistema y sin lag/efectos del cursor custom.

## UX / calidad

- **Performance**: lazy load fuera del hero, tamaños razonables de imagen, LCP optimizado en hero.
- **Accesibilidad**: foco visible, teclado, contraste **AA** sobre negro; los carruseles/loops **no** pueden ser la única forma de leer información crítica.

## Entregables

- HTML semántico (`header`, `main`, `section`, `footer`) + IDs de ancla.
- CSS modular + tokens.
- JS modular (cursor, observers, sliders/marquee, FAQ).
- README: cómo desactivar cursor custom; cómo se respeta reduced motion.

## Criterio de éxito

Sensación cara, scroll fluido, microinteracciones coherentes con estética oscura “estudio”, carrusel de logos (Trusted) en loop perfecto, responsive sólido, tipografía de tamaño constante en todos los viewports, cursor custom como firma **sin** romper usabilidad ni accesibilidad.
