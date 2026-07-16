import { Product } from './product';

/** Cadencia con la que la consola teclea cada línea del guion. */
export const DEPLOY_LINE_TICK_MS = 300;

/**
 * Guion de despliegue que la consola teclea línea a línea (R63).
 * Los logs van en inglés, como en una terminal real; la UI alrededor es la que se traduce.
 */
export function buildDeployScript(product: Product): string[] {
  return [
    `$ git clone hallc/${product.id}.git`,
    `  Cloning into '${product.id}'... done.`,
    '$ npm install',
    '  dependencies installed ✓',
    '$ npm run build',
    '  build succeeded ✓',
    '$ npm test',
    '  all tests passed ✓',
    '$ deploy --production',
    product.url ? `● LIVE → ${hostOf(product.url)}` : '● READY — coming soon',
  ];
}

function hostOf(url: string): string {
  return new URL(url).host;
}
