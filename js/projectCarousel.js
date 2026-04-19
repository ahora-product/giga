const DRAG_THRESHOLD = 8;

export function initProjectCarousel() {
  const viewport = document.querySelector("[data-project-carousel]");
  if (!viewport) return;

  let pointerDown = false;
  let startX = 0;
  let startScroll = 0;
  let dragDistance = 0;
  let activePointerId = null;

  viewport.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    pointerDown = true;
    dragDistance = 0;
    startX = e.clientX;
    startScroll = viewport.scrollLeft;
    activePointerId = e.pointerId;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!pointerDown || e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX;
    dragDistance = Math.max(dragDistance, Math.abs(dx));
    viewport.scrollLeft = startScroll - dx;
  });

  const endDrag = (e) => {
    if (e.pointerId !== activePointerId) return;
    pointerDown = false;
    activePointerId = null;
    viewport.classList.remove("is-dragging");
    try {
      viewport.releasePointerCapture(e.pointerId);
    } catch {
      /* */
    }
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  viewport.addEventListener(
    "click",
    (e) => {
      if (dragDistance > DRAG_THRESHOLD) {
        e.preventDefault();
        e.stopPropagation();
      }
      dragDistance = 0;
    },
    true,
  );
}
