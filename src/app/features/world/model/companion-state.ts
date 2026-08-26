import { Vector2 } from './vector2';

/** Un acompañante que sigue al personaje (los perros). */
export interface CompanionState {
  readonly position: Vector2;
  readonly facing: number;
  /** Velocidad actual, para elegir entre quieto, andar y correr. */
  readonly speed: number;
}
