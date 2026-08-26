import { Vector2 } from '../model/vector2';

/** Segundos que tarda la cámara en alcanzar al personaje (R90). */
export const CAMERA_LAG = 0.35;

/** Suavizado exponencial independiente de los fps: persigue sin saltos y nunca sobrepasa. */
export function followCamera(
  current: Vector2,
  target: Vector2,
  deltaSeconds: number,
  lag: number = CAMERA_LAG,
): Vector2 {
  const t = lag <= 0 ? 1 : 1 - Math.exp(-deltaSeconds / lag);
  return { x: current.x + (target.x - current.x) * t, z: current.z + (target.z - current.z) * t };
}

/** Suavizado de un solo valor, para la altura de la cámara. */
export function followValue(current: number, target: number, deltaSeconds: number, lag = CAMERA_LAG): number {
  const t = lag <= 0 ? 1 : 1 - Math.exp(-deltaSeconds / lag);
  return current + (target - current) * t;
}
