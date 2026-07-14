import assert from 'node:assert/strict';
import { test } from 'node:test';
import { injectSocialMeta, originFrom, socialMetaFor } from './social-meta.js';

const NOTES = [
  {
    slug: 'what-is-an-ai-agent',
    title: { es: 'Qué es un agente de IA', en: 'What an AI agent is' },
    summary: { es: 'Un chat no es un agente.', en: 'A chat is not an agent.' },
  },
];

const SITE = {
  title: 'Christian Cruz Arango — Senior Full-Stack Developer',
  description: 'Portafolio y notas de Christian Cruz Arango.',
};

test('una nota compartida muestra su título y su resumen, no los del sitio', () => {
  const meta = socialMetaFor('/daily/what-is-an-ai-agent', 'https://cacruz.com', NOTES, SITE);

  assert.equal(meta.title, 'Qué es un agente de IA');
  assert.equal(meta.description, 'Un chat no es un agente.');
  assert.equal(meta.url, 'https://cacruz.com/daily/what-is-an-ai-agent');
});

test('la nota en inglés usa el título en inglés', () => {
  const meta = socialMetaFor('/en/daily/what-is-an-ai-agent', 'https://cacruz.com', NOTES, SITE);

  assert.equal(meta.title, 'What an AI agent is');
});

test('la imagen compartida siempre es la portada con el avatar', () => {
  const meta = socialMetaFor('/daily/what-is-an-ai-agent', 'https://cacruz.com', NOTES, SITE);

  assert.equal(meta.image, 'https://cacruz.com/images/og-cover.png');
});

test('cualquier otra ruta cae en la presentación del sitio', () => {
  const meta = socialMetaFor('/projects', 'https://cacruz.com', NOTES, SITE);

  assert.equal(meta.title, SITE.title);
  assert.equal(meta.description, SITE.description);
  assert.equal(meta.url, 'https://cacruz.com/projects');
});

test('una nota se comparte como artículo; el resto del sitio, como sitio', () => {
  assert.equal(socialMetaFor('/daily/what-is-an-ai-agent', 'https://cacruz.com', NOTES, SITE).type, 'article');
  assert.equal(socialMetaFor('/projects', 'https://cacruz.com', NOTES, SITE).type, 'website');
});

test('una nota que no existe no rompe: cae en la presentación del sitio', () => {
  const meta = socialMetaFor('/daily/no-existe', 'https://cacruz.com', NOTES, SITE);

  assert.equal(meta.title, SITE.title);
});

test('sin índice de notas tampoco rompe', () => {
  const meta = socialMetaFor('/daily/what-is-an-ai-agent', 'https://cacruz.com', [], SITE);

  assert.equal(meta.title, SITE.title);
});

test('el origen sale del host, respetando el proto del proxy de Railway', () => {
  assert.equal(originFrom({ host: 'cacruz.com', 'x-forwarded-proto': 'https' }), 'https://cacruz.com');
  assert.equal(originFrom({ host: 'localhost:8080' }), 'http://localhost:8080');
});

test('inyecta las etiquetas antes de cerrar el head', () => {
  const html = injectSocialMeta('<head><title>x</title></head><body></body>', {
    title: 'Título',
    description: 'Resumen',
    image: 'https://cacruz.com/images/og-cover.png',
    url: 'https://cacruz.com/daily/x',
  });

  assert.match(html, /<meta property="og:title" content="Título">/);
  assert.match(html, /<meta property="og:description" content="Resumen">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/cacruz\.com\/images\/og-cover\.png">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/cacruz\.com\/daily\/x">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.ok(html.indexOf('og:title') < html.indexOf('</head>'), 'las etiquetas van dentro del head');
});

test('un título con comillas no rompe el HTML', () => {
  const html = injectSocialMeta('<head></head>', {
    title: 'El "harness" & la IA',
    description: 'x',
    image: 'x',
    url: 'x',
  });

  assert.match(html, /content="El &quot;harness&quot; &amp; la IA"/);
});
