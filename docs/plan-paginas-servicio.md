# Plan: páginas de servicio de giga109

Objetivo: posicionar en **toda España** (no solo Valencia) por búsquedas de servicio concretas, y presentar el **Plan giga**: una suscripción mensual al estilo DesignUp para que giga109 sea tu equipo para todo.

Valencia se queda como sede: el posicionamiento local lo hace el perfil de Google Business.

---

## 1. Estructura

| URL | Para qué búsquedas | Qué ofrece |
|---|---|---|
| `/plan-giga/` | diseño por suscripción, equipo de diseño mensual, diseño web con cuota mensual | **Plan giga:** suscripción mensual al estilo DesignUp. Web, marca y contenido de una en una, sin permanencia |
| `/diseno-web/` | diseño web a medida, páginas web para empresas, crear página web, tienda online a medida | Página simple, web corporativa y tienda online, en pago único |
| `/apps-a-medida/` | desarrollo de apps a medida, crear una app, apps React Native | Apps iOS/Android. Prueba: vuestras propias apps (menu0, Tap&Book y las del portfolio) |
| `/branding-y-contenido/` | branding para empresas, identidad visual, creación de contenido para redes | Logo, identidad, textos, fotos y redes. Se contrata suelto o dentro del Plan giga |

La home sigue siendo la puerta de entrada y enlaza a las cuatro.

## 2. Plantilla común de cada página

1. Un **H1** con la búsqueda principal y una intro de 2–3 frases.
2. **Qué incluye**, con precios y plazos.
3. **Cómo funciona** en 3–4 pasos.
4. **Pruebas:** proyectos relacionados, aunque sean pocos (2–4 bastan). En apps, vuestros productos.
5. Una **FAQ** propia de 5–8 preguntas.
6. Un **CTA de WhatsApp** con mensaje propio de la página.
7. **Breadcrumbs** (Inicio › Diseño web).
8. **Para buscadores:** title y description propios, canonical, OG y JSON-LD `Service` + `FAQPage` + `BreadcrumbList`.
9. Header y footer iguales a los de la home, copiados como en `legal/`, porque no hay build.

## 3. Plan giga (`/plan-giga/`)

**Concepto:** «Tu equipo creativo por una cuota al mes. Web, marca y contenido: pides, lo hacemos, sin permanencia».

Modelo de negocio de DesignUp (vídeo de referencia):
- cuota mensual fija y sin permanencia;
- peticiones ilimitadas que se hacen de una en una;
- cada petición entregada en X días laborables;
- cambios hasta que quede bien;
- se puede pausar y retomar;
- las peticiones se gestionan online, con un tablero, un formulario o WhatsApp;
- opción de presupuesto cerrado para quien prefiera pago único (enlaza a `/diseno-web/`).

**Secciones**, en el orden de DesignUp:
1. **Hero.** H1 con el concepto, subtítulo con la cuota, CTA «Empezar» (WhatsApp o alta) y una línea de confianza («Sin permanencia · Cancela cuando quieras · Te atiende una persona»).
2. **Cómo funciona**, en 3 pasos numerados:
   1. Te suscribes.
   2. Pides lo que necesites, de uno en uno.
   3. Lo recibes en X días, con cambios hasta que te guste.
3. **Por qué así:** 6 ventajas con icono:
   - tu tablero de peticiones;
   - un equipo entero;
   - sin permanencia;
   - escala contigo;
   - trabajo a medida, no plantilla;
   - coherencia de marca.
4. **Qué entra en el plan:** una cinta animada con palabras: Webs · Landings · Logos · Branding · Redes sociales · Textos · Presentaciones · Tiendas online…
5. **Plan y precio.** La tarjeta del plan con lo que incluye. Al lado, «¿Prefieres un proyecto cerrado? → Hablemos».
6. **FAQ larga** (8–10 preguntas):
   - ¿De verdad son ilimitadas?
   - ¿Cuánto tardáis?
   - ¿Cómo pido las cosas?
   - ¿Y si no me gusta?
   - ¿Puedo pausar?
   - ¿Puedo cancelar?
   - ¿Hay reembolsos?
   - ¿Puedo tener una sola petición?
   - ¿Quién hace el trabajo?
