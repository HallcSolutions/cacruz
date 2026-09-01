export type TextSpan =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; url: string }
  | { kind: 'strong'; spans: TextSpan[] }
  | { kind: 'code'; text: string };

/**
 * Enlace `[texto](url)`, destacado `**texto**` o código `` `texto` `` (R55, R101, R102).
 * El enlace va primero: dentro de su etiqueta las demás marcas no se interpretan.
 * Cada marca exige contenido y cierre, así que `****`, ``` `` ``` o una marca a
 * medias no casan y el texto queda intacto (R103).
 */
const RICH_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;

/** Lo único que se interpreta dentro de un destacado (R104). El código no anida nada. */
const CODE_PATTERN = /`([^`]+)`/g;

/** Parte el texto en fragmentos: cada coincidencia del patrón, y lo que queda entre ellas. */
function scan(
  text: string,
  pattern: RegExp,
  toSpan: (match: RegExpMatchArray) => TextSpan,
): TextSpan[] {
  const spans: TextSpan[] = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    if (start > cursor) {
      spans.push({ kind: 'text', text: text.slice(cursor, start) });
    }
    spans.push(toSpan(match));
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    spans.push({ kind: 'text', text: text.slice(cursor) });
  }
  return spans;
}

const toCodeSpan = ([, codeText]: RegExpMatchArray): TextSpan => ({ kind: 'code', text: codeText });

function toRichSpan([, linkText, url, strongText, codeText]: RegExpMatchArray): TextSpan {
  if (url !== undefined) return { kind: 'link', text: linkText, url };
  if (strongText !== undefined) {
    return { kind: 'strong', spans: scan(strongText, CODE_PATTERN, toCodeSpan) };
  }
  return { kind: 'code', text: codeText };
}

/** Convierte el texto de una nota en fragmentos renderizables (R55, R101, R102, R103, R104). */
export function parseRichText(text: string): TextSpan[] {
  return scan(text, RICH_PATTERN, toRichSpan);
}

export function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
