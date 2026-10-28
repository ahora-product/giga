/**
 * Enlaces de WhatsApp.
 *
 * El número vive solo aquí. Cada enlace con [data-wa] ya trae un href válido
 * en el HTML (por si el JS no carga); este módulo lo reconstruye con el número
 * de abajo y el mensaje de su atributo data-wa, o el mensaje por defecto si
 * viene vacío. Para cambiar de número basta con tocar WA_NUMBER (y los href
 * de respaldo del HTML).
 */
const WA_NUMBER = "34681138782";
const DEFAULT_MESSAGE = "¡Hola! Necesito una web para mi proyecto";

export function waUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function initWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = waUrl(link.dataset.wa || DEFAULT_MESSAGE);
  });
}
