import { Vector2 } from './vector2';

export interface Turret {
  readonly id: string;
  readonly position: Vector2;
  /** A esta distancia empieza a disparar. */
  readonly range: number;
  /** Segundos entre disparos. */
  readonly cooldown: number;
  /** Desfase para que no disparen todas a la vez. */
  readonly phase: number;
}
