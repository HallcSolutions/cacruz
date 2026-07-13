import { buildMailtoUrl, CONTACT_EMAIL, isCompleteMessage, isValidEmail } from './build-mailto-url';
import { ContactMessage } from './contact-message';

const VALID: ContactMessage = {
  name: 'Ana Gómez',
  email: 'ana@empresa.com',
  message: 'Buscamos un líder técnico para una plataforma en Angular.',
};

describe('contact message', () => {
  // R47 — validación del correo
  it('accepts a well formed email (R47)', () => {
    expect(isValidEmail('ana@empresa.com')).toBeTrue();
    expect(isValidEmail('a.b-c@sub.dominio.co')).toBeTrue();
  });

  it('rejects a malformed email (R47)', () => {
    expect(isValidEmail('ana')).toBeFalse();
    expect(isValidEmail('ana@')).toBeFalse();
    expect(isValidEmail('ana@empresa')).toBeFalse();
    expect(isValidEmail('ana empresa@x.com')).toBeFalse();
    expect(isValidEmail('')).toBeFalse();
  });

  // R47 — todos los campos son obligatorios
  it('requires name, email and message (R47)', () => {
    expect(isCompleteMessage(VALID)).toBeTrue();
    expect(isCompleteMessage({ ...VALID, name: '   ' })).toBeFalse();
    expect(isCompleteMessage({ ...VALID, message: '' })).toBeFalse();
    expect(isCompleteMessage({ ...VALID, email: 'ana' })).toBeFalse();
  });

  // R48 — el correo se dirige a Christian con asunto y cuerpo prellenados
  it('builds a mailto url addressed to Christian (R48)', () => {
    const url = buildMailtoUrl(VALID);
    expect(url.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBeTrue();
  });

  it('includes the sender name in the subject (R48)', () => {
    const params = new URLSearchParams(buildMailtoUrl(VALID).split('?')[1]);
    expect(params.get('subject')).toContain('Ana Gómez');
  });

  it('includes name, email and message in the body (R48)', () => {
    const params = new URLSearchParams(buildMailtoUrl(VALID).split('?')[1]);
    const body = params.get('body') ?? '';
    expect(body).toContain('Ana Gómez');
    expect(body).toContain('ana@empresa.com');
    expect(body).toContain('Buscamos un líder técnico para una plataforma en Angular.');
  });

  it('encodes special characters so the url stays valid (R48)', () => {
    const url = buildMailtoUrl({ ...VALID, message: 'Hola & adiós ¿vale?' });
    expect(url).not.toContain(' ');
    const body = new URLSearchParams(url.split('?')[1]).get('body') ?? '';
    expect(body).toContain('Hola & adiós ¿vale?');
  });
});
