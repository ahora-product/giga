/**
 * Paneles de "Producto propio" (menu0, Tap&Book).
 *
 * Traen del hub (/hub) el resplandor de color que sigue al puntero: un
 * círculo muy difuminado, del color de cada producto, que se mueve por
 * detrás del contenido. El dibujo lo hace el CSS con un `radial-gradient`;
 * aquí solo le decimos DÓNDE está el cursor, en porcentaje sobre el panel,
 * a través de las variables --mx y --my.
 *
 * El resto de efectos (la línea de acento, la flecha que avanza, el borde
 * que se tiñe) son puro CSS con `:hover` y no necesitan JavaScript.
 *
 * Se escucha un único `pointermove` sobre el contenedor, no uno por panel,
 * y las escrituras se agrupan en un `requestAnimationFrame` para no tocar
 * estilos varias veces en el mismo fotograma.
 */
export function initHubPanels() {
  const contenedor = document.querySelector("[data-hub-panels]");
  if (!contenedor) return;

  // Sin puntero fino (móvil/táctil) no hay nada que seguir.
  const punteroFino =
    window.matchMedia("(pointer: fine)").matches || window.matchMedia("(any-pointer: fine)").matches;
  if (!punteroFino) return;

  // Si se pide reducir movimiento, no movemos el resplandor.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let pendiente = null;
  let ultimo = null;

  const pintar = () => {
    pendiente = null;
    if (!ultimo) return;
    const { panel, x, y } = ultimo;
    const r = panel.getBoundingClientRect();
    if (!r.width || !r.height) return;
    panel.style.setProperty("--mx", `${((x - r.left) / r.width) * 100}%`);
    panel.style.setProperty("--my", `${((y - r.top) / r.height) * 100}%`);
  };

  contenedor.addEventListener(
    "pointermove",
    (event) => {
      const panel = event.target.closest(".hub-panel");
      if (!panel) return;
      ultimo = { panel, x: event.clientX, y: event.clientY };
      if (pendiente === null) pendiente = window.requestAnimationFrame(pintar);
    },
    { passive: true },
  );
}
