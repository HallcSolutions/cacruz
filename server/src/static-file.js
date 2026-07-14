import { extname, join, normalize } from 'node:path';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export function contentTypeFor(filePath) {
  return CONTENT_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

/**
 * Traduce la URL pedida a una ruta dentro de la carpeta publicada.
 * Devuelve null si la ruta intenta salirse (path traversal).
 */
export function resolveStaticPath(root, url) {
  const pathname = decodeURIComponent(url.split('?')[0]);
  const relative = normalize(pathname).replace(/^([/\\.]+)/, '');
  const resolved = join(root, relative || 'index.html');

  if (!resolved.startsWith(root)) {
    return null;
  }
  return pathname === '/' ? join(root, 'index.html') : resolved;
}

/** Las rutas del SPA (sin extensión) se resuelven con index.html. */
export function isSpaRoute(url) {
  const pathname = url.split('?')[0];
  return extname(pathname) === '';
}
