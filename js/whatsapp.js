/**
 * Enlaces de WhatsApp.
 *
 * El número vive solo aquí. Cada enlace con [data-wa] ya trae un href válido
 * en el HTML (por si el JS no carga); este módulo lo reconstruye con el número
 * de abajo y el mensaje de su atributo data-wa, o el mensaje por defecto si
 * viene vacío. Para cambiar de número basta con tocar WA_NUMBER (y los href
 * de respaldo del HTML).
 *
 * Cada clic se cuenta en Vercel Web Analytics como evento "whatsapp_click",
 * con el botón de origen (atributo data-wa-origen: header, flotante,
 * tarifa-…, contacto, faq, footer). Si el script de analítica no ha cargado,
 * el clic funciona igual y simplemente no se cuenta.
 */
const WA_NUMBER = "34681138782";
const DEFAULT_MESSAGE = "¡Hola! Necesito una web para mi proyecto";

export function waUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function trackClick(origen) {
  if (typeof window.va !== "function") return;
  window.va("event", { name: "whatsapp_click", data: { origen } });
}

export function initWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = waUrl(link.dataset.wa || DEFAULT_MESSAGE);
    link.addEventListener("click", () => trackClick(link.dataset.waOrigen || "otro"));
  });
}
