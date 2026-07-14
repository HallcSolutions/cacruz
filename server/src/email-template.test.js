import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml, renderEmailHtml, toParagraphs } from './email-template.js';

const MESSAGE = {
  name: 'Ana Gómez',
  email: 'ana@empresa.com',
  message: 'Hola Christian.\nBuscamos un líder técnico.\n\n¿Podemos hablar esta semana?',
};

test('escapa el HTML del visitante (no se inyecta markup)', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script>'),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
  );
  assert.equal(escapeHtml("Tom & Jerry's"), 'Tom &amp; Jerry&#39;s');
});

test('convierte los bloques en párrafos y los saltos simples en <br>', () => {
  const html = toParagraphs('Primero\nsegunda línea\n\nOtro bloque');
  assert.match(html, /Primero<br \/>segunda línea/);
  assert.match(html, /<p[^>]*>Otro bloque<\/p>/);
  assert.equal(html.match(/<p /g).length, 2);
});

test('el cuerpo incluye nombre, correo, fecha y mensaje', () => {
  const html = renderEmailHtml(MESSAGE, '13 de julio de 2026, 19:40');
  assert.match(html, /Ana Gómez/);
  assert.match(html, /ana@empresa\.com/);
  assert.match(html, /13 de julio de 2026, 19:40/);
  assert.match(html, /Buscamos un líder técnico/);
});

test('incluye el botón de responder al visitante', () => {
  const html = renderEmailHtml(MESSAGE, 'hoy');
  assert.match(html, /href="mailto:ana@empresa\.com\?subject=/);
  assert.match(html, /Responder a Ana Gómez/);
});

test('un mensaje con HTML malicioso llega escapado, no ejecutado', () => {
  const html = renderEmailHtml(
    { ...MESSAGE, message: '<img src=x onerror="alert(1)">' },
    'hoy',
  );
  assert.match(html, /&lt;img src=x/);
  assert.doesNotMatch(html, /<img src=x/);
});
