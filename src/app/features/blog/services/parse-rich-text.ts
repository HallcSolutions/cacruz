export type TextSpan = { kind: 'text'; text: string } | { kind: 'link'; text: string; url: string };

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Convierte un texto con enlaces `[texto](url)` en fragmentos renderizables (R55). */
export function parseRichText(text: string): TextSpan[] {
  const spans: TextSpan[] = [];
  let cursor = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const start = match.index;
    if (start > cursor) {
      spans.push({ kind: 'text', text: text.slice(cursor, start) });
    }
    spans.push({ kind: 'link', text: match[1], url: match[2] });
    cursor = start + match[0].length;
  }

  if (cursor < text.length) {
    spans.push({ kind: 'text', text: text.slice(cursor) });
  }
  return spans;
}

export function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}
