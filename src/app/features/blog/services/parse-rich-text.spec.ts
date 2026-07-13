import { isExternalLink, parseRichText } from './parse-rich-text';

describe('parseRichText', () => {
  // R55 — texto sin enlaces queda intacto
  it('returns plain text as a single span (R55)', () => {
    expect(parseRichText('Hola mundo')).toEqual([{ kind: 'text', text: 'Hola mundo' }]);
  });

  it('returns nothing for an empty text (R55)', () => {
    expect(parseRichText('')).toEqual([]);
  });

  // R55 — reconoce los enlaces markdown
  it('extracts a link between plain fragments (R55)', () => {
    expect(parseRichText('Mira [chalc](https://github.com/x/chalc) hoy')).toEqual([
      { kind: 'text', text: 'Mira ' },
      { kind: 'link', text: 'chalc', url: 'https://github.com/x/chalc' },
      { kind: 'text', text: ' hoy' },
    ]);
  });

  it('extracts several links in the same paragraph (R55)', () => {
    const spans = parseRichText('[uno](https://a.com) y [dos](/proyectos)');
    expect(spans).toEqual([
      { kind: 'link', text: 'uno', url: 'https://a.com' },
      { kind: 'text', text: ' y ' },
      { kind: 'link', text: 'dos', url: '/proyectos' },
    ]);
  });

  it('does not create empty text spans around a link (R55)', () => {
    expect(parseRichText('[solo](https://a.com)')).toEqual([
      { kind: 'link', text: 'solo', url: 'https://a.com' },
    ]);
  });

  // R55 — externos abren en pestaña nueva
  it('detects external links (R55)', () => {
    expect(isExternalLink('https://github.com')).toBeTrue();
    expect(isExternalLink('http://x.com')).toBeTrue();
    expect(isExternalLink('/proyectos')).toBeFalse();
    expect(isExternalLink('#seccion')).toBeFalse();
  });
});
