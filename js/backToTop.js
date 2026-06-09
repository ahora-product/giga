/**
 * Botón "volver arriba".
 *
 * Aparece abajo a la derecha cuando has bajado un poco por la página, y al
 * pulsarlo te lleva de vuelta al principio. Mientras estás arriba del todo se
 * mantiene oculto para no estorbar.
 *
 * El subir al principio usa el scroll suave del navegador (ya activado en el
 * CSS), salvo que la persona pida "reducir movimiento", en cuyo caso el salto
 * es directo.
 */
export function initBackToTop() {
  const btn = document.querySelector("[data-to-top]");
  if (!btn) return;

  // A partir de cuántos píxeles bajados aparece el botón.
  const SHOW_AFTER = 600;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Muestra u oculta el botón según lo que se haya bajado.
  function update() {
    const scrolled = window.scrollY > SHOW_AFTER;
    btn.classList.toggle("is-visible", scrolled);
  }

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", update, { passive: true });
  update(); // estado inicial por si la página se carga ya desplazada
}
