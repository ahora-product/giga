# PRD — Lavado de cara visual de la landing de giga109

- **Producto:** Landing one-page de giga109 (estudio de diseño y desarrollo web/apps)
- **Web en producción:** https://www.giga109.es/
- **Autor:** El Buscador de Problemas (Product Owner, Alfred Dev)
- **Fecha:** 2026-06-08
- **Estado:** Aprobado (decisiones D1-D3 cerradas; ver tabla de decisiones)
- **Documentos de referencia:** `VISION.md`, `CONTEXTO_PROYECTO.md`, `docs/project/discovery.md`

---

## 1. Resumen y problema

La web actual de giga109 funciona y tiene una base sólida: fondo negro, titular serif elegante, acento verde lima y una estructura clara (hero, proyectos, clientes, el estudio, tarifas, footer). Pero **se parece a muchas otras webs oscuras de estudio** y no transmite del todo la personalidad boutique y editorial que el estudio quiere proyectar.

El problema, dicho en una frase:

> **Un cliente potencial que entra en giga109 no percibe de inmediato que está ante un estudio con criterio y carácter propio; la página se ve correcta, pero no memorable.**

Este PRD describe un **lavado de cara visual**: una capa nueva de aspecto (colores, tipografía, formas y un par de efectos con gracia) más algunas secciones de contenido nuevas. **No se rehace la estructura ni la arquitectura** de la página: el contenido y el orden actuales se mantienen.

La inspiración de **estructura y composición editorial** viene de la web de referencia https://ykwmi.studio/ (tipografía de impacto en mayúsculas, fondos que alternan, textura de ruido, etiquetas tipo pastilla, layout editorial). **Importante: NO se adopta su paleta multicolor.** giga109 va a un esquema **monocromo verde oscuro con acento lima** (ver sección 4). Tomamos **inspiración de estructura y estilo, nunca textos, marcas, imágenes ni colores**.

---

## 2. Objetivo

Conseguir que la landing de giga109:

