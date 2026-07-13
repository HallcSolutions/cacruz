import { ContactMessage } from './contact-message';

export const CONTACT_EMAIL = 'christiancruzarango@gmail.com';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isCompleteMessage(message: ContactMessage): boolean {
  return (
    message.name.trim().length > 0 &&
    message.message.trim().length > 0 &&
    isValidEmail(message.email)
  );
}

export function buildMailtoUrl(message: ContactMessage): string {
  const name = message.name.trim();
  const subject = encodeURIComponent(`Contacto desde ccruz.dev — ${name}`);
  const body = encodeURIComponent(
    [`Nombre: ${name}`, `Correo: ${message.email.trim()}`, '', message.message.trim()].join('\n'),
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
