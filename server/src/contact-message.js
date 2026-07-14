import { renderAckHtml, renderEmailHtml } from './email-template.js';

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

/** Fecha legible para el encabezado del correo (hora de Colombia). */
export function formatReceivedAt(date) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  }).format(date);
}

/** Construye el correo que recibirá Christian: HTML con formato, y texto plano de respaldo. */
export function buildEmail(payload, to, now = new Date()) {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();
  const receivedAt = formatReceivedAt(now);

  return {
    to,
    replyTo: email,
    subject: `Nuevo contacto desde cacruz.com — ${name}`,
    text: [`Nombre: ${name}`, `Correo: ${email}`, `Recibido: ${receivedAt}`, '', message].join('\n'),
    html: renderEmailHtml({ name, email, message }, receivedAt),
  };
}

/** Construye el acuse de recibo que se le devuelve al visitante. */
export function buildAckEmail(payload, replyTo, now = new Date()) {
  const name = payload.name.trim();
  const firstName = name.split(/\s+/)[0];
  const message = payload.message.trim();
  const receivedAt = formatReceivedAt(now);

  return {
    to: payload.email.trim(),
    replyTo,
    subject: `¡Gracias por escribirme, ${firstName}! — Christian Cruz Arango`,
    text: [
      `¡Gracias por escribirme, ${firstName}!`,
      '',
      'Tu mensaje ya está en mi bandeja y es un placer que te hayas tomado el tiempo de contarme.',
      'Lo leo con calma y te respondo personalmente, normalmente dentro de las próximas 24 horas.',
      '',
      'Esto es lo que me enviaste:',
      message,
      '',
      `Recibido: ${receivedAt}`,
      '',
      'Christian Cruz Arango — Senior Full-Stack Developer · AI Engineer',
      'cacruz.com',
    ].join('\n'),
    html: renderAckHtml({ name, message }, receivedAt),
  };
}
