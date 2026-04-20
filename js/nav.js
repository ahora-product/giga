const SECTION_IDS = ["home", "tarifas", "contact"];

function setActiveLink(id) {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const target = href.startsWith("#") ? href.slice(1) : "";
    link.classList.toggle("is-active", target === id);
  });
}

export function initNav() {
  const header = document.getElementById("site-header");

  window.addEventListener(
    "scroll",
    () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    },
    { passive: true },
  );

  if (!document.querySelector("[data-nav-link]")) return;

  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!visible?.target?.id) return;
      setActiveLink(visible.target.id);
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-42% 0px -42% 0px" },
  );

  sections.forEach((section) => io.observe(section));
}