1. Se vea **distinta y con carácter** (mix entre lo actual y el estilo de la referencia), manteniendo la calidez de la marca.
2. Conserve **todo el contenido y la estructura** actuales, sumando unas pocas secciones nuevas que ya estaban pedidas.
3. Mantenga el **verde lima (#b6ee69) como acento** reconocible del estudio, sobre un esquema de **fondos verde oscuro**.
4. Sea **accesible (nivel AA), rápida y respetuosa** con quien prefiere menos animaciones.

Lo que NO buscamos: rehacer la página desde cero, cambiar el mensaje, ni copiar la referencia.

---

## 3. Usuario / actor principal

### Actor primario: el visitante (cliente potencial)
Persona **no técnica** (público general y negocios pequeños/medianos, según `CONTEXTO_PROYECTO.md`) que entra para decidir si encaja con el estudio. Quiere entender rápido qué hace giga109, ver trabajos y saber cómo contactar. Le importa que la web "se vea bien hecha" porque es la primera prueba del trabajo del estudio.

### Actor secundario: la editora del sitio (la diseñadora del estudio)
Persona con **pocos conocimientos técnicos** que mantiene la web. Necesita un sistema de estilo ordenado y entendible (colores, fuentes, espacios como "piezas reutilizables") para poder ajustar cosas sin romper nada y sin depender siempre de un desarrollador.

---

## 4. Solución propuesta (a alto nivel)

> El "cómo" técnico es responsabilidad del architect y del senior-dev. Aquí solo describimos el qué, a nivel de aspecto y comportamiento observable.

- Una **"receta visual"** (conjunto de colores, fuentes, tamaños y formas reutilizables) que sirva de base para todo lo demás.
- **Tipografía de impacto** en los titulares (hero y títulos de sección): mayúsculas, sans bold condensada. El tratamiento exacto (y si se conserva un guiño del serif actual) se **decide al ver pruebas reales en la fase de estilo visual** (ver decisión D1).
- **Etiquetas tipo pastilla** (forma redondeada tipo "stadium" con borde) aplicadas a logo, menú, botones y filtros.
- **Esquema monocromo verde oscuro:** el fondo actual (negro) pasa a **verde oscuro**. Todas las secciones comparten un esquema de **tonos de verde oscuro** (se pueden usar varios matices de verde oscuro para diferenciar secciones, pero **NO otros colores**), con textura de ruido. Nada de crema, azul ni morado.
- Un **efecto de mancha de color que sigue al cursor**, reutilizable, activo en **todas las secciones**, solo en ordenador y respetando la preferencia de "menos movimiento".
- **Secciones nuevas de contenido** con material que ya existe: lista de servicios/capacidades en columnas, "cómo trabajamos" y filtros por categoría en proyectos. (La tarjeta de contacto con foto + bio queda **fuera de alcance**; el contacto se mantiene como está en el pie de página actual.)

---

## 5. Alcance

### Dentro de alcance
- **Esquema monocromo verde oscuro** por sección (varios matices de verde oscuro para diferenciar secciones, sin otros colores) con textura de ruido. El "mesh gradient con ruido" será de **tonos verdes/lima**.
- Nueva tipografía de titulares (impacto en mayúsculas) y ajuste de jerarquía.
- Etiquetas tipo pastilla en logo, menú, botones y filtros.
- Efecto "mancha que sigue al cursor" reutilizable, **activo en todas las secciones**.
- Secciones nuevas: servicios/capacidades en columnas, "cómo trabajamos" y filtros por categoría en proyectos.
- Mantener el **verde lima (#b6ee69) como acento** (precios, botones, cifras).
- Accesibilidad AA, rendimiento (LCP del hero, carga diferida fuera del hero) y soporte de `prefers-reduced-motion`.
- Integración con el cursor personalizado existente.

### Fuera de alcance
- Rehacer la arquitectura de la página o añadir rutas/páginas nuevas (sigue siendo one-page).
- Cambiar los textos de marca o el mensaje (se reutiliza el contenido de `CONTEXTO_PROYECTO.md`).
- Copiar textos, marcas, assets **o la paleta multicolor** de ykwmi.studio.
- **Tarjeta de contacto con foto + bio** (era HU-09, retirada): el contacto se mantiene como está en el pie de página actual.
- Cualquier color que no sea **verde oscuro (fondos), matices de verde oscuro (diferenciación de secciones) y verde lima (acento)**. Nada de crema, azul ni morado.
- Introducir frameworks o un sistema de build obligatorio (sigue siendo HTML + CSS + JS modular).
- Tamaños de tipografía fluidos: **prohibido** `clamp()` para tamaños y cambiar tamaños por breakpoint. El responsive se resuelve con layout y espaciado.
- Analítica de negocio (clics, conversiones): no se instala en este alcance.
- Rediseño del logotipo del estudio.

### Decisiones (cerradas)
Estas tres decisiones quedan resueltas tras la confirmación de la editora:

| # | Tema | Decisión confirmada | Notas |
|---|------|---------------------|-------|
| D1 | Tipografía de titulares | **Pendiente de elección visual.** Se decide en **F1 / fase de estilo visual (Selina)** viendo pruebas reales (sans condensada en mayúsculas; con o sin guiño serif). No es un supuesto cerrado. | No bloquea el resto del PRD; sí condiciona los CA de HU-01 marcados como dependientes de D1. |
| D2 | Dónde se activa la mancha que sigue al cursor | **En TODAS las secciones.** Se mantienen los requisitos de `prefers-reduced-motion`, solo-desktop para el seguimiento y contraste AA. | Cambio respecto al supuesto previo (antes: solo secciones oscuras). |
| D3 | Métricas de éxito | **Enfoque técnico/calidad SIN analítica.** No se instala tracking (ver sección 8). | Confirmado por la editora. |

---

## 6. Historias de usuario

Formato: Como [rol], quiero [acción], para [beneficio]. Cada historia es independiente y de tamaño manejable.

> Nota de numeración: la antigua **HU-09 (tarjeta de contacto con foto + bio) ha sido retirada del alcance**. Se conserva el número para no confundir referencias previas, marcado claramente como retirada.

### HU-01 — Tipografía de impacto
**Como** visitante que entra por primera vez,
**quiero** que los titulares tengan fuerza visual y personalidad,
**para** percibir de un vistazo que es un estudio con carácter y quedarme a mirar.

### HU-02 — Etiquetas tipo pastilla
**Como** visitante,
**quiero** que los elementos interactivos (menú, botones, filtros, logo) compartan una forma de pastilla reconocible,
**para** identificar al instante qué puedo pulsar y moverme por la página con confianza.

### HU-03 — Fondos verde oscuro por sección
**Como** visitante,
**quiero** que cada sección tenga su propio matiz de verde oscuro con textura,
**para** distinguir las secciones según bajo y sentir un recorrido editorial agradable y coherente.

### HU-04 — Efecto mancha que sigue al cursor
**Como** visitante en ordenador,
**quiero** que una mancha de color (en tonos verdes/lima) reaccione suavemente a mi cursor en todas las secciones,
**para** disfrutar de un detalle vivo que demuestra el cuidado del estudio.

### HU-05 — Accesibilidad y respeto al movimiento
**Como** visitante con sensibilidad al movimiento o que navega con teclado/lector,
**quiero** poder leer y usar toda la web sin animaciones molestas y con buen contraste,
**para** acceder a la información en igualdad de condiciones.

### HU-06 — Lista de servicios y capacidades
**Como** cliente potencial que evalúa al estudio,
**quiero** ver los servicios y capacidades en columnas claras separadas por líneas finas,
**para** entender de un vistazo qué puede hacer giga109 por mí.

### HU-07 — Sección "cómo trabajamos"
**Como** cliente potencial indeciso,
**quiero** ver el proceso de trabajo paso a paso,
**para** saber qué esperar si contrato al estudio y reducir mi incertidumbre.

### HU-08 — Filtros por categoría en proyectos
**Como** cliente potencial con una necesidad concreta (web, tienda, app),
**quiero** filtrar los proyectos por categoría,
**para** encontrar rápido trabajos parecidos a lo que necesito.

### ~~HU-09 — Tarjeta de contacto con foto + bio~~ (RETIRADA — fuera de alcance)
**Retirada del alcance por decisión de la editora.** El contacto se mantiene como está en el pie de página actual. No se construye tarjeta con foto ni bio. Se conserva el identificador HU-09 únicamente como marca histórica; sus criterios de aceptación quedan anulados (ver sección 7).

### HU-10 — Sistema visual mantenible (editora)
**Como** editora del sitio con pocos conocimientos técnicos,
**quiero** que colores, fuentes, tamaños y formas estén centralizados como piezas reutilizables,
**para** poder hacer ajustes pequeños sin romper la coherencia de la página.

---

## 7. Criterios de aceptación (Given / When / Then)

> Concretos y verificables. Cada criterio describe un comportamiento. Incluyen casos negativos y límites.

### HU-01 — Tipografía de impacto
- **CA-01.1** — Given el hero cargado en escritorio, When se renderiza el titular principal, Then se muestra en sans bold condensada y en mayúsculas.
- **CA-01.2** — Given cualquier título de sección (`#proyectos`, `#clientes`, `#estudio`, `#tarifas`), When se renderiza, Then usa la misma familia de impacto y el mismo tratamiento que el resto de títulos de sección (coherencia).
- **CA-01.3** — Given la elección tipográfica decidida en F1 (D1: pendiente de elección visual), When se renderizan los titulares, Then siguen el tratamiento elegido en pruebas reales sin romper la alineación de línea base. (Si la elección incluye un guiño serif, aplica solo al elemento designado.)
- **CA-01.4** — Given los tamaños tipográficos definidos, When se cambia el ancho de la ventana entre móvil, tablet y escritorio, Then el `font-size` de cada nivel **no cambia** (sin `clamp()` ni cambios por `@media`).
- **CA-01.5** — Given un usuario que aumenta el zoom del navegador al 200%, When recarga o hace zoom, Then el texto escala con el zoom del navegador con normalidad (el zoom no está bloqueado).

### HU-02 — Etiquetas tipo pastilla
- **CA-02.1** — Given el header, When se renderizan logo, ítems de menú y CTA, Then todos tienen forma de pastilla (borde redondeado tipo stadium con borde visible).
- **CA-02.2** — Given una pastilla interactiva, When recibe foco por teclado (Tab), Then muestra un indicador de foco visible que cumple AA.
- **CA-02.3** — Given una pastilla con texto largo, When el texto no cabe en una línea, Then la pastilla mantiene su forma redondeada sin desbordar ni romper el layout.
- **CA-02.4** — Given los filtros de proyectos, When se renderizan, Then comparten el mismo estilo de pastilla que el resto de elementos interactivos.

### HU-03 — Fondos verde oscuro por sección
- **CA-03.1** — Given la página completa, When el usuario hace scroll, Then las secciones se muestran en **tonos de verde oscuro** (pudiendo variar el matiz entre secciones) con textura de ruido, en lugar de negro uniforme, y **sin usar crema, azul ni morado**.
- **CA-03.2** — Given cualquier texto sobre cualquiera de los matices de verde oscuro, When se mide el contraste, Then cumple AA (mínimo 4.5:1 texto normal; 3:1 texto grande).
- **CA-03.3** — Given el acento verde lima (#b6ee69) sobre cualquier matiz de verde oscuro, When se usa en precios, botones o cifras, Then sigue siendo legible y cumple AA donde funcione como texto.
- **CA-03.4** — Given la textura de ruido aplicada sobre verde oscuro, When se renderiza un fondo, Then el ruido no reduce el contraste del texto por debajo del umbral AA.

### HU-04 — Efecto mancha que sigue al cursor
- **CA-04.1** — Given un usuario en escritorio (puntero fino) en **cualquier sección** (D2: en todas), When mueve el cursor, Then una mancha de color (tonos verdes/lima) grande se desplaza siguiendo el cursor con movimiento suave (con lag, no instantáneo).
- **CA-04.2** — Given un dispositivo táctil o sin puntero fino, When se carga la página, Then la mancha NO sigue al cursor (fondo estático con ruido) y no hay errores en consola.
- **CA-04.3** — Given un usuario con `prefers-reduced-motion: reduce`, When carga la página, Then la mancha no se mueve siguiendo el cursor; se muestra un fondo estático equivalente.
- **CA-04.4** — Given el cursor personalizado existente, When el efecto mancha está activo, Then ambos conviven sin parpadeos ni saltos y el cursor personalizado sigue funcionando.
- **CA-04.5** — Given el efecto activo en todas las secciones (D2), When el usuario mueve el cursor sobre cualquier sección en escritorio, Then la mancha lo sigue manteniendo el contraste AA del texto de esa sección.
- **CA-04.6** — Given el efecto activo, When se mide el rendimiento durante el movimiento, Then no provoca caídas perceptibles de fluidez (el movimiento se mantiene fluido).

### HU-05 — Accesibilidad y respeto al movimiento
- **CA-05.1** — Given `prefers-reduced-motion: reduce`, When se carga la página, Then se eliminan o reducen las animaciones no esenciales (manchas, parallax, lag de cursor) priorizando la usabilidad.
- **CA-05.2** — Given navegación solo con teclado, When el usuario recorre la página con Tab, Then todos los elementos interactivos son alcanzables y tienen foco visible.
- **CA-05.3** — Given un lector de pantalla, When recorre las secciones, Then la información crítica está disponible como texto (no depende solo de efectos visuales ni de carruseles).
- **CA-05.4** — Given cualquier viewport entre 320px y escritorio, When se carga la página, Then no hay scroll horizontal no intencionado.

### HU-06 — Lista de servicios y capacidades
- **CA-06.1** — Given la nueva sección de servicios/capacidades, When se renderiza en escritorio, Then se muestra en columnas separadas por líneas finas con el contenido propio de giga109 (no de ykwmi).
- **CA-06.2** — Given la misma sección en móvil, When la pantalla es estrecha, Then las columnas se reorganizan (colapsan) sin perder legibilidad ni provocar scroll horizontal.
- **CA-06.3** — Given el contenido de servicios de `CONTEXTO_PROYECTO.md`, When se rellena la sección, Then refleja Webs, Tiendas online, Apps y Mantenimiento (o el set acordado), sin textos inventados.

### HU-07 — Sección "cómo trabajamos"
- **CA-07.1** — Given la nueva sección de proceso, When se renderiza, Then muestra los pasos del proceso de `CONTEXTO_PROYECTO.md` (Hablamos, Definimos, Diseñamos y desarrollamos, Lanzamos) en orden.
- **CA-07.2** — Given la sección de proceso, When se ve en móvil, Then los pasos se leen en orden vertical claro sin solaparse.

### HU-08 — Filtros por categoría en proyectos
- **CA-08.1** — Given la sección de proyectos con filtros, When el usuario pulsa una categoría, Then solo se muestran los proyectos de esa categoría y el filtro activo queda marcado visualmente.
- **CA-08.2** — Given un filtro activo, When el usuario pulsa "todos" (o equivalente), Then se vuelven a mostrar todos los proyectos.
- **CA-08.3** — Given una categoría sin proyectos, When se selecciona, Then se muestra un estado vacío comprensible en lugar de una rejilla en blanco sin explicación.
- **CA-08.4** — Given navegación por teclado, When el usuario llega a los filtros con Tab, Then puede activarlos con Enter/Espacio y el cambio es perceptible.
- **CA-08.5** — Given `prefers-reduced-motion`, When se aplica un filtro, Then los proyectos aparecen/desaparecen sin transiciones agresivas.

### ~~HU-09 — Tarjeta de contacto con foto + bio~~ (CRITERIOS ANULADOS)
Historia retirada del alcance. **Los criterios CA-09.1 a CA-09.3 quedan anulados** y no se implementan ni se testean. El contacto del pie de página actual se mantiene sin cambios.

### HU-10 — Sistema visual mantenible (editora)
- **CA-10.1** — Given la receta visual (tokens), When se cambia el valor de un color, una fuente o un espaciado en un único sitio, Then el cambio se propaga de forma coherente a toda la página.
- **CA-10.2** — Given los matices de verde oscuro de sección, When se definen, Then existen como piezas reutilizables (no valores sueltos repetidos) para que la editora los reaplique sin tocar cada sección a mano.
- **CA-10.3** — Given el efecto mancha, When se aplica a una sección, Then es reutilizable (se puede activar/desactivar por sección) sin duplicar código.

---

## 8. Métricas de éxito

Enfoque técnico/calidad, verificable **sin instalar analítica** (decisión D3 confirmada: no se instala tracking). Números, no sensaciones:

| Métrica | Objetivo |
|---------|----------|
| Contraste de texto sobre los matices de verde oscuro | 100% de los textos cumplen AA (4.5:1 normal / 3:1 grande) |
| LCP del hero (escritorio, conexión normal) | < 2.5 s |
| Scroll horizontal no intencionado | 0 casos entre 320px y escritorio |
| Soporte de `prefers-reduced-motion` | 100% de los efectos de movimiento lo respetan |
| Fluidez del efecto mancha | Movimiento fluido sostenido en escritorio, sin tirones perceptibles |
| Elementos interactivos accesibles por teclado | 100% alcanzables con foco visible |
| Tamaños tipográficos constantes | 0 usos de `clamp()` para tamaños y 0 cambios de tamaño por `@media` |
| Imágenes fuera del hero con carga diferida | 100% |

Criterio cualitativo de cierre por fase: la editora (tú) da el visto bueno al resultado visual de cada fase antes de pasar a la siguiente.

---

## 9. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| El ruido + degradados penalizan el rendimiento | Web lenta, mala sensación | Optimizar la textura de ruido; medir en F6; permitir desactivar el efecto por sección |
| Poco contraste entre matices de verde oscuro: secciones que no se distinguen | Recorrido editorial plano | Definir matices con suficiente diferencia entre sí en F0; validar visualmente en F3 |
| Contraste insuficiente del texto o del verde lima sobre verde oscuro | Falla AA, problema de accesibilidad | Validar contraste en F0 (al definir paleta verde) y de nuevo en F6 |
| El efecto mancha (ahora en todas las secciones) reduce el contraste del texto | Falla AA en alguna sección | Ajustar opacidad/mezcla de la mancha por sección; contraste AA es criterio (CA-04.5) |
| El efecto mancha entra en conflicto con el cursor personalizado | Parpadeos, saltos, mala UX | Integrar y probar juntos en F4; convivencia es criterio de aceptación (CA-04.4) |
| Tamaños tipográficos fijos complican el responsive | Layout apretado en móvil | Resolver con layout/espaciado (no con tamaños); revisar en F6 |
| Indecisión tipográfica (D1) retrasa F1 | F1 se alarga | Reservar tiempo de pruebas reales en F1; la elección no bloquea F0 |
| Inspiración demasiado cercana a ykwmi | Riesgo de parecer copia | Solo estructura/estilo; **paleta propia verde oscuro**; contenido y assets propios |

**Dependencias:**
- Contenido textual de las secciones: ya disponible en `CONTEXTO_PROYECTO.md`.
- **Categoría de cada proyecto para los filtros (HU-08):** la editora deberá aportar la categoría asignada a cada proyecto. **Dependencia pendiente que bloquea HU-08 / F5 si no llega.**
- Cursor personalizado existente (`js/cursor.js`) como base sobre la que integrar el efecto mancha.

---

## 10. Hoja de ruta por fases (F0–F6)

Se ejecuta **fase a fase, validando contigo** antes de avanzar.

| Fase | Nombre | Qué se hace | Historias / CA principales |
|------|--------|-------------|----------------------------|
| **F0** | Receta visual / tokens | Definir paleta (matices de **verde oscuro** + verde lima #b6ee69 de acento), fuentes, tamaños fijos, formas de pastilla y textura base. Validar contraste AA de salida. | HU-10; base de HU-01, HU-02, HU-03 |
| **F1** | Tipografía de impacto (estilo visual / Selina) | Probar opciones reales de titular en mayúsculas sans condensada y **cerrar D1 viendo pruebas** (con o sin guiño serif). | HU-01 |
| **F2** | Etiquetas pastilla | Aplicar forma pastilla a logo, menú, botones y filtros. | HU-02 |
| **F3** | Fondos verde oscuro por sección | Sustituir el negro uniforme por **matices de verde oscuro** con ruido, garantizando contraste. | HU-03 |
| **F4** | Mancha que sigue al cursor | Implementar el efecto reutilizable **en todas las secciones** (D2), integrarlo con el cursor existente, respetar reduced-motion y solo desktop. | HU-04 |
| **F5** | Secciones nuevas de contenido | Servicios/capacidades en columnas, "cómo trabajamos" y filtros de proyectos. (Requiere categorías de proyecto de la editora.) | HU-06, HU-07, HU-08 |
| **F6** | Repaso final | Responsive, contraste, rendimiento de ruido/degradados, reduced-motion, sin scroll horizontal, LCP. | HU-05 + todas las métricas de la sección 8 |

---

## 11. Glosario rápido (para la editora)

- **Monocromo:** una paleta basada en un solo color y sus variaciones (aquí, verde oscuro en varios matices). Analogía: como una foto en distintos tonos del mismo color en vez de a todo color.
- **Mesh gradient:** un fondo donde varias manchas de color se mezclan suavemente, como acuarelas que se funden. Aquí, en **tonos verdes/lima**. Analogía: como mezclar verdes con el dedo sobre papel mojado.
- **Textura de ruido (noise):** una capa muy fina de "grano" sobre el color, como el grano de una foto antigua. Da calidez y evita que los colores se vean planos.
- **Forma stadium / pastilla:** un rectángulo con los lados completamente redondeados, como una pastilla de jabón o la pista de atletismo.
- **Token:** una "pieza guardada" de diseño (un color, un tamaño, un espacio) con nombre, que se reutiliza en toda la web. Si cambias la pieza una vez, cambia en todas partes.
- **Contraste AA:** una norma de accesibilidad que asegura que el texto se lee bien sobre su fondo (suficiente diferencia entre el color del texto y el del fondo).
- **`prefers-reduced-motion`:** una preferencia del sistema del visitante que dice "quiero menos animaciones". Si la activa, la web le muestra una versión más tranquila.
- **LCP:** el tiempo que tarda en aparecer el elemento grande más importante de la pantalla (aquí, el hero). Cuanto más bajo, más rápida se siente la web.
