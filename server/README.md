# Servicio web — ccruz.dev

Servicio único (Node puro, sin frameworks) que **sirve el sitio Angular compilado** y expone el
**endpoint de contacto**. Un solo despliegue, un solo dominio, sin CORS.

## Rutas

| Método | Ruta | Qué hace |
|---|---|---|
| `GET` | `/health` | Healthcheck de Railway → `{status:"ok"}` |
| `POST` | `/contact` | Recibe `{name, email, message}`, valida y envía el correo a Christian |
| `GET` | `/*` | Sirve `dist/cacruz/browser`; las rutas del SPA caen en `index.html` |

Respuestas de `/contact`: `200 {status:"sent"}` · `400 {error}` si el mensaje es inválido ·
`502 {error:"send_failed"}` si el SMTP falla.

## Variables de entorno (Railway → Variables)

| Variable | Ejemplo | Nota |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `christiancruzarango@gmail.com` | |
| `SMTP_PASS` | *(contraseña de aplicación de Google)* | **No** es la contraseña de Gmail: se genera en https://myaccount.google.com/apppasswords con verificación en dos pasos activa |
| `CONTACT_TO` | `christiancruzarango@gmail.com` | opcional (ya apunta ahí por defecto) |

**Sin `SMTP_USER`/`SMTP_PASS` el servicio arranca en modo prueba**: valida el mensaje y lo registra
en consola, pero no lo envía. Útil en local; en producción hay que configurarlas.

## Local

```bash
npm run build            # (en la raíz) compila el sitio a dist/cacruz/browser
npm --prefix server ci
npm --prefix server test # 12 tests
node server/src/main.js  # http://localhost:8080
```

## Railway

El despliegue lo describe `railway.json` en la raíz:

- **build**: `npm ci && npm run build && npm ci --prefix server --omit=dev`
- **start**: `node server/src/main.js`
- **healthcheck**: `/health`

```bash
railway up          # despliega
railway logs        # ver logs
railway domain      # dominio público
```
