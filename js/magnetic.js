const MAX = 4;

function dampen(value, max) {
  if (value > max) return max;
  if (value < -max) return -max;
  return value;
}

export function initMagnetic() {
  if (!document.documentElement.classList.contains("motion-safe")) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const nodes = document.querySelectorAll("[data-magnetic]");
  if (!nodes.length) return;

  nodes.forEach((el) => {
    const strength = Number(el.dataset.magneticStrength || "0.35");

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = dampen((event.clientX - cx) * strength, MAX);
      const dy = dampen((event.clientY - cy) * strength, MAX);
      el.style.setProperty("--mx", `${dx}px`);
      el.style.setProperty("--my", `${dy}px`);
    };

    const reset = () => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    el.addEventListener("blur", reset);
  });
}
