import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildAckEmail, buildEmail, validateContactMessage } from './contact-message.js';

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

test('el correo lleva versión HTML con formato y texto plano de respaldo', () => {
  const email = buildEmail(VALID, 'christiancruzarango@gmail.com');
  assert.match(email.html, /<!doctype html>/i);
  assert.match(email.html, /Ana Gómez/);
  assert.match(email.html, /Responder a Ana Gómez/);
  assert.ok(email.text.length > 0, 'el texto plano se conserva para clientes sin HTML');
});

test('sella la fecha de recepción en el correo', () => {
  const email = buildEmail(VALID, 'x@y.com', new Date('2026-07-13T19:40:00Z'));
  assert.match(email.text, /Recibido: .*2026/);
  assert.match(email.html, /2026/);
});

test('el acuse de recibo va dirigido al visitante y responde a Christian', () => {
  const ack = buildAckEmail(VALID, 'christiancruzarango@gmail.com');
  assert.equal(ack.to, 'ana@empresa.com');
  assert.equal(ack.replyTo, 'christiancruzarango@gmail.com');
  assert.match(ack.subject, /Gracias por escribirme, Ana/);
});

test('el acuse agradece por el nombre de pila y devuelve el mensaje enviado', () => {
  const ack = buildAckEmail(VALID, 'x@y.com');
  assert.match(ack.html, /¡Gracias por escribirme, Ana!/);
  assert.doesNotMatch(ack.html, /¡Gracias por escribirme, Ana Gómez!/);
  assert.match(ack.html, /Hola Christian/);
  assert.match(ack.html, /Christian Cruz Arango/);
  assert.match(ack.text, /Gracias por escribirme, Ana/);
});
