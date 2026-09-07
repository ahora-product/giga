/**
 * Envío del formulario de contacto.
 *
 * Función serverless (Vercel). El sitio es estático, así que no puede mandar
 * correos por sí mismo: el navegador envía aquí los datos del formulario y
 * esta función los reenvía por correo a hello@giga109.es usando Resend.
 *
 * La clave de Resend vive SOLO aquí, en una variable de entorno del servidor
 * (RESEND_API_KEY). Nunca viaja al navegador: si estuviera en el JS del
 * cliente, cualquiera podría leerla y mandar correos en tu nombre.
 *
 * Variables de entorno necesarias (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  → la clave de https://resend.com/api-keys
 *   MAIL_TO         → destinatario (por defecto hello@giga109.es)
 *   MAIL_FROM       → remitente verificado en Resend, p. ej. "giga109 <web@giga109.es>"
 */

const LIMITES = {
  nombre: 100,
  apellidos: 100,
  email: 150,
  telefono: 30,
  motivo: 50,
  descripcion: 5000,
};

const MOTIVOS = {
  "pagina-simple": "Página simple",
  "web-corporativa": "Web corporativa",
  "tienda-online": "Tienda online",
  otros: "Otra cosa",
};

/* Escapa el texto del visitante antes de meterlo en el HTML del correo.
   Sin esto, alguien podría colar etiquetas en el mensaje. */
function escapar(valor = "") {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function esCorreoValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contacto] falta RESEND_API_KEY");
    return res.status(500).json({ ok: false, error: "El formulario no está configurado. Escríbenos por correo." });
  }

  // El cuerpo puede llegar ya parseado (Vercel) o como texto.
  let datos = req.body;
  if (typeof datos === "string") {
    try {
      datos = JSON.parse(datos);
    } catch {
      return res.status(400).json({ ok: false, error: "Datos mal formados." });
    }
  }
  if (!datos || typeof datos !== "object") {
    return res.status(400).json({ ok: false, error: "Datos mal formados." });
  }

  // Trampa antispam: un campo oculto que una persona nunca rellena.
  // Si viene con contenido, es un bot: respondemos OK para no darle pistas.
  if (datos.website) {
    return res.status(200).json({ ok: true });
  }

  const limpio = {};
  for (const [campo, max] of Object.entries(LIMITES)) {
    limpio[campo] = String(datos[campo] ?? "").trim().slice(0, max);
  }

  const faltan = [];
  if (!limpio.nombre) faltan.push("nombre");
  if (!limpio.apellidos) faltan.push("apellidos");
  if (!limpio.email) faltan.push("correo");
  if (!limpio.motivo) faltan.push("motivo");
  if (faltan.length) {
    return res.status(400).json({ ok: false, error: `Faltan campos: ${faltan.join(", ")}.` });
  }
  if (!esCorreoValido(limpio.email)) {
    return res.status(400).json({ ok: false, error: "El correo no parece válido." });
  }

  const motivo = MOTIVOS[limpio.motivo] || limpio.motivo;
  const nombreCompleto = `${limpio.nombre} ${limpio.apellidos}`.trim();

  const filas = [
    ["Nombre", nombreCompleto],
    ["Correo", limpio.email],
    ["Teléfono", limpio.telefono || "—"],
    ["Interesado en", motivo],
  ]
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:6px 14px 6px 0;color:#8a8a8a;font-size:13px;white-space:nowrap;vertical-align:top">${k}</td>
           <td style="padding:6px 0;color:#111;font-size:15px">${escapar(v)}</td>
         </tr>`
    )
    .join("");

  const descripcionHtml = limpio.descripcion
    ? `<p style="margin:22px 0 6px;color:#8a8a8a;font-size:13px">Mensaje</p>
       <div style="padding:14px 16px;background:#f6f6f4;border-radius:10px;color:#111;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapar(
         limpio.descripcion
       )}</div>`
    : "";

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:8px">
      <p style="margin:0 0 4px;color:#8a8a8a;font-size:13px">Nuevo mensaje desde giga109.es</p>
      <h1 style="margin:0 0 20px;font-size:20px;color:#111">${escapar(motivo)}</h1>
      <table style="border-collapse:collapse;width:100%">${filas}</table>
      ${descripcionHtml}
    </div>`;

  const texto = [
    `Nuevo mensaje desde giga109.es`,
    ``,
    `Nombre: ${nombreCompleto}`,
    `Correo: ${limpio.email}`,
    `Teléfono: ${limpio.telefono || "—"}`,
    `Interesado en: ${motivo}`,
    ``,
    limpio.descripcion || "(sin mensaje)",
  ].join("\n");

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "giga109 <onboarding@resend.dev>",
        to: [process.env.MAIL_TO || "hello@giga109.es"],
        // Al responder, el correo va directo al visitante.
        reply_to: limpio.email,
        subject: `${motivo} — ${nombreCompleto}`,
        html,
        text: texto,
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("[contacto] Resend respondió", respuesta.status, detalle);
      return res
        .status(502)
        .json({ ok: false, error: "No hemos podido enviar el mensaje. Escríbenos a hello@giga109.es." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contacto] error al enviar:", err);
    return res.status(500).json({ ok: false, error: "No hemos podido enviar el mensaje. Inténtalo de nuevo." });
  }
}
