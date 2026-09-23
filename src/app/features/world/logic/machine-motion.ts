import { ArenaState } from '../model/arena-state';
import { Turret } from '../model/turret';
import { Vector2 } from '../model/vector2';
import { isPatched } from './arena';

/** Patrulla, aproximación y desplazamiento lateral sin atravesar decorado ni otros robots. */
export function stepMachines(
  machines: readonly Turret[], arena: ArenaState, player: Vector2, elapsed: number, delta: number,
  isBlocked: (position: Vector2) => boolean = () => false,
): Turret[] {
  const occupied = machines.map(machine => machine.position);
  return machines.map((machine, index) => {
    if (delta <= 0 || isPatched(arena, machine)) return machine;
    const dx = player.x - machine.position.x;
    const dz = player.z - machine.position.z;
    const distance = Math.hypot(dx, dz);
    let vx = Math.cos(elapsed * 0.45 + index * 2) * 0.45;
    let vz = Math.sin(elapsed * 0.45 + index * 2) * 0.45;
    if (distance > 0 && distance <= machine.range) {
      const radial = distance > 6 ? 1.1 : distance < 4 ? -0.9 : 0;
      const lateral = index % 2 === 0 ? 0.65 : -0.65;
      vx = (dx * radial - dz * lateral) / distance;
      vz = (dz * radial + dx * lateral) / distance;
    }
    const position = { x: machine.position.x + vx * delta, z: machine.position.z + vz * delta };
    if (isBlocked(position) || occupied.some((other, i) => i !== index && Math.hypot(position.x - other.x, position.z - other.z) < 2.6)) return machine;
    occupied[index] = position;
    return { ...machine, position };
  });
}
