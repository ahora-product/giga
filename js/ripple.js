export function initRipple() {
  const buttons = document.querySelectorAll(".btn--magnetic");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener(
      "pointerdown",
      (event) => {
        const rect = btn.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        btn.style.setProperty("--ripple-x", `${x}px`);
        btn.style.setProperty("--ripple-y", `${y}px`);
        btn.classList.remove("is-rippling");
        // force reflow
        void btn.offsetWidth;
        btn.classList.add("is-rippling");
        window.setTimeout(() => btn.classList.remove("is-rippling"), 700);
      },
      { passive: true },
    );
  });
}
