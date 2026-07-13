import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildEmail, validateContactMessage } from './contact-message.js';

const VALID = { name: 'Ana Gómez', email: 'ana@empresa.com', message: 'Hola Christian' };

test('acepta un mensaje válido (R51)', () => {
  assert.equal(validateContactMessage(VALID), null);
});

test('rechaza campos vacíos (R51)', () => {
  assert.equal(validateContactMessage({ ...VALID, name: '  ' }), 'missing_fields');
  assert.equal(validateContactMessage({ ...VALID, message: '' }), 'missing_fields');
});

test('rechaza correos inválidos (R51)', () => {
  assert.equal(validateContactMessage({ ...VALID, email: 'ana' }), 'invalid_email');
  assert.equal(validateContactMessage({ ...VALID, email: 'ana@empresa' }), 'invalid_email');
});

test('rechaza payloads que no son objeto (R51)', () => {
  assert.equal(validateContactMessage(null), 'invalid_payload');
  assert.equal(validateContactMessage('hola'), 'invalid_payload');
});

test('rechaza textos desmedidos (R51)', () => {
  assert.equal(validateContactMessage({ ...VALID, message: 'a'.repeat(5001) }), 'too_long');
});

test('construye el correo dirigido a Christian con reply-to del visitante (R51)', () => {
  const email = buildEmail(VALID, 'christiancruzarango@gmail.com');
  assert.equal(email.to, 'christiancruzarango@gmail.com');
  assert.equal(email.replyTo, 'ana@empresa.com');
  assert.match(email.subject, /Ana Gómez/);
  assert.match(email.text, /Hola Christian/);
  assert.match(email.text, /ana@empresa\.com/);
});
