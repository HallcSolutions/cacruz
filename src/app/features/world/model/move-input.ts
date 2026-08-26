import { Vector2 } from './vector2';

/** Lo que el jugador pide en este instante. */
export interface MoveInput {
  readonly direction: Vector2;
  readonly jump: boolean;
}
