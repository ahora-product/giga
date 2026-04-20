function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function parseDuration(el, fallback) {
  const raw = el.getAttribute("data-counter-duration") ?? el.dataset.counterDuration;
  const n = raw ? Number.parseInt(String(raw), 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function readTarget(el) {
  const raw = el.getAttribute("data-counter-target") ?? el.dataset.counterTarget;
  return Number.parseFloat(String(raw ?? ""));
}

function animateCount(el, target, durationMs) {
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    const eased = easeOutCubic(t);
    const value = from + (target - from) * eased;
    el.textContent = String(Math.round(value));
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = String(target);
    }
  }

  requestAnimationFrame(tick);
}

function overlapsViewport(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  const vw = window.innerWidth || document.documentElement.clientWidth || 0;
  if (r.width <= 0 && r.height <= 0) return false;
  return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
}

function initStudioCounters() {
  const section = document.querySelector("#estudio");
  if (!section || section.dataset.counterInit === "1") return;

  const nums = section.querySelectorAll(".studio-stat__num[data-counter-target]");
  if (!nums.length) return;

  section.dataset.counterInit = "1";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const applyFinal = () => {
    nums.forEach((el) => {
      const target = readTarget(el);
      if (!Number.isFinite(target)) return;
      el.textContent = String(Math.round(target));
    });
  };

  if (reduceMotion.matches) {
    applyFinal();
    return;
  }

  const observeTarget = section.querySelector(".studio-stats") ?? section;

  let started = false;
  let fallbackTimer = 0;
  let io = null;

  const start = () => {
    if (started) return;
    started = true;
    if (io) {
      io.disconnect();
      io = null;
    }
    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = 0;
    }
    window.removeEventListener("scroll", onScrollKick, false);
    nums.forEach((el) => {
      const target = readTarget(el);
      if (!Number.isFinite(target)) return;
      const duration = parseDuration(el, 1600);
      animateCount(el, target, duration);
    });
  };

  const tryGeometryStart = () => {
    if (started) return;
    if (overlapsViewport(observeTarget)) start();
  };

  function onScrollKick() {
    tryGeometryStart();
  }

  const onIntersect = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        start();
        break;
      }
    }
  };

  io = new IntersectionObserver(onIntersect, {
    threshold: 0,
    rootMargin: "0px 0px 12% 0px",
  });

  io.observe(observeTarget);

  const drainPending = () => {
    if (!io) return false;
    for (const entry of io.takeRecords()) {
      if (entry.isIntersecting) {
        start();
        return true;
      }
    }
    return false;
  };

  drainPending();
  tryGeometryStart();
  window.setTimeout(() => {
    if (!started) drainPending();
    tryGeometryStart();
  }, 0);
  requestAnimationFrame(() => {
    if (!started) drainPending();
    tryGeometryStart();
    requestAnimationFrame(() => {
      if (!started) {
        drainPending();
        tryGeometryStart();
      }
    });
  });

  /* WebKit a veces retrasa el primer callback de IO hasta que hay scroll. */
  window.addEventListener("scroll", onScrollKick, { passive: true });

  fallbackTimer = window.setTimeout(() => {
    if (!started) applyFinal();
    window.removeEventListener("scroll", onScrollKick, false);
  }, 3200);
}

/* Script clásico (no módulo): funciona con file:// y con Live Server. Los ES modules suelen bloquearse en file://. */
function bootStudioCounters() {
  initStudioCounters();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootStudioCounters, { once: true });
} else {
  bootStudioCounters();
}