7. **CTA final grande**, con WhatsApp.

**Lo que tenemos que montar:**
- cómo se piden las cosas: tablero (Trello/Notion), formulario o WhatsApp;
- el alta o pago: con un enlace de pago recurrente de Stripe (Payment Link), sin backend nuevo, o de momento por WhatsApp;
- avisos en la home: una cuarta tarjeta en tarifas o una franja «Plan giga, tu equipo por X €/mes».

## 4. Diseño web a medida (`/diseno-web/`)

Los servicios de siempre en pago único: página simple (390 €), web corporativa (599 €) y tienda online (1299 €), con sus plazos. Un aviso enlaza al Plan giga para quien prefiera cuota mensual.

## 5. Branding y contenido (`/branding-y-contenido/`)

Servicios: logo e identidad visual, guía de marca, textos para web y redes, piezas para redes sociales y fotos/vídeo (si aplica). Se contratan sueltos o dentro del Plan giga.

En la home: un bloque corto «También hacemos branding y contenido» que enlaza aquí.

## 6. Cambios en la home

- **Galería de proyectos:** se mueve al final, después de la FAQ y antes del footer.
- **Plan giga:** cuarta tarjeta en tarifas, o una franja destacada, que enlaza a su página.
- **Branding y contenido:** bloque corto con enlace a su página.
- **Enlaces internos:**
  - las tarjetas de tarifas, con un «Ver más» a su página;
  - el footer, con una columna «Servicios».
- Repasar los textos que dicen «en Valencia» para que hablen de **toda España con sede en Valencia**: meta description, title, JSON-LD `areaServed`, `llms.txt` y la descripción de Google Business.

## 7. Orden de trabajo

1. Home: mover la galería al final y cambiar el enfoque de Valencia a España. (≈ 20 min)
2. `/diseno-web/`. (≈ 1 h) → la revisamos juntos; es la plantilla de las demás.
3. `/apps-a-medida/`. (≈ 45 min)
4. `/branding-y-contenido/`. (≈ 45 min)
5. `/plan-giga/`, cuando estén los datos del plan. (≈ 1 h 30)
6. Bloques nuevos de la home, enlaces internos, `sitemap.xml`, `llms.txt` y JSON-LD. (≈ 30 min)

## 8. Datos que faltan (los pone el equipo)

**Plan giga**
- Precio mensual (uno o varios planes).
- Qué entra: web, branding, contenido…; ¿todo o por planes?
- Plazo de entrega por petición.
- Pausa, permanencia (ninguna o mínima) y reembolsos.
- Cómo se piden las cosas y cómo se da de alta (Stripe o WhatsApp).

**Apps**
- Qué apps son vuestras y cuáles de clientes. Del portfolio: Beeme, Donut, MA365, Focus y CrewFive, además de menu0 y Tap&Book.
- Si se muestra precio «desde» o solo presupuesto.

**Proyectos de cada página**
- Web: Aguas Internacionales, Adriana Microblading, Susana Luján Seguros, Kasa, Pakana. ¿Correcto?

---

## Aplazado: web en 48 horas

Pendiente de investigar mejor antes de añadirla. Idea inicial: página propia `/web-en-48-horas/` con la web lanzada en 48 h gracias a una suscripción, que después se va mejorando cada mes.

Competencia encontrada (búsqueda del 28/10/2026):
- **En 24 h**, casi todo plantilla WordPress y pago único: Pymesworld, Santswebdesign (desde 149 €), Maanju (1.000 € / 1.500 €), Anasaci (con recargo) y Webzite.
- **En 48 h con cuota mensual:** Zap48 (300 € de alta + desde 34 €/mes, con hosting, dominio y cambios), Websbaratas (desde 45 €/mes, landings) y Jorge Gijón (desde 900 €/mes).
- **En 48 h con pago único:** web48.es (desde 295 €) y Logocrea (desde 600 €).
- Casi todos cuentan el plazo desde que reciben el contenido completo y en días laborables.
