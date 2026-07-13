import { createServer } from 'node:http';
import { buildEmail, validateContactMessage } from './contact-message.js';
import { createMailer } from './mailer.js';

const PORT = Number(process.env.PORT ?? 8080);
const TO = process.env.CONTACT_TO ?? 'christiancruzarango@gmail.com';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';
const MAX_BODY_BYTES = 20_000;

const mailer = createMailer(process.env);

const server = createServer(async (request, response) => {
  setCors(response);

  if (request.method === 'OPTIONS') {
    return end(response, 204, null);
  }
  if (request.method === 'GET' && request.url === '/health') {
    return end(response, 200, { status: 'ok' });
  }
  if (request.method !== 'POST' || request.url !== '/contact') {
    return end(response, 404, { error: 'not_found' });
  }

  let payload;
  try {
    payload = JSON.parse(await readBody(request));
  } catch {
    return end(response, 400, { error: 'invalid_payload' });
  }

  const rejection = validateContactMessage(payload);
  if (rejection) {
    return end(response, 400, { error: rejection });
  }

  try {
    await mailer.send(buildEmail(payload, TO));
    return end(response, 200, { status: 'sent' });
  } catch (error) {
    console.error('[contact] send failed:', error.message);
    return end(response, 502, { error: 'send_failed' });
  }
});

server.listen(PORT, () => console.log(`[contact] listening on :${PORT}`));

function setCors(response) {
  response.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function end(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(body ? JSON.stringify(body) : undefined);
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
