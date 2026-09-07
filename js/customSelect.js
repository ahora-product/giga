/**
 * Desplegable con estética propia.
 *
 * El desplegable nativo del sistema no se puede maquillar: la lista que abre
 * Windows/macOS la pinta el sistema operativo, con su tipografía, su azul de
 * selección y sus márgenes. Chocaba con el resto de la página (negro, lima,
 * Inter Tight), así que aquí montamos nuestra propia lista.
 *
 * La idea: el `<select>` de verdad SIGUE estando en el formulario (lo ocultamos
 * a la vista, pero conserva su `name` y su valor), de modo que cuando se
 * conecte el envío por correo funcione igual que siempre. Encima colocamos un
 * botón y una lista dibujados por nosotros; al elegir una opción se la
 * copiamos al `<select>` real y lanzamos su evento `change`.
 *
 * Si este script fallara o no llegara a cargarse, el `<select>` nativo se
 * queda visible y operativo: el formulario nunca se rompe.
 */

// Cierra cualquier otro desplegable que estuviera abierto en la página.
const abiertos = new Set();

function cerrarTodos(excepto) {
  for (const cerrar of abiertos) {
    if (cerrar !== excepto) cerrar();
  }
}

function crear(select) {
  const campo = select.closest(".field__select");
  if (!campo) return;

  // Opciones reales del <select>, incluido el placeholder deshabilitado.
  const opciones = Array.from(select.options);
  const idBase = select.id || `select-${Math.random().toString(36).slice(2, 8)}`;

  const raiz = document.createElement("div");
  raiz.className = "cselect";

  const boton = document.createElement("button");
  boton.type = "button"; // no debe enviar el formulario
  boton.className = "cselect__trigger field__control";
  boton.id = `${idBase}-trigger`;
  boton.setAttribute("role", "combobox");
  boton.setAttribute("aria-haspopup", "listbox");
  boton.setAttribute("aria-expanded", "false");

  // La etiqueta del campo también debe nombrar a nuestro botón.
  const etiqueta = document.querySelector(`label[for="${select.id}"]`);
  if (etiqueta) boton.setAttribute("aria-labelledby", `${etiqueta.id || (etiqueta.id = `${idBase}-label`)} ${boton.id}`);

  const texto = document.createElement("span");
  texto.className = "cselect__value";
  boton.append(texto);

  const flecha = document.createElement("i");
  flecha.className = "ph ph-caret-down cselect__caret";
  flecha.setAttribute("aria-hidden", "true");
  boton.append(flecha);

  const lista = document.createElement("ul");
  lista.className = "cselect__list";
  lista.id = `${idBase}-list`;
  lista.setAttribute("role", "listbox");
  lista.hidden = true;
  boton.setAttribute("aria-controls", lista.id);

  // Índices navegables (el placeholder no se puede elegir).
  const elegibles = [];

  opciones.forEach((opcion, i) => {
    if (!opcion.value) return; // placeholder: no entra en la lista

    const item = document.createElement("li");
    item.className = "cselect__option";
    item.id = `${idBase}-opt-${i}`;
    item.setAttribute("role", "option");
    item.dataset.value = opcion.value;
    item.setAttribute("aria-selected", String(opcion.selected));
    item.textContent = opcion.textContent;
    lista.append(item);
    elegibles.push(item);
  });

  let indiceActivo = elegibles.findIndex((item) => item.getAttribute("aria-selected") === "true");

  function pintarValor() {
    const elegida = opciones.find((o) => o.value === select.value && o.value);
    texto.textContent = elegida ? elegida.textContent : opciones[0].textContent;
    // Sin elegir todavía -> texto atenuado, como un placeholder.
    raiz.classList.toggle("is-placeholder", !elegida);
  }

  function marcarActivo(indice) {
    elegibles.forEach((item, i) => item.classList.toggle("is-active", i === indice));
    if (indice >= 0 && elegibles[indice]) {
      boton.setAttribute("aria-activedescendant", elegibles[indice].id);
      elegibles[indice].scrollIntoView({ block: "nearest" });
    } else {
      boton.removeAttribute("aria-activedescendant");
    }
    indiceActivo = indice;
  }

  function abrir() {
    if (!lista.hidden) return;
    cerrarTodos(cerrar);
    lista.hidden = false;
    raiz.classList.add("is-open");
    boton.setAttribute("aria-expanded", "true");
    marcarActivo(indiceActivo >= 0 ? indiceActivo : 0);
  }

  function cerrar() {
    if (lista.hidden) return;
    lista.hidden = true;
    raiz.classList.remove("is-open");
    boton.setAttribute("aria-expanded", "false");
    boton.removeAttribute("aria-activedescendant");
  }

  function alternar() {
    if (lista.hidden) abrir();
    else cerrar();
  }

  function elegir(indice) {
    const item = elegibles[indice];
    if (!item) return;
    select.value = item.dataset.value;
    elegibles.forEach((el, i) => el.setAttribute("aria-selected", String(i === indice)));
    indiceActivo = indice;
    pintarValor();
    // Avisamos al formulario como haría el desplegable nativo.
    select.dispatchEvent(new Event("change", { bubbles: true }));
    cerrar();
    boton.focus();
  }

  boton.addEventListener("click", alternar);

  // Ratón: resaltar lo que se señala y elegir al soltar el clic.
  lista.addEventListener("click", (e) => {
    const item = e.target.closest(".cselect__option");
    if (item) elegir(elegibles.indexOf(item));
  });

  lista.addEventListener("mousemove", (e) => {
    const item = e.target.closest(".cselect__option");
    if (item) marcarActivo(elegibles.indexOf(item));
  });

  // Teclado: mismas teclas que un desplegable nativo.
  boton.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (lista.hidden) {
          abrir();
          break;
        }
        const paso = e.key === "ArrowDown" ? 1 : -1;
        const siguiente = (indiceActivo + paso + elegibles.length) % elegibles.length;
        marcarActivo(siguiente);
        break;
      }
      case "Home":
        if (!lista.hidden) {
          e.preventDefault();
          marcarActivo(0);
        }
        break;
      case "End":
        if (!lista.hidden) {
          e.preventDefault();
          marcarActivo(elegibles.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (lista.hidden) abrir();
        else elegir(indiceActivo);
        break;
      case "Escape":
        if (!lista.hidden) {
          e.preventDefault();
          cerrar();
        }
        break;
      case "Tab":
        cerrar();
        break;
      default:
        break;
    }
  });

  // Un clic fuera cierra la lista.
  document.addEventListener("click", (e) => {
    if (!raiz.contains(e.target)) cerrar();
  });

  // Si algo cambia el <select> por fuera (por ejemplo, un reset), nos enteramos.
  select.addEventListener("change", pintarValor);

  raiz.append(boton, lista);
  campo.append(raiz);
  campo.classList.add("field__select--custom");
  abiertos.add(cerrar);

  pintarValor();
}

export function initCustomSelect() {
  const selects = document.querySelectorAll(".field__select select");
  for (const select of selects) crear(select);

  // Al pulsar Escape en cualquier sitio, cerramos lo que hubiera abierto.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarTodos();
  });
}
