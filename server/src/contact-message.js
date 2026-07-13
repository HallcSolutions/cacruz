const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** Valida el mensaje recibido y devuelve el motivo del rechazo, o null si es válido. */
export function validateContactMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'invalid_payload';
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || !message) {
    return 'missing_fields';
  }
  if (!EMAIL_PATTERN.test(email)) {
    return 'invalid_email';
  }
  if (name.length > 120 || email.length > 160 || message.length > 5000) {
    return 'too_long';
  }
  return null;
}

/** Construye el correo que recibirá Christian. */
export function buildEmail(payload, to) {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();

  return {
    to,
    replyTo: email,
    subject: `Nuevo contacto desde ccruz.dev — ${name}`,
    text: [`Nombre: ${name}`, `Correo: ${email}`, '', message].join('\n'),
  };
}
