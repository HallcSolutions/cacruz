import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAckEmail, buildEmail, validateContactMessage } from './contact-message.js';
import { createMailer } from './mailer.js';
import { injectSocialMeta, originFrom, socialMetaFor } from './social-meta.js';
import { cacheControlFor, contentTypeFor, isSpaRoute, resolveStaticPath } from './static-file.js';

const PORT = Number(process.env.PORT ?? 8080);
const TO = process.env.CONTACT_TO ?? 'christiancruzarango@gmail.com';
const MAX_BODY_BYTES = 20_000;

/** El sitio compilado por Angular, servido por este mismo servicio. */
const STATIC_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'cacruz', 'browser');

const SITE = {
  title: 'Christian Cruz Arango — Senior Full-Stack Developer',
  description:
    'Portafolio y notas de desarrollo de Christian Cruz Arango: arquitectura de software, Angular, .NET e ingeniería aumentada con IA.',
};

const mailer = createMailer(process.env);
const notes = await loadNotes();

const server = createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/contact') {
    return handleContact(request, response);
  }
  if (request.method === 'GET' && request.url === '/health') {
    return json(response, 200, { status: 'ok' });
  }
  if (request.method === 'GET' || request.method === 'HEAD') {
    return serveStatic(request, response);
  }
  return json(response, 405, { error: 'method_not_allowed' });
});

server.listen(PORT, () => console.log(`[web] listening on :${PORT}`));

async function handleContact(request, response) {
  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch {
    return json(response, 400, { error: 'invalid_payload' });
  }

  const rejection = validateContactMessage(payload);
  if (rejection) {
    return json(response, 400, { error: rejection });
  }

  try {
    await mailer.send(buildEmail(payload, TO));
  } catch (error) {
    console.error('[contact] send failed:', error.message);
    return json(response, 502, { error: 'send_failed' });
  }

  // El acuse al visitante no debe tumbar la petición: el mensaje ya llegó a Christian.
  try {
    await mailer.send(buildAckEmail(payload, TO));
  } catch (error) {
    console.error('[contact] ack failed:', error.message);
  }

  return json(response, 200, { status: 'sent' });
}

async function serveStatic(request, response) {
  const filePath = resolveStaticPath(STATIC_ROOT, request.url ?? '/');
  if (!filePath) {
    return json(response, 400, { error: 'invalid_path' });
  }

  const file = await findFile(filePath, request.url ?? '/');
  if (!file) {
    return json(response, 404, { error: 'not_found' });
  }

  if (file.endsWith('index.html')) {
    return serveShell(file, request, response);
  }

  response.writeHead(200, {
    'Content-Type': contentTypeFor(file),
    'Cache-Control': cacheControlFor(file),
  });
  createReadStream(file).pipe(response);
}

/**
 * El HTML se personaliza por ruta: los bots que arman la vista previa de un
 * enlace no ejecutan JavaScript, así que la nota debe viajar ya en el head.
 */
async function serveShell(file, request, response) {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const meta = socialMetaFor(pathname, originFrom(request.headers), notes, SITE);
  const html = injectSocialMeta(await readFile(file, 'utf8'), meta);

  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  response.end(html);
}

/** El índice de notas vive con el sitio compilado; si falta, se comparte la portada. */
async function loadNotes() {
  try {
    return JSON.parse(await readFile(join(STATIC_ROOT, 'content', 'blog', 'index.json'), 'utf8'));
  } catch {
    console.warn('[web] sin índice de notas: los enlaces compartirán la portada del sitio');
    return [];
  }
}

/** Los archivos se sirven tal cual; las rutas del SPA caen en index.html. */
async function findFile(filePath, url) {
  if (await isFile(filePath)) {
    return filePath;
  }
  if (isSpaRoute(url)) {
    const index = join(STATIC_ROOT, 'index.html');
    return (await isFile(index)) ? index : null;
  }
  return null;
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY_BYTES) {
        reject(new Error('payload_too_large'));
        request.destroy();
      }
    });
    request.on('end', () => resolve(raw));
    request.on('error', reject);
  });
}
