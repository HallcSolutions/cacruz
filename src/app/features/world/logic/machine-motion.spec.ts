import { stepMachines } from './machine-motion';
import { INITIAL_ARENA } from '../model/arena-state';
import { Turret } from '../model/turret';

describe('Máquinas móviles (002/R20)', () => {
  const machine: Turret = { id: 'a', position: { x: 0, z: 0 }, range: 11, cooldown: 2, phase: 0 };
  it('patrulla lejos y se aproxima sin teletransportarse cuando detecta al jugador', () => {
    const far = stepMachines([machine], INITIAL_ARENA, { x: 20, z: 20 }, 1, 0.1);
    expect(Math.hypot(far[0].position.x, far[0].position.z)).toBeGreaterThan(0.01);
    const near = stepMachines([machine], INITIAL_ARENA, { x: 6, z: 8 }, 1, 0.1);
    expect(near[0].position.x).toBeGreaterThan(0);
    expect(near[0].position.z).toBeGreaterThan(0);
    expect(Math.hypot(near[0].position.x, near[0].position.z)).toBeLessThanOrEqual(0.14);
    expect(machine.position).toEqual({ x: 0, z: 0 });
  });
  it('retrocede a corta distancia, rodea al jugador y respeta sólidos', () => {
    const close = stepMachines([machine], INITIAL_ARENA, { x: 2, z: 0 }, 1, 0.1)[0];
    expect(close.position.x).toBeLessThan(0);
    const circle = stepMachines([machine], INITIAL_ARENA, { x: 5, z: 0 }, 1, 0.1)[0];
    expect(Math.abs(circle.position.z)).toBeGreaterThan(0.03);
    expect(stepMachines([machine], INITIAL_ARENA, { x: 6, z: 8 }, 1, 0.1, () => true)[0].position).toEqual(machine.position);
  });
  it('detiene máquinas reparadas y no avanza durante pausa ni se solapa con otras', () => {
    expect(stepMachines([machine], { ...INITIAL_ARENA, bugs: { a: 0 } }, { x: 7, z: 0 }, 1, 1)[0]).toBe(machine);
    expect(stepMachines([machine], INITIAL_ARENA, { x: 7, z: 0 }, 1, 0)[0]).toBe(machine);
    const other = { ...machine, id: 'b', position: { x: 2.61, z: 0 } };
    const next = stepMachines([machine, other], INITIAL_ARENA, { x: 10, z: 0 }, 1, 0.1);
    expect(Math.hypot(next[0].position.x - next[1].position.x, next[0].position.z - next[1].position.z)).toBeGreaterThanOrEqual(2.6);
  });
  it('mantiene velocidades y lados de giro también fuera del origen y en los límites de alcance', () => {
    const shifted = { ...machine, position: { x: 3, z: 7 } };
    const result = stepMachines([shifted], INITIAL_ARENA, { x: 9, z: 15 }, 1, 0.1)[0];
    expect(result.position.x).toBeCloseTo(3.014);
    expect(result.position.z).toBeCloseTo(7.127);
    for (const distance of [4, 6]) {
      const edge = stepMachines([shifted], INITIAL_ARENA, { x: 3 + distance, z: 7 }, 1, 0.1)[0];
      expect(edge.position.x).toBeCloseTo(3);
      expect(edge.position.z).toBeCloseTo(7.065);
    }
    const boundary = stepMachines([shifted], INITIAL_ARENA, { x: 14, z: 7 }, 1, 0.1)[0];
    expect(boundary.position.x).toBeCloseTo(3.11);
    const pair = stepMachines([shifted, { ...shifted, id: 'b', position: { x: 3, z: -7 } }], INITIAL_ARENA, { x: 9, z: -7 }, 1, 0.1);
    expect(pair[1].position.z).toBeCloseTo(-7.065);
    const patrol = stepMachines([shifted, { ...shifted, id: 'b', position: { x: 3, z: -7 } }], INITIAL_ARENA, { x: 50, z: 50 }, 0, 0.1);
    expect(patrol[0].position).toEqual({ x: 3.045, z: 7 });
    expect(patrol[1].position.x).toBeCloseTo(3 + Math.cos(2) * 0.045);
    expect(patrol[1].position.z).toBeCloseTo(-7 + Math.sin(2) * 0.045);
    const later = stepMachines([shifted], INITIAL_ARENA, { x: 50, z: 50 }, 2, 0.1)[0];
    expect(later.position.x).toBeCloseTo(3 + Math.cos(0.9) * 0.045);
    expect(later.position.z).toBeCloseTo(7 + Math.sin(0.9) * 0.045);
    const same = stepMachines([shifted], INITIAL_ARENA, shifted.position, 0, 0.1)[0];
    expect(same.position).toEqual({ x: 3.045, z: 7 });
  });
  it('bloquea dos cuerpos que convergen lejos del origen', () => {
    const first = { ...machine, position: { x: 4, z: 3 } };
    const next = stepMachines([first, { ...machine, id: 'b', position: { x: 6.61, z: 3.065 } }], INITIAL_ARENA, { x: 13, z: 3 }, 1, 0.1);
    expect(next[0]).toBe(first);
  });

  it('alterna el tercer robot y mantiene la patrulla desfasada en el tiempo', () => {
    const row = [0, 1, 2].map(i => ({ ...machine, id: String(i), position: { x: 0, z: i * 5 } }));
    const patrol = stepMachines(row, INITIAL_ARENA, { x: 50, z: 50 }, 2, 0.1);
    expect(patrol[1].position.x).toBeCloseTo(Math.cos(2.9) * 0.045);
    const circling = stepMachines(row, INITIAL_ARENA, { x: 5, z: 10 }, 1, 0.1);
    expect(circling[2].position.z).toBeCloseTo(10.065);
    const contact = { ...machine, id: 'obstacle', position: { x: 0.11, z: 2.665 } };
    const touching = stepMachines([machine, contact], { ...INITIAL_ARENA, bugs: { obstacle: 0 } }, { x: 10, z: 0 }, 1, 0.1);
    expect(touching[0].position.x).toBeCloseTo(0.11);
  });

});
