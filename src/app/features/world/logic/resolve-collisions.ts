import { Obstacle } from '../model/obstacle';
import { Vector2 } from '../model/vector2';
import { WorldZone } from '../model/world-zone';
import { toWorldSpace, toZoneSpace } from './zone-footprint';

/** Lo que ocupa el muñeco en el suelo. */
export const CHARACTER_RADIUS = 0.42;

/**
 * Empuja al muñeco fuera de las construcciones sólidas (R76).
 *
 * Resuelve contra la **huella rectangular girada** de cada zona, no contra un círculo: con un
 * radio único las construcciones anchas se atravesaban por los lados. Expulsa por el eje de
 * menor penetración, así que al rozar de lado se desliza en vez de quedarse clavado.
 */
export function resolveCollisions(position: Vector2, zones: readonly WorldZone[]): Vector2 {
  let resolved = position;

  for (const zone of zones) {
    for (const obstacle of zone.obstacles) {
      resolved = pushOut(resolved, zone, obstacle);
    }
  }
  return resolved;
}

function pushOut(position: Vector2, zone: WorldZone, obstacle: Obstacle): Vector2 {
  const local = toZoneSpace(position, zone);
  const dx = local.x - obstacle.center.x;
  const dz = local.z - obstacle.center.z;
  const limitX = obstacle.footprint.halfWidth + CHARACTER_RADIUS;
  const limitZ = obstacle.footprint.halfDepth + CHARACTER_RADIUS;

  const overlapX = limitX - Math.abs(dx);
  const overlapZ = limitZ - Math.abs(dz);
  if (overlapX <= 0 || overlapZ <= 0) {
    return position;
  }

  const pushed =
    overlapX < overlapZ
      ? { x: obstacle.center.x + signOf(dx) * limitX, z: local.z }
      : { x: local.x, z: obstacle.center.z + signOf(dz) * limitZ };

  return toWorldSpace(pushed, zone);
}

/** Justo en el centro no hay lado natural de salida: se elige uno para no dividir por cero. */
function signOf(value: number): number {
  return value < 0 ? -1 : 1;
}
