import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildEmail, validateContactMessage } from './contact-message.js';
import { createMailer } from './mailer.js';
import { contentTypeFor, isSpaRoute, resolveStaticPath } from './static-file.js';

const PORT = Number(process.env.PORT ?? 8080);
const TO = process.env.CONTACT_TO ?? 'christiancruzarango@gmail.com';
const MAX_BODY_BYTES = 20_000;

/** El sitio compilado por Angular, servido por este mismo servicio. */
const STATIC_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist', 'cacruz', 'browser');

const mailer = createMailer(process.env);

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
    return json(response, 200, { status: 'sent' });
  } catch (error) {
    console.error('[contact] send failed:', error.message);
    return json(response, 502, { error: 'send_failed' });
  }
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

  response.writeHead(200, {
    'Content-Type': contentTypeFor(file),
    'Cache-Control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000',
  });
  createReadStream(file).pipe(response);
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
