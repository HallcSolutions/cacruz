import { Vector2 } from './vector2';

/** Un sólido redondo: árboles, rocas, muebles. */
export interface CircleObstacle {
  readonly center: Vector2;
  readonly radius: number;
}
