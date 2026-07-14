import nodemailer from 'nodemailer';
import { hasCredentials, smtpConfig } from './smtp-config.js';

/**
 * Transporte SMTP configurado por variables de entorno (Railway):
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE.
 *
 * Sin credenciales trabaja en modo prueba: registra el correo en consola en vez
 * de enviarlo, para poder probar el flujo completo en local.
 */
export function createMailer(env) {
  if (!hasCredentials(env)) {
    return {
      async send(email) {
        console.warn('[contact] MODO PRUEBA (sin SMTP): correo NO enviado\n', email);
      },
    };
  }

  const transporter = nodemailer.createTransport(smtpConfig(env));

  return {
    async send(email) {
      await transporter.sendMail({ ...email, from: `"cacruz.com" <${env.SMTP_USER}>` });
    },
  };
}
