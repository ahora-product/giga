/**
 * Fondo animado de curvas de nivel (topográfico) para la intro.
 *
 * Dibuja, muy tenue y detrás de los logos, un patrón de líneas de contorno
 * como el de un mapa topográfico: curvas cerradas y paralelas que se deforman
 * despacio, igual que un relieve que respirara. Solo vive en la primera
 * pantalla; el resto de la landing sigue en negro liso.
 *
 * Cómo se genera
 * --------------
 * 1) Un CAMPO DE ALTURA continuo, hecho sumando unas pocas ondas seno/coseno
 *    con distinta frecuencia y dirección. Es un truco clásico y baratísimo:
 *    sin librerías de ruido, y como cada onda avanza a su propio ritmo, el
 *    conjunto nunca se repite de forma evidente.
 * 2) MARCHING SQUARES sobre ese campo: se recorre una rejilla y, para cada
 *    celda, se mira qué esquinas quedan por encima del nivel buscado. Esa
 *    combinación dice por dónde cruza la curva, y se traza el segmento
 *    interpolando entre los valores de las esquinas (así la línea sale suave
 *    y no escalonada).
 * 3) Se repite para varios niveles equiespaciados: cada nivel es una "curva de
 *    nivel" del mapa, y juntas dan el patrón de anillos concéntricos.
 *
 * Rendimiento
 * -----------
 * El campo se recalcula entero en cada fotograma, así que el coste depende
 * sobre todo del tamaño de la rejilla (CELL) y del número de niveles. Con los
 * valores de aquí son unos pocos miles de celdas: nada para un canvas.
 * Además:
 *  - se dibuja a resolución de pantalla limitada (DPR tope 2);
 *  - se pausa cuando la intro sale de la vista (IntersectionObserver) y
 *    cuando la pestaña queda en segundo plano;
 *  - se respeta `prefers-reduced-motion`: en ese caso se pinta UN fotograma
 *    quieto, para que el fondo siga estando pero sin movimiento.
 */
export function initIntroContours() {
  const canvas = document.querySelector("[data-intro-contours]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Ajustes del patrón. Subir CELL = menos detalle y más rendimiento;
     subir LEVELS = más líneas (más cargado). SPEED manda en lo lento que
     respira: son vueltas por segundo, por eso es un número tan pequeño. */
  const CELL = 14; // lado de celda de la rejilla, en px de CSS
  const LEVELS = 9; // cuántas curvas de nivel
  const SPEED = 0.055; // velocidad de deformación
  const SCALE = 0.0021; // "zoom" del relieve: menor = formas más grandes
  const LINE_ALPHA = 0.16; // opacidad de las líneas (lo que las hace sutiles)

  let width = 0;
  let height = 0;
  let cols = 0;
  let rows = 0;
  let field = null; // campo de altura, reutilizado entre fotogramas
  let rafId = 0;
  let running = false;
  let startTime = 0;

  /* Campo de altura en (x, y) para el instante t. La mezcla de ondas con
     frecuencias no múltiplas entre sí es lo que evita que se vea "cuadriculado"
     o que el bucle cante. */
  function heightAt(x, y, t) {
    const sx = x * SCALE;
    const sy = y * SCALE;
    return (
      Math.sin(sx * 1.7 + t * 0.9) * Math.cos(sy * 1.3 - t * 0.7) +
      Math.sin((sx + sy) * 1.1 - t * 0.5) * 0.7 +
      Math.cos(sx * 0.6 - sy * 0.9 + t * 0.35) * 0.9 +
      Math.sin(Math.hypot(sx - 0.55, sy - 0.35) * 2.6 - t * 0.6) * 0.55
    );
  }

  // Punto interpolado entre dos esquinas: dónde exactamente cruza el nivel.
  function lerp(a, b, level) {
    const d = b - a;
    if (Math.abs(d) < 1e-6) return 0.5;
    return (level - a) / d;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / CELL) + 1;
    rows = Math.ceil(height / CELL) + 1;
    field = new Float32Array(cols * rows);
    return true;
  }

  function draw(t) {
    if (!field) return;

    // 1) Campo de altura en toda la rejilla.
    let min = Infinity;
    let max = -Infinity;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const v = heightAt(i * CELL, j * CELL, t);
        field[j * cols + i] = v;
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(255, 255, 255, ${LINE_ALPHA})`;
    ctx.beginPath();

    // 2) Marching squares por cada nivel.
    const span = max - min || 1;
    for (let k = 1; k <= LEVELS; k++) {
      const level = min + (span * k) / (LEVELS + 1);

      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const x = i * CELL;
          const y = j * CELL;

          // Esquinas de la celda: arriba-izq, arriba-der, abajo-der, abajo-izq.
          const tl = field[j * cols + i];
          const tr = field[j * cols + i + 1];
          const br = field[(j + 1) * cols + i + 1];
          const bl = field[(j + 1) * cols + i];

          // Código de 4 bits: un 1 por cada esquina por encima del nivel.
          let code = 0;
          if (tl > level) code |= 8;
          if (tr > level) code |= 4;
          if (br > level) code |= 2;
          if (bl > level) code |= 1;

          // Ni todo dentro ni todo fuera: si no, la curva no cruza la celda.
          if (code === 0 || code === 15) continue;

          // Cruces en cada arista (los que hagan falta según el código).
          const top = { x: x + CELL * lerp(tl, tr, level), y };
          const right = { x: x + CELL, y: y + CELL * lerp(tr, br, level) };
          const bottom = { x: x + CELL * lerp(bl, br, level), y: y + CELL };
          const left = { x, y: y + CELL * lerp(tl, bl, level) };

          const line = (a, b) => {
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          };

          switch (code) {
            case 1:
            case 14:
              line(left, bottom);
              break;
            case 2:
            case 13:
              line(bottom, right);
              break;
            case 3:
            case 12:
              line(left, right);
              break;
            case 4:
            case 11:
              line(top, right);
              break;
            case 6:
            case 9:
              line(top, bottom);
              break;
            case 7:
            case 8:
              line(left, top);
              break;
            // Casos ambiguos (esquinas opuestas): se trazan los dos tramos.
            case 5:
              line(left, top);
              line(bottom, right);
              break;
            case 10:
              line(top, right);
              line(left, bottom);
              break;
          }
        }
      }
    }

    ctx.stroke();
  }

  function frame(now) {
    if (!running) return;
    if (!startTime) startTime = now;
    draw(((now - startTime) / 1000) * SPEED);
    rafId = window.requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduceMotion.matches) return;
    running = true;
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // Un solo fotograma quieto: para reduced-motion y mientras está pausado.
  function drawStill() {
    draw(0);
  }

  function applyMotionPreference() {
    if (reduceMotion.matches) {
      stop();
      drawStill();
    } else {
      start();
    }
  }

  if (!resize()) return;
  applyMotionPreference();

  // Se redimensiona con la ventana; ResizeObserver capta también los cambios
  // de alto por la barra de direcciones del móvil.
  const onResize = () => {
    if (resize()) {
      if (reduceMotion.matches || !running) drawStill();
    }
  };

  if ("ResizeObserver" in window) {
    new ResizeObserver(onResize).observe(canvas);
  } else {
    window.addEventListener("resize", onResize);
  }

  reduceMotion.addEventListener("change", applyMotionPreference);

  // Solo se anima mientras la intro está a la vista: al bajar por la landing
  // el bucle se detiene y deja de gastar batería.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) start();
        else stop();
      }
    },
    { threshold: 0 },
  );
  observer.observe(canvas);

  // Lo mismo al cambiar de pestaña.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (!reduceMotion.matches) start();
  });
}
