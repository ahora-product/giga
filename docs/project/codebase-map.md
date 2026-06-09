# Codebase Map

**Actualizado en:** 2026-06-08T22:51:49.098981+00:00
**Proyecto:** giga

**Área de foco solicitada:** que alfred tengo que usar para el copywriting

## Propósito aparente del proyecto

Landing one-page (HTML + CSS + JS) para un estudio boutique ficticio. Sin build: sirve la carpeta con HTTP (los módulos ES `import` no funcionan con `file://` en la mayoría de navegadores).

## Stack y runtime detectados

- Runtime: `desconocido`
- Lenguaje principal: `desconocido`
- Framework: `desconocido`

## Entry points y rutas críticas

- index.html
- .preview-style/index.html
- js/studioCounters.js
- js/projectScatter.js
- js/footer-clock.js

## Módulos o dominios principales

- docs

## Pruebas, build y despliegue

### Tests

- No se detecta una infraestructura clara de tests automatizados.

### Build / arranque

- No se detectan scripts claros de build o arranque más allá del código fuente.

### Despliegue / operación

- No se detectan artefactos claros de despliegue o CI/CD en la raíz.

## Convenciones y patrones que conviene respetar

- Mantener `docs/` como lugar visible para artefactos operativos y documentación.

## Riesgos, deuda visible y preguntas abiertas

- La ausencia de tests claros aumenta el riesgo de regresión al tocar el repo.
- No hay señales claras de despliegue/CI, así que conviene validar el camino de entrega antes de cambios grandes.
- El framework no está claramente declarado; hay riesgo de asumir una arquitectura equivocada si no se contrasta con el código.
