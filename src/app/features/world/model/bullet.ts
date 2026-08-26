import { Vector2 } from './vector2';

export interface Bullet {
  readonly position: Vector2;
  readonly velocity: Vector2;
  /** Segundos de vida que le quedan. */
  readonly ttl: number;
}
