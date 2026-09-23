import { machineObstacles } from './machine-obstacles';
import { resolveCircles } from './resolve-circles';
import { stepCompanion } from './follow-companion';
import { createDebtEncounter } from './debt-encounter';
import { TURRETS } from './world-zones';

describe('Cuerpos fuera de las máquinas (002/R18)', () => {
  it('reserva espacio para las orugas y el libro en todos los lados de las siete máquinas', () => {
    const obstacles = machineObstacles(TURRETS);
    expect(obstacles.length).toBe(TURRETS.length);
    for (const turret of TURRETS) for (const angle of [0, 1, 2, 3, 4, 5]) {
      const point = resolveCircles({ x: turret.position.x + Math.cos(angle) * 0.3, z: turret.position.z + Math.sin(angle) * 0.3 }, obstacles);
      expect(Math.hypot(point.x - turret.position.x, point.z - turret.position.z)).toBeGreaterThanOrEqual(1.71999);
      expect(Math.hypot(point.x - turret.position.x, point.z - turret.position.z)).toBeLessThan(1.8);
    }
    expect(machineObstacles([])).toEqual([]);
  });
  it('reserva también el volumen del jefe activo y caído (002/R20)', () => {
    const boss = { ...createDebtEncounter(), position: { x: 2, z: 3 } };
    expect(machineObstacles([], boss)).toEqual([]);
    for (const phase of ['approaching', 'defeated', 'appearing'] as const) {
      const clear = resolveCircles(boss.position, machineObstacles([], { ...boss, phase }));
      const expected = phase === 'defeated' ? 4.22 : phase === 'appearing' ? 3.62 : 3.27;
      expect(Math.hypot(clear.x - 2, clear.z - 3)).toBeCloseTo(expected);
      if (phase === 'defeated') expect(clear.x - 2).toBeGreaterThan(4);
    }
  });
  it('los perros rodean una máquina para reunirse con el lector al otro lado', () => {
    let dog = { position: { x: -3, z: 0 }, facing: 0, speed: 2 };
    for (let frame = 0; frame < 600; frame++) dog = stepCompanion(dog, { x: 3, z: 0 }, 0, { distance: 0.1, angle: -0.1 }, 1 / 30, [{ center: { x: 0, z: 0 }, radius: 1.3 }]);
    expect(dog.position.x).toBeGreaterThan(2.5);
  });
  it('los perros no se quedan dentro de una máquina aunque su punto de seguimiento caiga dentro', () => {
    const obstacles = [{ center: { x: 0, z: 0 }, radius: 1.12 }];
    let dog = { position: { x: -2, z: 0 }, facing: 0, speed: 2 };
    for (let frame = 0; frame < 90; frame++) {
      dog = stepCompanion(dog, { x: 0, z: 1 }, 0, { distance: 1, angle: 0.1 }, 1 / 30, obstacles);
      expect(Math.hypot(dog.position.x, dog.position.z)).toBeGreaterThanOrEqual(1.53999);
    }
  });
});
