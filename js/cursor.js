function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function initCursor() {
  const root = document.querySelector("[data-cursor]");
  if (!root) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (reduce || !fine) return;

  const html = document.documentElement;
  if (!html.classList.contains("motion-safe")) return;

  const body = document.body;
  html.classList.add("is-cursor-on");
  body.classList.add("is-cursor-custom");

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
    rx = lerp(rx, mx, 0.16);
    ry = lerp(ry, my, 0.16);

    const dotX = mx - 3;
    const dotY = my - 3;
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
