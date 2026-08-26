import { CircleObstacle } from '../model/circle-obstacle';
import { Vector2 } from '../model/vector2';
import { CHARACTER_RADIUS } from './resolve-collisions';

/** Empuja al personaje fuera de los sólidos redondos, deslizando por su contorno. */
export function resolveCircles(position: Vector2, circles: readonly CircleObstacle[]): Vector2 {
  let resolved = position;

  for (const circle of circles) {
    const dx = resolved.x - circle.center.x;
    const dz = resolved.z - circle.center.z;
    const distance = Math.hypot(dx, dz);
    const minimum = circle.radius + CHARACTER_RADIUS;

    if (distance >= minimum) {
      continue;
    }
    resolved =
      distance === 0
        ? { x: circle.center.x + minimum, z: circle.center.z }
        : { x: circle.center.x + (dx / distance) * minimum, z: circle.center.z + (dz / distance) * minimum };
  }
  return resolved;
}
