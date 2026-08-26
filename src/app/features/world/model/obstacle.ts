import { Footprint } from './footprint';
import { Vector2 } from './vector2';

/**
 * Un rectángulo sólido dentro de una zona, en coordenadas locales de la construcción.
 * Una zona puede tener varios: la casa son sus tres muros, no un bloque macizo — si no,
 * no se podría entrar.
 */
export interface Obstacle {
  readonly center: Vector2;
  readonly footprint: Footprint;
}
