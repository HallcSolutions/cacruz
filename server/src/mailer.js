import nodemailer from 'nodemailer';

/**
 * Transporte SMTP configurado por variables de entorno (Railway):
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 *
 * Sin credenciales configuradas trabaja en modo prueba: registra el correo en consola
 * en vez de enviarlo, para poder probar el flujo completo en local.
 */
export function createMailer(env) {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    return {
      async send(email) {
        console.warn('[contact] MODO PRUEBA (sin SMTP): correo NO enviado\n', email);
      },
    };
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 587),
    secure: Number(env.SMTP_PORT ?? 587) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

  return {
    async send(email) {
      await transporter.sendMail({ ...email, from: `"ccruz.dev" <${env.SMTP_USER}>` });
    },
  };
}
