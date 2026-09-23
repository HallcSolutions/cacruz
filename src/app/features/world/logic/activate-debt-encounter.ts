import { ArenaState } from '../model/arena-state';
import { DebtPhase } from '../model/debt-phase';
import { Turret } from '../model/turret';
import { isPatched } from './arena';

/** R2: desbloquea una sola aparición al completar todas las máquinas de la arena. */
export function activateDebtEncounter(
  phase: DebtPhase,
  arena: ArenaState,
  turrets: readonly Turret[],
): DebtPhase {
  if (phase !== 'inactive' || turrets.length === 0) {
    return phase;
  }

  return turrets.every((turret) => isPatched(arena, turret)) ? 'appearing' : phase;
}
