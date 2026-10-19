import { buildDeployScript } from './deploy-script';
import { Product } from './product';

const LIVE_PRODUCT: Product = {
  id: 'craftiva',
  name: 'Craftiva',
  tagline: 'ERP con IA',
  description: 'Plataforma de gestión.',
  highlights: [],
  stack: ['Angular 20'],
  logo: 'images/software/craftiva.png',
  url: 'https://appcraftiva.com',
};

const SOON_PRODUCT: Product = { ...LIVE_PRODUCT, id: 'craftdish', url: undefined };

describe('buildDeployScript', () => {
  // R63 — la secuencia completa: clone → install → build → tests → deploy
  it('scripts the full deploy sequence for the product (R63)', () => {
    const lines = buildDeployScript(LIVE_PRODUCT);
    const script = lines.join('\n');

    expect(lines[0]).toContain('git clone');
    expect(lines[0]).toContain('craftiva');
    expect(script).toContain('npm install');
    expect(script).toContain('npm run build');
    expect(script).toContain('npm test');
    expect(script).toContain('deploy');
  });

  // R63 — al final queda en línea con su dominio
  it('ends live with the public host (R63)', () => {
    const lines = buildDeployScript(LIVE_PRODUCT);
    expect(lines[lines.length - 1]).toContain('LIVE');
    expect(lines[lines.length - 1]).toContain('appcraftiva.com');
  });

  for (const [store, host] of [
    ['appStoreUrl', 'apps.apple.com'],
    ['playStoreUrl', 'play.google.com'],
  ] as const) {
    it(`ends live for an app published only through ${store} (R19)`, () => {
      const product = { ...SOON_PRODUCT, [store]: `https://${host}/app/chranta` };
      const lines = buildDeployScript(product);
      expect(lines.at(-1)).toBe(`● LIVE → ${host}`);
    });
  }

  it('prefers the website over both store destinations (R19)', () => {
    const lines = buildDeployScript({
      ...LIVE_PRODUCT,
      appStoreUrl: 'https://apps.apple.com/app/chranta',
      playStoreUrl: 'https://play.google.com/store/apps/chranta',
    });
    expect(lines.at(-1)).toBe('● LIVE → appcraftiva.com');
  });

  it('prefers App Store when there is no website and both stores exist (R19)', () => {
    const lines = buildDeployScript({
      ...SOON_PRODUCT,
      appStoreUrl: 'https://apps.apple.com/app/chranta',
      playStoreUrl: 'https://play.google.com/store/apps/chranta',
    });
    expect(lines.at(-1)).toBe('● LIVE → apps.apple.com');
  });

  // R64 — sin URL pública termina como "coming soon", nunca con enlace
  it('ends as coming soon when there is no public url (R64)', () => {
    const lines = buildDeployScript(SOON_PRODUCT);
    expect(lines[lines.length - 1]).toContain('coming soon');
    expect(lines.join('\n')).not.toContain('LIVE →');
  });
});
