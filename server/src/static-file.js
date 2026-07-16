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

/** Angular compila con `outputHashing: all`: `main-BY5G54AD.js`, `styles-4PSDNNBK.css`. */
const HASHED_BUILD_OUTPUT = /-[A-Z0-9]{8}\.(js|css)$/;

/**
 * Solo lo que cambia de nombre al cambiar de contenido puede cachearse para siempre.
 * El resto (contenido e imágenes conservan su nombre entre despliegues) debe revalidarse,
 * o el visitante seguiría viendo la versión anterior del sitio.
 */
export function cacheControlFor(filePath) {
  return HASHED_BUILD_OUTPUT.test(filePath) ? 'public, max-age=31536000, immutable' : 'no-cache';
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
