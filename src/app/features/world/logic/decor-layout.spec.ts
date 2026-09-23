import { buildDecorLayout, decorObstacles } from './decor-layout';
import { DEBT_SPAWN } from './debt-encounter';
import { TURRETS, WORLD_ZONES } from './world-zones';

describe('Espacio libre del encuentro (002/R11)', () => {
  it('reserva la entrada del jefe tanto en decoración como en colisiones', () => {
    const layout = buildDecorLayout(WORLD_ZONES, TURRETS);
    for (const prop of layout.filter(prop => prop.kind !== 'drone')) {
      expect(Math.hypot(prop.x - DEBT_SPAWN.x, prop.z - DEBT_SPAWN.z)).toBeGreaterThanOrEqual(5);
    }
    for (const obstacle of decorObstacles(layout)) {
      expect(Math.hypot(obstacle.center.x - DEBT_SPAWN.x, obstacle.center.z - DEBT_SPAWN.z) - obstacle.radius).toBeGreaterThan(4);
    }
  });
});
