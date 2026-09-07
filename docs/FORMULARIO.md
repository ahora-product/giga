# Formulario de contacto — puesta en marcha

Los mensajes del formulario llegan a **hello@giga109.es**. El envío lo hace una
función serverless (`api/contacto.js`) que reenvía el correo con **Resend**.

> **Importante:** esto solo funciona con el sitio alojado en **Vercel**. En
> GitHub Pages no hay servidor que ejecute `api/`, así que el formulario
> devolvería un 404 al enviar.

## Piezas

| Archivo | Qué hace |
|---|---|
| `api/contacto.js` | Recibe el envío, valida y manda el correo por Resend |
| `js/contactForm.js` | Valida en el navegador, envía y muestra el resultado |
| `vercel.json` | Configuración del despliegue |

## Pasos

### 1. Crear la cuenta de Resend

1. Entra en [resend.com](https://resend.com) y regístrate.
2. Ve a **Domains → Add Domain** y añade `giga109.es`.
3. Resend te dará unos registros DNS (SPF, DKIM). Añádelos donde tengas el
   dominio. Sin esto los correos acabarían en spam.
4. Espera a que el dominio aparezca como **Verified**.
5. Ve a **API Keys → Create API Key** y copia la clave (empieza por `re_`).
   Solo se muestra una vez.

### 2. Desplegar en Vercel

1. Entra en [vercel.com](https://vercel.com) y crea un proyecto importando el
   repositorio de GitHub.
2. Framework preset: **Other**. No hay build ni carpeta de salida.
3. En **Settings → Environment Variables**, añade:

   | Nombre | Valor |
   |---|---|
   | `RESEND_API_KEY` | La clave `re_...` del paso anterior |
   | `MAIL_TO` | `hello@giga109.es` |
   | `MAIL_FROM` | `giga109 <web@giga109.es>` |

   `MAIL_FROM` debe usar el dominio verificado en Resend. Si aún no lo has
   verificado, déjalo sin poner: la función usa `onboarding@resend.dev`, que
   sirve para probar pero no para producción.

4. Despliega.

### 3. Apuntar el dominio a Vercel

El dominio está ahora en GitHub Pages (archivo `CNAME`). Para moverlo:

1. En Vercel: **Settings → Domains → Add** → `www.giga109.es`.
2. Cambia los registros DNS donde tengas el dominio, siguiendo lo que indique
   Vercel.
3. Cuando el dominio ya sirva desde Vercel, borra el archivo `CNAME` del
   repositorio y desactiva GitHub Pages para que no haya dos sitios vivos.

### 4. Comprobar

Rellena el formulario en la web publicada. Deberías recibir el correo en
hello@giga109.es. Al responder, la respuesta va directa al visitante
(el `reply_to` lleva su dirección).

Si algo falla, mira **Vercel → Deployments → Functions → Logs**: los errores se
registran con el prefijo `[contacto]`.

## Qué hace la función por seguridad

- La clave de Resend vive solo en el servidor, nunca llega al navegador.
- Valida los campos otra vez (lo que manda el navegador no es de fiar).
- Escapa el texto del visitante antes de meterlo en el HTML del correo.
- Recorta los campos a una longitud máxima.
- Campo trampa (`website`) para descartar bots sin molestar a las personas.
