/**
 * Hero "rastro de proyectos" (§ styles/hero-trail.css).
 *
 * - Con ratón: cada ~90 px de recorrido deja caer una captura de proyecto
 *   que aparece, aguanta y se desvanece.
 * - Sin ratón (táctil) o tras 2 s quieto: el rastro se dibuja solo siguiendo
 *   un ocho lento por la pantalla.
 * - Se pausa cuando la hero sale de la vista o la pestaña queda oculta.
 * - Con `prefers-reduced-motion` no hay rastro: solo se muestra el nombre del
 *   primer proyecto.
 */
const PROJECTS = [
  ["Beeme", "beeme.png", "4/3"],
  ["Aguas Internacionales", "aguas-internacionales.png", "4/5"],
  ["Donut", "donut.png", "4/3"],
  ["CrewFive", "crewfive-web.png", "4/5"],
  ["Pakana", "pakana.jpg", "4/3"],
  ["MA365", "ma365.png", "4/5"],
  ["Focus", "focus.png", "4/3"],
  ["Adriana Microblading", "adriana-microblading.png", "4/5"],
  ["Kowork", "kasa.png", "4/3"],
  ["Susana Luján Seguros", "susana-lujan-seguros.png", "4/5"],
];

const GAP = 90; // px de recorrido entre una captura y la siguiente
const IDLE_MS = 2000;

export function initHeroTrail() {
  const hero = document.querySelector("[data-hero-trail]");
  if (!hero) return;

  const trail = hero.querySelector("[data-trail-layer]");
  const now = hero.querySelector("[data-trail-now]");
  const hint = hero.querySelector("[data-trail-hint]");
  const header = document.getElementById("site-header");

  // Cabecera sin fondo mientras la hero queda detrás (§ hero-trail.css).
  if (header) {
    const syncHeader = () => {
      const over = hero.getBoundingClientRect().bottom > header.offsetHeight;
      header.classList.toggle("is-over-hero", over);
    };
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    window.addEventListener("resize", syncHeader);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    now.textContent = PROJECTS[0][0];
    if (hint) hint.hidden = true;
    return;
  }

  // Precarga para que la primera aparición de cada captura no parpadee.
  PROJECTS.forEach(([, file]) => {
    new Image().src = `assets/projects/${file}`;
  });

  let i = 0;
  let last = null;

  const drop = (x, y) => {
    const [name, file, ratio] = PROJECTS[i++ % PROJECTS.length];
    const img = document.createElement("img");
    img.className = "trail-hero__shot";
    img.src = `assets/projects/${file}`;
    img.alt = "";
    img.decoding = "async";
    img.style.setProperty("--ratio", ratio);
    img.style.translate = `calc(${x}px - 50%) calc(${y}px - 50%)`;
    img.style.rotate = `${(Math.random() * 8 - 4).toFixed(1)}deg`;
    img.addEventListener("animationend", () => img.remove());
    trail.append(img);
    now.textContent = name;
  };

  const at = (x, y) => {
    if (last && Math.hypot(x - last.x, y - last.y) < GAP) return;
    last = { x, y };
    drop(x, y);
  };

  let idleSince = performance.now();
  // En window y no en la hero: la cabecera queda encima y se tragaría los
  // eventos, pero el rastro también tiene que salir al pasar por el menú.
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    at(x, y);
    idleSince = performance.now();
    if (hint) hint.style.opacity = "0";
  });

  // Solo anima mientras la hero se ve.
  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(hero);

  let t = 0;
  const loop = (ts) => {
    if (visible && !document.hidden && ts - idleSince > IDLE_MS) {
      t += 0.012;
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      at(w / 2 + Math.sin(t) * w * 0.36, h / 2 + Math.sin(t * 2) * h * 0.28);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
