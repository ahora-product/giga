/* Hub — reloj en vivo en el masthead. Sin dependencias. */
(function () {
  "use strict";
  const clock = document.querySelector("[data-clock]");
  if (!clock) return;
  const tick = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clock.textContent = `${hh}:${mm}`;
  };
  tick();
  setInterval(tick, 15000);
})();

/* Hub — cursor personalizado: cuadrado redondeado que sigue al puntero.
   El color se toma del panel sobre el que está el puntero (--acc). */
(function () {
  "use strict";

  const root = document.querySelector("[data-cursor]");
  if (!root) return;

  /* Solo con puntero fino (ratón/trackpad). En híbridos Windows el puntero
     principal puede ser coarse aunque haya ratón: comprobamos any-pointer. */
  const hasFinePointer =
    window.matchMedia("(pointer: fine)").matches ||
    window.matchMedia("(any-pointer: fine)").matches;
  if (!hasFinePointer) return;

  document.documentElement.classList.add("is-cursor-on");

  const DEFAULT_ACC = "#f3f2ec";
  const dotR = 6; /* mitad del cuadrado (12px) */

  let mx = -100;
  let my = -100;

  const onMove = (event) => {
    mx = event.clientX;
    my = event.clientY;
    root.classList.add("is-active");

    const panel = event.target.closest(".panel");
    const link = Boolean(event.target.closest("a, button"));
    root.classList.toggle("is-hover-link", link);

    const acc = panel
      ? getComputedStyle(panel).getPropertyValue("--acc").trim()
      : "";
    root.style.setProperty("--cursor-acc", acc || DEFAULT_ACC);

    root.style.setProperty("--dot-x", `${mx - dotR}px`);
    root.style.setProperty("--dot-y", `${my - dotR}px`);

    /* mueve el círculo difuminado de fondo hacia el cursor */
    if (panel) {
      const r = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${((event.clientX - r.left) / r.width) * 100}%`);
      panel.style.setProperty("--my", `${((event.clientY - r.top) / r.height) * 100}%`);
    }
  };

  const hide = () => root.classList.remove("is-active", "is-hover-link");

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", () => root.classList.add("is-active"), {
    passive: true,
  });
  window.addEventListener("pointerleave", hide, { passive: true });
  window.addEventListener("blur", hide);
})();
