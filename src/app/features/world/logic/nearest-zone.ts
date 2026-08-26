import { Vector2 } from '../model/vector2';
import { WorldZone } from '../model/world-zone';
import { distanceToFootprint } from './zone-footprint';
import { ZONE_ENTER_MARGIN } from './world-zones';

/**
 * Zona en la que está parado el muñeco, o `null` si está en campo abierto (R78).
 * Se mide contra la huella, no contra el centro: si no, en las construcciones largas
 * podías estar pegado a ellas sin que el cartel apareciera.
 */
export function nearestZone(
  position: Vector2,
  zones: readonly WorldZone[],
  margin: number = ZONE_ENTER_MARGIN,
): WorldZone | null {
  let closest: WorldZone | null = null;
  let best = margin;

  for (const zone of zones) {
    const distance = distanceToFootprint(position, zone);
    if (distance <= best) {
      best = distance;
      closest = zone;
    }
  }
  return closest;
}
