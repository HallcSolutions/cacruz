import { Footprint } from './footprint';
import { Obstacle } from './obstacle';
import { Vector2 } from './vector2';

/** Un lugar construido del mundo (R77). */
export interface WorldZone {
  readonly id: string;
  readonly position: Vector2;
  /** Clave de traducción del cartel (R78). */
  readonly labelKey: string;
  /** Ruta del sitio a la que lleva, o `null` si se resuelve dentro del mundo (R79, R80, R81). */
  readonly route: string | null;
  /**
   * Huella rectangular de la construcción. Antes era un radio único, y las construcciones
   * anchas —las vallas de proyectos miden 5,5 de ancho— se atravesaban por los lados.
   */
  readonly footprint: Footprint;
  /**
   * Lo sólido de la zona, en coordenadas locales. Vacío = se atraviesa (la escalera, por la
   * que se sube). La casa lleva un rectángulo por muro, y por eso se puede entrar en ella.
   */
  readonly obstacles: readonly Obstacle[];
}
