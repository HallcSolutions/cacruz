import { buildConsoleLines, MESSAGE_ECHO_LIMIT } from './build-console-lines';
import { ContactMessage } from './contact-message';

const EMPTY: ContactMessage = { name: '', email: '', message: '' };

describe('buildConsoleLines', () => {
  // R50 — arranca con el comando y esperando datos
  it('starts with the command and a waiting line (R50)', () => {
    const lines = buildConsoleLines(EMPTY);
    expect(lines[0]).toEqual({ kind: 'command', text: './contactar --a christian' });
    expect(lines[lines.length - 1].kind).toBe('waiting');
    expect(lines.length).toBe(2);
  });

  // R50 — cada campo escrito se refleja como eco
  it('echoes each field as it is typed (R50)', () => {
    const lines = buildConsoleLines({ ...EMPTY, name: 'Ana Gómez' });
    expect(lines[1]).toEqual({ kind: 'echo', text: 'name = "Ana Gómez"' });

    const withEmail = buildConsoleLines({ name: 'Ana', email: 'ana@x.com', message: '' });
    expect(withEmail.map((l) => l.text)).toContain('email = ana@x.com');
  });

  it('ignores fields with only whitespace (R50)', () => {
    expect(buildConsoleLines({ ...EMPTY, name: '   ' }).length).toBe(2);
  });

  it('truncates a message longer than the limit (R50)', () => {
    const long = 'a'.repeat(MESSAGE_ECHO_LIMIT + 1);
    const echo = buildConsoleLines({ ...EMPTY, message: long }).find((l) => l.kind === 'echo');
    expect(echo?.text).toBe(`message = "${'a'.repeat(MESSAGE_ECHO_LIMIT)}…"`);
  });

  it('keeps a message exactly at the limit intact (R50)', () => {
    const exact = 'b'.repeat(MESSAGE_ECHO_LIMIT);
    const echo = buildConsoleLines({ ...EMPTY, message: exact }).find((l) => l.kind === 'echo');
    expect(echo?.text).toBe(`message = "${exact}"`);
  });

  it('keeps a short message intact (R50)', () => {
    const echo = buildConsoleLines({ ...EMPTY, message: 'Hola' }).find((l) => l.kind === 'echo');
    expect(echo?.text).toBe('message = "Hola"');
  });

  it('echoes the fields in order: name, email, message (R50)', () => {
    const lines = buildConsoleLines({
      name: 'Ana',
      email: 'ana@x.com',
      message: 'Hola',
    }).filter((l) => l.kind === 'echo');
    expect(lines.map((l) => l.text)).toEqual([
      'name = "Ana"',
      'email = ana@x.com',
      'message = "Hola"',
    ]);
  });

  it('trims the echoed values (R50)', () => {
    const lines = buildConsoleLines({
      name: '  Ana  ',
      email: ' ana@x.com ',
      message: '  Hola  ',
    });
    expect(lines.map((l) => l.text)).toContain('name = "Ana"');
    expect(lines.map((l) => l.text)).toContain('email = ana@x.com');
    expect(lines.map((l) => l.text)).toContain('message = "Hola"');
  });

  // R50 — la línea de espera nombra exactamente lo que falta
  it('lists every missing field while waiting (R50)', () => {
    const waiting = (message: ContactMessage) => buildConsoleLines(message).at(-1)!.text;

    expect(waiting(EMPTY)).toBe('esperando: name, email, message');
    expect(waiting({ ...EMPTY, name: 'Ana' })).toBe('esperando: email, message');
    expect(waiting({ name: 'Ana', email: 'ana@x.com', message: '' })).toBe('esperando: message');
    expect(waiting({ name: 'Ana', email: 'ana', message: 'Hola' })).toBe('esperando: email');
    expect(waiting({ name: '', email: 'ana@x.com', message: 'Hola' })).toBe('esperando: name');
  });

  // R50 — anuncia cuando el mensaje está listo
  it('announces readiness only when every field is valid (R50)', () => {
    const complete = buildConsoleLines({
      name: 'Ana',
      email: 'ana@x.com',
      message: 'Hola Christian',
    });
    expect(complete[complete.length - 1]).toEqual({ kind: 'ready', text: 'listo para enviar ✓' });

    const invalidEmail = buildConsoleLines({ name: 'Ana', email: 'ana', message: 'Hola' });
    expect(invalidEmail[invalidEmail.length - 1].kind).toBe('waiting');
  });
});
