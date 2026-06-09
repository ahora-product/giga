/**
 * Aparición al hacer scroll (scroll reveal).
 *
 * Cada elemento marcado con `data-reveal` arranca ligeramente bajado y
 * transparente. Cuando entra en pantalla, se funde y sube a su sitio. El
 * efecto da sensación de que la página "se va montando" a medida que bajas,
 * en lugar de estar todo plantado de golpe.
 *
 * Para agrupar varios elementos (logos, tarjetas) se usa `data-reveal-group`
 * en el contenedor: sus hijos con `data-reveal` aparecen en cascada, uno
 * detrás de otro, con un pequeño retardo entre ellos.
 *
 * Quién hace el trabajo de detectar "ya está en pantalla" es el
 * IntersectionObserver del navegador: un vigía que avisa cuando un elemento
 * entra o sale de la vista, sin tener que escuchar el scroll a cada momento.
 */
export function initScrollReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const targets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!targets.length) return;

  // Si se pide reducir movimiento, mostramos todo ya colocado y nos vamos.
  if (reduceMotion.matches) {
    for (const el of targets) el.classList.add("is-revealed");
    return;
  }

  // Retardo en cascada para los hijos de un grupo (en milisegundos).
  const STAGGER = 90;
  const STAGGER_MAX = 540; // techo para que la cascada no se eternice

  // Calcula el retardo de cada elemento según su posición dentro del grupo.
  for (const group of document.querySelectorAll("[data-reveal-group]")) {
    const children = group.querySelectorAll("[data-reveal]");
    children.forEach((child, i) => {
      const delay = Math.min(i * STAGGER, STAGGER_MAX);
      child.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Entra en pantalla -> aparece (subiendo y fundiéndose).
          entry.target.classList.add("is-revealed");
        } else if (entry.boundingClientRect.top > 0) {
          // Vuelve a salir por ABAJO (lo dejamos atrás al subir el scroll):
          // lo reseteamos para que se reanime la próxima vez que aparezca.
          // Si sale por arriba no lo tocamos, para no parpadear mientras lees.
          entry.target.classList.remove("is-revealed");
        }
      }
    },
    {
      // Dispara cuando el bloque está claramente dentro de la pantalla
      // (no pegado al borde de abajo), para que el movimiento se vea bien.
      rootMargin: "0px 0px -18% 0px",
      threshold: 0.1,
    },
  );

  for (const el of targets) observer.observe(el);
}
