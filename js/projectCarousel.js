export function initProjectCarousel() {
  const viewport = document.querySelector("[data-project-carousel]");
  if (!viewport) return;

  const strip = viewport.querySelector(".project-carousel__strip");
  const track = strip?.querySelector(".project-carousel__track");
  if (!strip || !track) return;

  const slides = track.querySelectorAll(".project-carousel__slide");
  /* Si ya hay 10 ítems (5 + copia en un solo ul), el bucle ya está en el HTML. */
  if (slides.length > 5) return;

  slides.forEach((slide) => {
    const node = slide.cloneNode(true);
    node.setAttribute("aria-hidden", "true");
    node.querySelectorAll("a").forEach((a) => {
      a.setAttribute("tabindex", "-1");
      a.removeAttribute("aria-label");
    });
    track.appendChild(node);
  });
}
