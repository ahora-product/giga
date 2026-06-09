/**
 * Apilado de proyectos (stacking) con profundidad.
 *
 * Al hacer scroll, cada imagen se "pega" justo debajo del encabezado (eso lo
 * hace el CSS con position: sticky) y se queda ahí mientras las siguientes
 * llegan y se amontonan encima. Cuando se apila la última, el bloque entero
 * deja de pegarse y todo sube junto.
 *
 * Este script solo añade la SENSACIÓN DE PROFUNDIDAD: las imágenes que van
 * quedando enterradas debajo del montón se encogen y se oscurecen un poco,
 * de forma progresiva. Así el montón se lee como una pila de capas.
 *
 * Cómo se mide: para cada imagen contamos cuántas de las SIGUIENTES ya han
 * llegado arriba (o están a punto). Cada una que se amontona encima añade una
 * "capa". Cuantas más capas tiene encima una imagen, más se encoge y oscurece.
 * Usamos la posición en pantalla de cada imagen (su borde superior), que para
 * las que están pegadas es justo la línea de apilado: por eso sabemos que ya
 * están encima.
 */
export function initProjectScatter() {
  const container = document.querySelector("[data-project-scatter]");
  if (!container) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return; // sin efecto si se pide reducir movimiento

  const nodes = Array.from(container.querySelectorAll("[data-parallax]"));
  if (!nodes.length) return;

  /* Cuánto encoge y se oscurece cada imagen por cada capa que tiene encima.
     Súbelos para que el amontonamiento se note más; bájalos para algo sutil. */
  const SCALE_STEP = 0.05; // encogimiento por capa
  const MIN_SCALE = 0.72; // no encoger más de esto
  const DIM_STEP = 0.07; // oscurecimiento por capa
  const MIN_BRIGHT = 0.45; // no oscurecer más de esto

  let stickyTop = 0; // línea (en px) donde las imágenes se pegan arriba
  let approach = 1; // px antes de pegarse en los que la capa va "entrando"
  let ticking = false;

  function measure() {
    /* Leemos directamente el "top" del sticky que define el CSS (ahora hacia la
       mitad de la pantalla). Así el efecto de profundidad queda coordinado con
       la posición de pegado sin tener que duplicar el cálculo aquí. */
    const cssTop = parseFloat(window.getComputedStyle(nodes[0]).top);
    stickyTop = Number.isFinite(cssTop) ? cssTop : window.innerHeight * 0.5;
    /* La capa "entra" de forma suave a lo largo de un tercio de pantalla justo
       antes de que la imagen llegue a pegarse. */
    approach = Math.max(1, window.innerHeight * 0.33);
  }

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function update() {
    /* Para cada imagen, cuánto cuenta como "capa encima de las de abajo":
       1 si ya está pegada arriba; entre 0 y 1 mientras se acerca. */
    const layer = nodes.map((el) => {
      const top = el.getBoundingClientRect().top;
      if (top <= stickyTop) return 1; // ya está arriba (pegada)
      return clamp01((approach - (top - stickyTop)) / approach); // acercándose
    });

    for (let i = 0; i < nodes.length; i++) {
      /* Capas encima de la imagen i = las siguientes que ya se le han
         amontonado (o están llegando) por encima. */
      let buried = 0;
      for (let j = i + 1; j < nodes.length; j++) buried += layer[j];

      const scale = Math.max(MIN_SCALE, 1 - buried * SCALE_STEP);
      const bright = Math.max(MIN_BRIGHT, 1 - buried * DIM_STEP);

      const el = nodes[i];
      el.style.transform = `scale(${scale.toFixed(3)})`;
      el.style.filter = `brightness(${bright.toFixed(3)})`;
    }

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function onResize() {
    measure();
    onScroll();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  measure();
  update();
}
