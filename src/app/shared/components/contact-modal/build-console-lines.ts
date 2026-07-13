import { isCompleteMessage, isValidEmail } from './build-mailto-url';
import { ConsoleLine } from './console-line';
import { ContactMessage } from './contact-message';

export const MESSAGE_ECHO_LIMIT = 42;

export function buildConsoleLines(message: ContactMessage): ConsoleLine[] {
  const lines: ConsoleLine[] = [
    { kind: 'command', text: './contactar --a christian' },
  ];

  const name = message.name.trim();
  const email = message.email.trim();
  const body = message.message.trim();

  if (name) {
    lines.push({ kind: 'echo', text: `name = "${name}"` });
  }
  if (email) {
    lines.push({ kind: 'echo', text: `email = ${email}` });
  }
  if (body) {
    lines.push({ kind: 'echo', text: `message = "${truncate(body)}"` });
  }

  lines.push(
    isCompleteMessage(message)
      ? { kind: 'ready', text: 'listo para enviar ✓' }
      : { kind: 'waiting', text: pendingHint(name, email, body) },
  );

  return lines;
}

function truncate(text: string): string {
  return text.length > MESSAGE_ECHO_LIMIT ? `${text.slice(0, MESSAGE_ECHO_LIMIT)}…` : text;
}

function pendingHint(name: string, email: string, body: string): string {
  const missing: string[] = [];
  if (!name) missing.push('name');
  if (!isValidEmail(email)) missing.push('email');
  if (!body) missing.push('message');
  return `esperando: ${missing.join(', ')}`;
}
