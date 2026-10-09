/**
 * Envío del formulario «Siete dudas» de la campaña APG Spain
 * (giga109-formulario-apg.html).
 *
 * Igual que api/contacto.js: el navegador manda aquí las respuestas ya
 * redactadas en texto y esta función las reenvía por correo usando Resend.
 *
 * Variables de entorno (Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY  → la misma que usa el formulario de contacto
 *   APG_MAIL_TO     → destinatario (por defecto joangiron@giga109.es)
 *   MAIL_FROM       → remitente verificado en Resend, p. ej. "giga109 <web@giga109.es>"
 */

const LIMITES = {
  nombre: 120,
  cargo: 120,
  respuestas: 20000,
};

/* Escapa el texto del visitante antes de meterlo en el HTML del correo. */
function escapar(valor = "") {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[apg] falta RESEND_API_KEY");
    return res.status(500).json({ ok: false, error: "El formulario no está configurado." });
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

  // Trampa antispam: campo oculto que una persona nunca rellena.
  if (datos.website) {
    return res.status(200).json({ ok: true });
  }

  const limpio = {};
  for (const [campo, max] of Object.entries(LIMITES)) {
    limpio[campo] = String(datos[campo] ?? "").trim().slice(0, max);
  }

  if (!limpio.respuestas) {
    return res.status(400).json({ ok: false, error: "No hay respuestas que enviar." });
  }

  const quien = [limpio.nombre, limpio.cargo].filter(Boolean).join(" · ") || "Sin nombre";

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:8px">
      <p style="margin:0 0 4px;color:#8a8a8a;font-size:13px">Formulario APG Spain · giga109.es</p>
      <h1 style="margin:0 0 20px;font-size:20px;color:#111">${escapar(quien)}</h1>
      <div style="padding:16px 18px;background:#f6f6f4;border-radius:10px;color:#111;font-size:14px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace">${escapar(
        limpio.respuestas
      )}</div>
    </div>`;

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "giga109 <onboarding@resend.dev>",
        to: [process.env.APG_MAIL_TO || "joangiron@giga109.es"],
        subject: `Respuestas APG Spain · 7 dudas — ${quien}`,
        html,
        text: limpio.respuestas,
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("[apg] Resend respondió", respuesta.status, detalle);
      return res.status(502).json({ ok: false, error: "No hemos podido enviar las respuestas." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[apg] error al enviar:", err);
    return res.status(500).json({ ok: false, error: "No hemos podido enviar las respuestas." });
  }
}
