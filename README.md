# Kern Atelier — landing estática

Landing one-page (HTML + CSS + JS) para un estudio boutique ficticio. Sin build: sirve la carpeta con HTTP (los módulos ES `import` no funcionan con `file://` en la mayoría de navegadores).

## Ver en local

```bash
npx --yes serve .
```

O usa la extensión **Live Server** en el editor.

## Desactivar el cursor personalizado

El cursor custom solo se activa en puntero fino (`pointer: fine`) y cuando **no** está activo `prefers-reduced-motion: reduce`.

Para forzar el cursor del sistema en cualquier caso:

1. En [js/main.js](js/main.js), comenta la línea `initCursor();`.
2. Opcional: en [styles/components.css](styles/components.css), elimina o comenta el bloque `html.is-cursor-on .cursor { display: block; }` y la regla `body.is-cursor-custom { cursor: none; }` si quieres evitar estilos huérfanos.

## Cómo se respeta “reduced motion”

- `html` recibe la clase `motion-safe` solo si el usuario **no** ha pedido reducir movimiento en el sistema. Si lo ha pedido, esa clase no se aplica.
- **CSS**: las animaciones de entrada del hero, los reveals al scroll y el parallax ligero están condicionados a `motion-safe` o se desactivan en `@media (prefers-reduced-motion: reduce)` para carruseles decorativos.
- **JS**: el cursor custom no se inicializa con `prefers-reduced-motion: reduce` ni en dispositivos táctiles; el acordeón y el slider siguen siendo usables.

## Imágenes y LCP

El hero usa `<picture>` con **WebP** (y puedes añadir AVIF) más un JPEG de respaldo. El resto de imágenes usa `loading="lazy"`. Sustituye URLs de Unsplash por assets propios en producción.

## Documentación de producto

- [VISION.md](VISION.md) — brief y criterios.
- [AGENTS.md](AGENTS.md) — convenciones del repo.
- Reglas Cursor en [.cursor/rules/](.cursor/rules/).
