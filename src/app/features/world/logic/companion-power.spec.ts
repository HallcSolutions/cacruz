import { launchCompanionPower } from './companion-power';
import { runCommand, stepArena } from './arena';
import { INITIAL_ARENA } from '../model/arena-state';

describe('Pulsos de compañeros (002/R12)', () => {
  const target = { id: 't', position: { x: 0, z: 0 }, range: 11, cooldown: 2, phase: 0 };
  it('conserva recargas independientes y permite disparar justo al finalizar y en el borde del alcance', () => {
    const shifted = { ...target, position: { x: 8, z: 8 } };
    const result = launchCompanionPower(INITIAL_ARENA, shifted, [{ x: 8, z: 18 }, { x: 18, z: 8 }], [1, 4], 1);
    expect(result.arena.agents.length).toBe(1);
    expect(result.readyAt).toEqual([3.4, 4]);
    const second = launchCompanionPower(INITIAL_ARENA, shifted, [{ x: 18, z: 8 }], [1], 1);
    expect(second.arena.agents.length).toBe(1);
  });
  it('dispara hacia el mismo objetivo desde cada perro en alcance y respeta su recarga', () => {
    const result = launchCompanionPower(INITIAL_ARENA, target, [{ x: 1, z: 0 }, { x: 2, z: 0 }], [0, 0], 1);
    expect(result.arena.agents.map(a => a.targetId)).toEqual(['t', 't']);
    expect(result.arena.agents.map(a => a.position.x)).toEqual([1, 2]);
    expect(result.readyAt).toEqual([3.4, 3.4]);
    expect(result.arena.bugs).toEqual({});
    const next = launchCompanionPower(result.arena, target, [{ x: 1, z: 0 }, { x: 2, z: 0 }], result.readyAt, 2);
    expect(next.arena.agents.length).toBe(2);
  });
  it('conserva el pulso de los perros distinto de las páginas del jugador durante el vuelo (002/R16)', () => {
    const launched = runCommand(INITIAL_ARENA, [target], { x: 5, z: 0 }).state;
    const supported = launchCompanionPower(launched, target, [{ x: 4, z: 0 }], [0], 1).arena;
    expect(supported.agents[0]).not.toEqual(jasmine.objectContaining({ source: 'companion' }));
    expect(supported.agents[1]).toEqual(jasmine.objectContaining({ source: 'companion' }));
    const diagonal = { ...supported, agents: [{ ...supported.agents[1], position: { x: 3, z: 4 } }] };
    const flight = stepArena(diagonal, [target], { position: { x: 7, z: 0 }, altitude: 0 }, 1, 0.07).state;
    expect(flight.agents[0].position.x).toBeCloseTo(2.58);
    expect(flight.agents[0].position.z).toBeCloseTo(3.44);
    const next = stepArena(supported, [target], { position: { x: 7, z: 0 }, altitude: 0 }, 1, 0.1).state;
    expect(next.agents[1]).toEqual(jasmine.objectContaining({ source: 'companion' }));
    expect(next.agents[1].position).toEqual({ x: 3, z: 0 });
  });
  it('no dispara desde fuera de alcance ni contra una máquina ya reparada', () => {
    expect(launchCompanionPower(INITIAL_ARENA, target, [{ x: 11, z: 0 }], [0], 1).arena.agents.length).toBe(0);
    expect(launchCompanionPower({ ...INITIAL_ARENA, bugs: { t: 0 } }, target, [{ x: 1, z: 0 }], [0], 1).arena.agents.length).toBe(0);
  });
});
