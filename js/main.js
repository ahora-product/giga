import { initNav } from "./nav.js";
import { initMagnetic } from "./magnetic.js";
import { initRipple } from "./ripple.js";
import { initCursor } from "./cursor.js";
import { initProjectScatter } from "./projectScatter.js";
import { initScrollReveal } from "./scrollReveal.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyMotionPreference() {
  document.documentElement.classList.toggle("motion-safe", !reduceMotion.matches);
}

applyMotionPreference();
reduceMotion.addEventListener("change", applyMotionPreference);

/* Lanza cada arranque por separado y aislado: si uno falla, deja constancia
   en la consola pero NO arrastra a los demás. Así un problema puntual (por
   ejemplo, con la caché del navegador) nunca puede tumbar el cursor ni el
   resto de la página. */
function safe(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[init] fallo en ${label}:`, err);
  }
}

safe("cursor", initCursor);
safe("nav", initNav);
safe("magnetic", initMagnetic);
safe("ripple", initRipple);
safe("projectScatter", initProjectScatter);
safe("scrollReveal", initScrollReveal);

/* El botón "volver arriba" se carga aparte y de forma perezosa: si su archivo
   no estuviera disponible, el fallo queda contenido aquí y la página sigue
   funcionando con normalidad. */
import("./backToTop.js")
  .then((m) => safe("backToTop", m.initBackToTop))
  .catch((err) => console.error("[init] no se pudo cargar backToTop:", err));

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const hero = document.querySelector(".hero");
if (hero) {
  window.requestAnimationFrame(() => hero.classList.add("is-booted"));
}
