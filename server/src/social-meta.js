/**
 * Vista previa al compartir un enlace (LinkedIn, WhatsApp, X…).
 * El bot no ejecuta JavaScript: las etiquetas deben viajar ya en el HTML.
 */

const OG_IMAGE = '/images/og-cover.png';
const NOTE_ROUTE = /^\/(?:en\/)?daily\/([^/?#]+)/;

/** El proxy de Railway habla https por fuera y http por dentro. */
export function originFrom(headers = {}) {
  const proto = headers['x-forwarded-proto'] ?? 'http';
  return `${proto}://${headers.host ?? ''}`;
}

export function socialMetaFor(pathname, origin, notes = [], site) {
  const note = noteFor(pathname, notes);
  const language = pathname.startsWith('/en/') ? 'en' : 'es';

  return {
    type: note ? 'article' : 'website',
    title: note ? note.title[language] : site.title,
    description: note ? note.summary[language] : site.description,
    image: `${origin}${OG_IMAGE}`,
    url: `${origin}${pathname}`,
  };
}

export function injectSocialMeta(html, meta) {
  const tags = [
    `<meta property="og:type" content="${meta.type ?? 'website'}">`,
    `<meta property="og:title" content="${escapeAttribute(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}">`,
    `<meta property="og:image" content="${escapeAttribute(meta.image)}">`,
    `<meta property="og:url" content="${escapeAttribute(meta.url)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
  ].join('\n  ');

  return html.replace('</head>', `  ${tags}\n</head>`);
}

function noteFor(pathname, notes) {
  const slug = NOTE_ROUTE.exec(pathname)?.[1];
  return slug ? notes.find((note) => note.slug === slug) : undefined;
}

function escapeAttribute(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
