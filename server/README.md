# Servicio de contacto — ccruz.dev

Backend mínimo (Node puro + nodemailer) que recibe el formulario del modal y envía el correo a Christian.
Pensado para desplegarse en **Railway** con root directory `server/`.

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| `POST` | `/contact` | `200 {status:"sent"}` · `400 {error}` si el mensaje es inválido · `502 {error:"send_failed"}` si el SMTP falla |
| `GET` | `/health` | `200 {status:"ok"}` |

Body esperado: `{ "name": "...", "email": "...", "message": "..." }`

## Variables de entorno (Railway → Variables)

| Variable | Ejemplo | Nota |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `christiancruzarango@gmail.com` | |
| `SMTP_PASS` | *(contraseña de aplicación de Google)* | **No** es la contraseña normal de Gmail: se genera en https://myaccount.google.com/apppasswords con verificación en dos pasos activa |
| `CONTACT_TO` | `christiancruzarango@gmail.com` | opcional (por defecto ya apunta ahí) |
| `ALLOWED_ORIGIN` | `https://ccruz.dev` | dominio del sitio; usar `*` mientras se prueba |

## Comandos

```bash
npm install
npm test     # valida el contrato del mensaje
npm start    # levanta en :8080
```

## Despliegue en Railway

```bash
railway login
railway init          # o: railway link  (si el proyecto ya existe)
railway up            # despliega esta carpeta
railway domain        # genera la URL pública
```

Luego pega esa URL en `src/app/core/config/contact-api.ts` del frontend.
