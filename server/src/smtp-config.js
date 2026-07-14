/** Traduce las variables de entorno a la configuración del transporte SMTP. */
export function smtpConfig(env) {
  const port = Number(env.SMTP_PORT ?? 587);
  const secure =
    env.SMTP_SECURE !== undefined ? env.SMTP_SECURE.toLowerCase() === 'true' : port === 465;

  return {
    host: env.SMTP_HOST,
    port,
    secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  };
}

/** Sin credenciales el servicio trabaja en modo prueba: registra, no envía. */
export function hasCredentials(env) {
  return Boolean(env.SMTP_USER && env.SMTP_PASS);
}
