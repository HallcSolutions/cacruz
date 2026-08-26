import { Vector2 } from './vector2';

/** Estado del personaje en un instante. */
export interface CharacterState {
  readonly position: Vector2;
  readonly velocity: Vector2;
  /** Altura sobre el nivel cero del mundo. En el suelo coincide con el terreno. */
  readonly altitude: number;
  /** Velocidad vertical: positiva subiendo, negativa cayendo (R89). */
  readonly verticalSpeed: number;
  readonly grounded: boolean;
  /** Radianes; 0 mira hacia +z, que es el lado donde el modelo tiene la cara. */
  readonly facing: number;
}
