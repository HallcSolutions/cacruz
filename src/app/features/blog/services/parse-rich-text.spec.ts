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

describe('parseRichText — énfasis y código', () => {
  // R101 — el texto entre dobles asteriscos se destaca y los asteriscos desaparecen
  it('extracts a strong fragment between plain text (R101)', () => {
    expect(parseRichText('el build va **después** del cambio')).toEqual([
      { kind: 'text', text: 'el build va ' },
      { kind: 'strong', spans: [{ kind: 'text', text: 'después' }] },
      { kind: 'text', text: ' del cambio' },
    ]);
  });

  it('extracts a strong fragment that opens the text (R101)', () => {
    expect(parseRichText('**Reproducir primero.** Un bug entra en rojo')).toEqual([
      { kind: 'strong', spans: [{ kind: 'text', text: 'Reproducir primero.' }] },
      { kind: 'text', text: ' Un bug entra en rojo' },
    ]);
  });

  // R102 — el texto entre comillas invertidas se muestra como código
  it('extracts a code fragment between plain text (R102)', () => {
    expect(parseRichText('corre `flutter test` y mira')).toEqual([
      { kind: 'text', text: 'corre ' },
      { kind: 'code', text: 'flutter test' },
      { kind: 'text', text: ' y mira' },
    ]);
  });

  it('extracts several code fragments in the same text (R102)', () => {
    expect(parseRichText('`core` y `shared`')).toEqual([
      { kind: 'code', text: 'core' },
      { kind: 'text', text: ' y ' },
      { kind: 'code', text: 'shared' },
    ]);
  });

  // R101 + R102 + R55 — las tres marcas conviven en el mismo texto
  it('mixes links, strong and code in one text (R101, R102, R55)', () => {
    expect(parseRichText('**Ojo:** lee [la guía](https://x.com) y corre `ng test`')).toEqual([
      { kind: 'strong', spans: [{ kind: 'text', text: 'Ojo:' }] },
      { kind: 'text', text: ' lee ' },
      { kind: 'link', text: 'la guía', url: 'https://x.com' },
      { kind: 'text', text: ' y corre ' },
      { kind: 'code', text: 'ng test' },
    ]);
  });

  it('does not treat a link label as emphasis (R55, R101)', () => {
    expect(parseRichText('[**no** es fuerte](https://x.com)')).toEqual([
      { kind: 'link', text: '**no** es fuerte', url: 'https://x.com' },
    ]);
  });

  // R103 — marcas sin cerrar o vacías se dejan tal cual, sin perder caracteres
  it('leaves an unclosed strong mark untouched (R103)', () => {
    expect(parseRichText('esto **no cierra')).toEqual([{ kind: 'text', text: 'esto **no cierra' }]);
  });

  it('leaves an unclosed code mark untouched (R103)', () => {
    expect(parseRichText('esto `no cierra')).toEqual([{ kind: 'text', text: 'esto `no cierra' }]);
  });

  it('leaves empty marks untouched (R103)', () => {
    expect(parseRichText('vacío **** y ``')).toEqual([{ kind: 'text', text: 'vacío **** y ``' }]);
  });

  it('never loses characters (R103)', () => {
    const original = 'a **b** c `d` e [f](/g) h ** i ` j';
    const rebuilt = parseRichText(original)
      .map(function rebuild(span): string {
        if (span.kind === 'strong') return `**${span.spans.map(rebuild).join('')}**`;
        if (span.kind === 'code') return `\`${span.text}\``;
        if (span.kind === 'link') return `[${span.text}](${span.url})`;
        return span.text;
      })
      .join('');
    expect(rebuilt).toBe(original);
  });

  // R104 — el destacado puede contener código en línea, y el código no interpreta nada dentro
  it('renders code inside a strong fragment (R104)', () => {
    expect(parseRichText('**`story`**')).toEqual([
      { kind: 'strong', spans: [{ kind: 'code', text: 'story' }] },
    ]);
  });

  it('mixes code and text inside the same strong fragment (R104)', () => {
    expect(parseRichText('**`spec.md` — el QUÉ**')).toEqual([
      {
        kind: 'strong',
        spans: [
          { kind: 'code', text: 'spec.md' },
          { kind: 'text', text: ' — el QUÉ' },
        ],
      },
    ]);
  });

  it('keeps a strong fragment around its nested code (R104)', () => {
    expect(parseRichText('el **campo `note`** manda')).toEqual([
      { kind: 'text', text: 'el ' },
      {
        kind: 'strong',
        spans: [
          { kind: 'text', text: 'campo ' },
          { kind: 'code', text: 'note' },
        ],
      },
      { kind: 'text', text: ' manda' },
    ]);
  });

  it('does not interpret marks inside a code fragment (R104)', () => {
    expect(parseRichText('`a **b** c`')).toEqual([{ kind: 'code', text: 'a **b** c' }]);
  });

  it('never loses characters with nested marks (R103, R104)', () => {
    const original = 'x **`a` y `b`** z `c` ** d';
    const rebuilt = parseRichText(original)
      .map(function rebuild(span): string {
        if (span.kind === 'strong') return `**${span.spans.map(rebuild).join('')}**`;
        if (span.kind === 'code') return `\`${span.text}\``;
        if (span.kind === 'link') return `[${span.text}](${span.url})`;
        return span.text;
      })
      .join('');
    expect(rebuilt).toBe(original);
  });
});
