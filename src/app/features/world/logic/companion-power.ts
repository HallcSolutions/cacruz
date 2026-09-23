import { ArenaState } from '../model/arena-state';
import { Turret } from '../model/turret';
import { Vector2 } from '../model/vector2';
import { isPatched } from './arena';

export function launchCompanionPower(
  arena: ArenaState, target: Turret, positions: readonly Vector2[], readyAt: readonly number[], elapsed: number,
): { arena: ArenaState; readyAt: number[] } {
  const recharge = [...readyAt];
  const agents = [...arena.agents];
  if (isPatched(arena, target)) return { arena, readyAt: recharge };
  positions.forEach((position, index) => {
    if (elapsed < readyAt[index] || Math.hypot(position.x - target.position.x, position.z - target.position.z) > 10) return;
    agents.push({ position: { ...position }, targetId: target.id, source: 'companion' });
    recharge[index] = elapsed + 2.4;
  });
  return { arena: { ...arena, agents }, readyAt: recharge };
}
