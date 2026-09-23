import { DebtEncounterState } from '../model/debt-encounter-state';
import { CircleObstacle } from '../model/circle-obstacle';
import { Turret } from '../model/turret';

/** Incluye la huella de brazos/orugas y el margen que necesita el libro delante del lector. */
export function machineObstacles(turrets: readonly Turret[], boss?: DebtEncounterState): CircleObstacle[] {
  const circles = turrets.map(turret => ({ center: turret.position, radius: 1.3 }));
  if (boss && boss.phase !== 'inactive') circles.push({ center: boss.position, radius: boss.phase === 'defeated' ? 3.8 : boss.phase === 'appearing' ? 3.2 : 2.85 });
  return circles;
}
