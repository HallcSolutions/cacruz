import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';
import { cacheControlFor, contentTypeFor, isSpaRoute, resolveStaticPath } from './static-file.js';

const ROOT = join('D:', 'app', 'dist', 'browser');

test('resuelve la raíz con index.html', () => {
  assert.equal(resolveStaticPath(ROOT, '/'), join(ROOT, 'index.html'));
});

test('resuelve un archivo real dentro de la carpeta publicada', () => {
  assert.equal(resolveStaticPath(ROOT, '/images/logo.png'), join(ROOT, 'images', 'logo.png'));
});

test('ignora la query string', () => {
  assert.equal(resolveStaticPath(ROOT, '/main.js?v=123'), join(ROOT, 'main.js'));
});

test('bloquea el path traversal', () => {
  assert.equal(resolveStaticPath(ROOT, '/../../secreto.env'), join(ROOT, 'secreto.env'));
  assert.equal(resolveStaticPath(ROOT, '/..%2f..%2fsecreto'), join(ROOT, 'secreto'));
});

test('las rutas del SPA no tienen extensión', () => {
  assert.equal(isSpaRoute('/daily/skills-mcp-harness'), true);
  assert.equal(isSpaRoute('/projects'), true);
  assert.equal(isSpaRoute('/main.js'), false);
  assert.equal(isSpaRoute('/content/profile.es.json'), false);
});

test('asigna el content-type correcto', () => {
  assert.equal(contentTypeFor('/index.html'), 'text/html; charset=utf-8');
  assert.equal(contentTypeFor('/main.js'), 'text/javascript; charset=utf-8');
  assert.equal(contentTypeFor('/styles.css'), 'text/css; charset=utf-8');
  assert.equal(contentTypeFor('/images/spec.svg'), 'image/svg+xml');
  assert.equal(contentTypeFor('/content/blog/index.json'), 'application/json; charset=utf-8');
  assert.equal(contentTypeFor('/raro.xyz'), 'application/octet-stream');
});

test('los archivos con hash de Angular se cachean para siempre', () => {
  assert.equal(cacheControlFor('/main-BY5G54AD.js'), 'public, max-age=31536000, immutable');
  assert.equal(cacheControlFor('/styles-4PSDNNBK.css'), 'public, max-age=31536000, immutable');
  assert.equal(cacheControlFor('/chunk-2JRDSQTZ.js'), 'public, max-age=31536000, immutable');
  assert.equal(cacheControlFor('/polyfills-5CFQRCPP.js'), 'public, max-age=31536000, immutable');
});

test('el contenido y las imágenes se revalidan en cada visita', () => {
  assert.equal(cacheControlFor('/content/blog/index.json'), 'no-cache');
  assert.equal(cacheControlFor('/content/profile.es.json'), 'no-cache');
  assert.equal(cacheControlFor('/images/blog/agent-loop.es.svg'), 'no-cache');
  assert.equal(cacheControlFor('/images/avatar.png'), 'no-cache');
  assert.equal(cacheControlFor('/favicon.ico'), 'no-cache');
});

test('un nombre sin hash no se confunde con uno hasheado', () => {
  assert.equal(cacheControlFor('/main.js'), 'no-cache');
  assert.equal(cacheControlFor('/styles.css'), 'no-cache');
  assert.equal(cacheControlFor('/images/mi-foto-DE-VIAJE.png'), 'no-cache');
  assert.equal(cacheControlFor('/content/blog/ONE-CONTRACT.json'), 'no-cache');
});
