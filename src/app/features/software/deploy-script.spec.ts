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

  // R64 — sin URL pública termina como "coming soon", nunca con enlace
  it('ends as coming soon when there is no public url (R64)', () => {
    const lines = buildDeployScript(SOON_PRODUCT);
    expect(lines[lines.length - 1]).toContain('coming soon');
    expect(lines.join('\n')).not.toContain('LIVE →');
  });
});
