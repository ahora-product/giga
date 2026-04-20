function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function initCursor() {
  const root = document.querySelector("[data-cursor]");
  if (!root) return;

  const reduceMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(pointer: fine)").matches;
  /* Táctil / puntero grueso: sin cursor custom (VISION). */
  if (!fine) return;

  document.documentElement.classList.add("is-cursor-on");
  const body = document.body;
  body.classList.add("is-cursor-custom");

  const syncReducedMotion = () => {
    root.classList.toggle("cursor--reduced", reduceMotionMq.matches);
  };
  syncReducedMotion();
  reduceMotionMq.addEventListener("change", syncReducedMotion);

  let mx = -100;
  let my = -100;
  let rx = -100;
  let ry = -100;
  let raf = 0;

  const classify = (el) => {
    if (!el) return { link: false, image: false };
    const interactive = el.closest("a, button, [data-magnetic]");
    return { link: Boolean(interactive), image: false };
  };

  const onMove = (event) => {
    mx = event.clientX;
    my = event.clientY;
    root.classList.add("is-active");

    const { link, image } = classify(event.target);
    root.classList.toggle("is-hover-link", link && !image);
    root.classList.toggle("is-hover-image", image);
  };

  const onDown = () => root.classList.add("is-active");

  const hide = () => {
    root.classList.remove("is-active", "is-hover-link", "is-hover-image");
  };

  const tick = () => {
    const ringLag = root.classList.contains("cursor--reduced") ? 1 : 0.16;
    rx = lerp(rx, mx, ringLag);
    ry = lerp(ry, my, ringLag);

    const dotR = 4;
    const dotX = mx - dotR;
    const dotY = my - dotR;
    const ringSize = root.classList.contains("is-hover-image") ? 46 : 40;
    const ringOffset = ringSize / 2;
    const ringX = rx - ringOffset;
    const ringY = ry - ringOffset;
    const labX = rx;
    const labY = ry + 28;

    root.style.setProperty("--dot-x", `${dotX}px`);
    root.style.setProperty("--dot-y", `${dotY}px`);
    root.style.setProperty("--ring-x", `${ringX}px`);
    root.style.setProperty("--ring-y", `${ringY}px`);
    root.style.setProperty("--lab-x", `${labX}px`);
    root.style.setProperty("--lab-y", `${labY}px`);

    raf = window.requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerleave", hide, { passive: true });
  window.addEventListener("blur", hide);

  raf = window.requestAnimationFrame(tick);
}
