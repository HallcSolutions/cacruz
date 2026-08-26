import { CompanionState } from '../model/companion-state';
import { Vector2 } from '../model/vector2';

export const COMPANION_WALK = 2.6;
export const COMPANION_RUN = 6;

/**
 * El acompañante busca un punto detrás del personaje (a `slot` de distancia y ángulo).
 * De lejos corre, de cerca anda, y en su sitio se para: así nunca se pega al personaje ni se
 * queda atrás. Lógica pura, sin three.js.
 */
export function stepCompanion(
  state: CompanionState,
  leader: Vector2,
  leaderFacing: number,
  slot: { distance: number; angle: number },
  deltaSeconds: number,
): CompanionState {
  const goal = {
    x: leader.x - Math.sin(leaderFacing + slot.angle) * slot.distance,
    z: leader.z - Math.cos(leaderFacing + slot.angle) * slot.distance,
  };
  const dx = goal.x - state.position.x;
  const dz = goal.z - state.position.z;
  const distance = Math.hypot(dx, dz);

  if (distance < 0.35) {
    return { ...state, speed: Math.max(0, state.speed - 12 * deltaSeconds) };
  }

  const wanted = distance > 4 ? COMPANION_RUN : COMPANION_WALK;
  const speed = state.speed + (wanted - state.speed) * Math.min(1, deltaSeconds * 6);
  const step = Math.min(distance, speed * deltaSeconds);

  return {
    position: { x: state.position.x + (dx / distance) * step, z: state.position.z + (dz / distance) * step },
    facing: Math.atan2(dx, dz),
    speed,
  };
}
