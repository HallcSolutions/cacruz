import { TechCategory } from '../../core/content/tech-category';

const CONSTELLATION_SIZE = 14;

/**
 * Elige las tecnologías de la constelación del inicio: recorre las categorías
 * por rondas (una de cada una, luego la siguiente de cada una), de modo que se
 * muestre un abanico —frontend, backend, datos, IA/LLMs, DevOps— y no solo las
 * primeras de una categoría.
 */
export function pickConstellationHighlights(categories: TechCategory[]): string[] {
  const rows = categories.map((category) => category.items);
  const depth = Math.max(0, ...rows.map((row) => row.length));
  const picked: string[] = [];
  for (let column = 0; column < depth; column++) {
    for (const row of rows) {
      if (column < row.length) {
        picked.push(row[column]);
      }
    }
  }
  return picked.slice(0, CONSTELLATION_SIZE);
}
