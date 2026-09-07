/**
 * Formulario de contacto: validación y envío.
 *
 * Manda los datos a /api/contacto (la función serverless que reenvía el
 * correo) sin recargar la página, y va contando lo que pasa: mientras se
 * envía, si algo falla y cuando llega. Al terminar bien, el formulario se
 * sustituye por un mensaje de confirmación.
 *
 * La validación se hace aquí para dar avisos rápidos y claros, pero el
 * servidor vuelve a validarlo todo: lo que llega del navegador nunca es de
 * fiar.
 */

const MENSAJES = {
  nombre: "Dinos tu nombre.",
  apellidos: "Dinos tus apellidos.",
  email: "Necesitamos un correo para responderte.",
  emailFormato: "Ese correo no parece correcto.",
  motivo: "Elige sobre qué quieres hablar.",
  generico: "No hemos podido enviar el mensaje. Escríbenos a hello@giga109.es.",
};

function esCorreoValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const boton = form.querySelector("[data-submit]");
  const aviso = form.querySelector("[data-form-status]");
  const textoBoton = boton?.querySelector("[data-submit-label]");
  const etiquetaOriginal = textoBoton?.textContent ?? "Enviar mensaje";

  /* Muestra el error justo debajo del campo y lo enlaza con aria-describedby
     para que un lector de pantalla lo lea al llegar ahí. */
  const marcarError = (campo, mensaje) => {
    const contenedor = campo.closest(".field");
    if (!contenedor) return;
    let hueco = contenedor.querySelector(".field__error");
    if (!hueco) {
      hueco = document.createElement("p");
      hueco.className = "field__error";
      hueco.id = `${campo.id || campo.name}-error`;
      contenedor.append(hueco);
    }
    hueco.textContent = mensaje;
    campo.setAttribute("aria-invalid", "true");
    campo.setAttribute("aria-describedby", hueco.id);
    contenedor.classList.add("field--error");
  };

  const limpiarError = (campo) => {
    const contenedor = campo.closest(".field");
    if (!contenedor) return;
    contenedor.classList.remove("field--error");
    contenedor.querySelector(".field__error")?.remove();
    campo.removeAttribute("aria-invalid");
    campo.removeAttribute("aria-describedby");
  };

  const validar = () => {
    const errores = [];
    const campo = (n) => form.elements[n];

    const nombre = campo("nombre");
    const apellidos = campo("apellidos");
    const email = campo("email");
    const motivo = campo("motivo");

    [nombre, apellidos, email, motivo].forEach(limpiarError);

    if (!nombre.value.trim()) errores.push([nombre, MENSAJES.nombre]);
    if (!apellidos.value.trim()) errores.push([apellidos, MENSAJES.apellidos]);
    if (!email.value.trim()) errores.push([email, MENSAJES.email]);
    else if (!esCorreoValido(email.value.trim())) errores.push([email, MENSAJES.emailFormato]);
    if (!motivo.value) errores.push([motivo, MENSAJES.motivo]);

    errores.forEach(([c, m]) => marcarError(c, m));
    return errores;
  };

  // Al corregir un campo, su error desaparece solo.
  form.addEventListener("input", (e) => {
    if (e.target.closest(".field--error")) limpiarError(e.target);
  });
  form.addEventListener("change", (e) => {
    if (e.target.name === "motivo") limpiarError(e.target);
  });

  const setEstado = (estado, mensaje = "") => {
    form.dataset.estado = estado;
    if (aviso) {
      aviso.textContent = mensaje;
      aviso.hidden = !mensaje;
    }
    if (boton) boton.disabled = estado === "enviando";
    if (textoBoton) textoBoton.textContent = estado === "enviando" ? "Enviando…" : etiquetaOriginal;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.estado === "enviando") return;

    const errores = validar();
    if (errores.length) {
      setEstado("error", "Revisa los campos marcados.");
      // El <select> real está oculto (lo sustituye el desplegable propio),
      // así que el foco tiene que ir al botón visible que lo representa.
      const primero = errores[0][0];
      const visible = primero.closest(".field")?.querySelector(".cselect__trigger") || primero;
      visible.focus();
      return;
    }

    setEstado("enviando");

    const datos = Object.fromEntries(new FormData(form).entries());

    try {
      const respuesta = await fetch(form.action || "/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      let cuerpo = {};
      try {
        cuerpo = await respuesta.json();
      } catch {
        /* respuesta sin JSON: nos quedamos con el código de estado */
      }

      if (!respuesta.ok || !cuerpo.ok) {
        setEstado("error", cuerpo.error || MENSAJES.generico);
        return;
      }

      // Enviado: sustituimos el formulario por la confirmación.
      const exito = document.querySelector("[data-form-success]");
      if (exito) {
        form.hidden = true;
        exito.hidden = false;
        exito.setAttribute("tabindex", "-1");
        exito.focus();
      } else {
        setEstado("ok", "¡Mensaje enviado! Te respondemos en 24–48 h laborables.");
        form.reset();
      }
    } catch (err) {
      console.error("[contacto] fallo de red:", err);
      setEstado("error", MENSAJES.generico);
    }
  });
}
