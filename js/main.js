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

initNav();
initMagnetic();
initRipple();
initCursor();
initProjectScatter();
initScrollReveal();

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const hero = document.querySelector(".hero");
if (hero) {
  window.requestAnimationFrame(() => hero.classList.add("is-booted"));
}
