import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hasCredentials, smtpConfig } from './smtp-config.js';

const BASE = { SMTP_HOST: 'smtp.gmail.com', SMTP_USER: 'yo@x.com', SMTP_PASS: 'secreto' };

test('usa el puerto 587 por defecto, sin TLS implícito', () => {
  const c = smtpConfig(BASE);
  assert.equal(c.port, 587);
  assert.equal(c.secure, false);
  assert.equal(c.host, 'smtp.gmail.com');
});

test('el puerto 465 implica conexión segura', () => {
  assert.equal(smtpConfig({ ...BASE, SMTP_PORT: '465' }).secure, true);
});

test('SMTP_SECURE manda sobre la deducción por puerto', () => {
  assert.equal(smtpConfig({ ...BASE, SMTP_PORT: '587', SMTP_SECURE: 'true' }).secure, true);
  assert.equal(smtpConfig({ ...BASE, SMTP_PORT: '465', SMTP_SECURE: 'false' }).secure, false);
  assert.equal(smtpConfig({ ...BASE, SMTP_SECURE: 'TRUE' }).secure, true);
});

test('pasa las credenciales al transporte', () => {
  assert.deepEqual(smtpConfig(BASE).auth, { user: 'yo@x.com', pass: 'secreto' });
});

test('detecta si hay credenciales configuradas', () => {
  assert.equal(hasCredentials(BASE), true);
  assert.equal(hasCredentials({ SMTP_USER: 'yo@x.com' }), false);
  assert.equal(hasCredentials({}), false);
});
