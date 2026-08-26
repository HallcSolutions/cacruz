import { CircleObstacle } from '../model/circle-obstacle';
import { Vector2 } from '../model/vector2';
import { WorldZone } from '../model/world-zone';
import { toZoneSpace } from './zone-footprint';

/** `true` si el punto cae dentro de un sólido: las balas no atraviesan farolas ni consolas. */
export function blockedBySolids(
  position: Vector2,
  zones: readonly WorldZone[],
  circles: readonly CircleObstacle[],
): boolean {
  for (const circle of circles) {
    if (Math.hypot(position.x - circle.center.x, position.z - circle.center.z) <= circle.radius) {
      return true;
    }
  }
  for (const zone of zones) {
    const local = toZoneSpace(position, zone);
    for (const obstacle of zone.obstacles) {
      if (
        Math.abs(local.x - obstacle.center.x) <= obstacle.footprint.halfWidth &&
        Math.abs(local.z - obstacle.center.z) <= obstacle.footprint.halfDepth
      ) {
        return true;
      }
    }
  }
  return false;
}
