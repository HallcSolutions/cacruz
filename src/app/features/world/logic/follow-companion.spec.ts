import { stepCompanion } from './follow-companion';

describe('Seguimiento y desvío de compañeros (002/R18)', () => {
  const state = { position: { x: 2, z: -3 }, facing: 0.3, speed: 1 };
  it('acelera de forma gradual, anda o corre según distancia y no rebasa su destino', () => {
    const walking = stepCompanion(state, { x: 5, z: -1 }, 0, { distance: 1, angle: 0 }, 0.05);
    expect(walking.speed).toBeCloseTo(1.48);
    expect(walking.position.x).toBeCloseTo(2 + 3 / Math.sqrt(10) * 0.074);
    expect(walking.position.z).toBeCloseTo(-3 + 1 / Math.sqrt(10) * 0.074);
    expect(walking.facing).toBeCloseTo(Math.atan2(3, 1));
    const running = stepCompanion(state, { x: 8, z: 6 }, 0, { distance: 1, angle: 0 }, 0.05);
    expect(running.speed).toBeCloseTo(2.5);
    expect(running.position).toEqual(jasmine.objectContaining({ x: 2.075, z: -2.9 }));
    const arrived = stepCompanion(state, { x: 2.5, z: -3 }, 0, { distance: 0, angle: 0 }, 1);
    expect(arrived.position).toEqual({ x: 2.5, z: -3 });
    expect(arrived.speed).toBe(2.6);
  });
  it('coloca el objetivo detrás de un líder girado y frena al llegar sin invertir velocidad', () => {
    const result = stepCompanion(state, { x: 8, z: 6 }, Math.PI / 6, { distance: 2, angle: Math.PI / 6 }, 4);
    expect(result.position.x).toBeCloseTo(8 - Math.sqrt(3));
    expect(result.position.z).toBeCloseTo(5);
    const resting = stepCompanion(state, state.position, 0, { distance: 0, angle: 0 }, 0.05);
    expect(resting.position).toEqual(state.position);
    expect(resting.speed).toBeCloseTo(0.4);
    expect(stepCompanion(state, state.position, 0, { distance: 0, angle: 0 }, 1).speed).toBe(0);
    expect(resting.facing).toBe(0.3);
  });
  it('usa los bordes de parada y carrera sin oscilar', () => {
    const origin = { position: { x: 0, z: 0 }, facing: 0, speed: 0 };
    expect(stepCompanion(origin, { x: 0.35, z: 0 }, 0, { distance: 0, angle: 0 }, 0.1).speed).toBeCloseTo(1.56);
    expect(stepCompanion(origin, { x: 4, z: 0 }, 0, { distance: 0, angle: 0 }, 0.1).speed).toBeCloseTo(1.56);
    expect(stepCompanion(origin, { x: 4.01, z: 0 }, 0, { distance: 0, angle: 0 }, 0.1).speed).toBeCloseTo(3.6);
  });
  it('se desvía por lados opuestos al encontrar una máquina de frente', () => {
    for (const angle of [-0.1, 0, 0.1]) {
      const dog = { position: { x: 3, z: 2.28 }, facing: 0, speed: 2.6 };
      const result = stepCompanion(dog, { x: 3, z: 8 }, 0, { distance: 0, angle }, 0.1, [{ center: { x: 3, z: 4 }, radius: 1.3 }]);
      expect(result.position.z).toBeCloseTo(2.28);
      expect(Math.abs(result.position.x - 3)).toBeCloseTo(0.464);
      const rotated = stepCompanion({ ...dog, position: { x: 1.28, z: 4 } }, { x: 8, z: 4 }, 0, { distance: 0, angle }, 0.1, [{ center: { x: 3, z: 4 }, radius: 1.3 }]);
      expect(rotated.position.x).toBeCloseTo(1.28);
      expect(rotated.position.z).toBeCloseTo(4 + (angle < 0 ? -0.464 : 0.464));
      expect((result.position.x - 3) * (angle < 0 ? 1 : -1)).toBeGreaterThan(0.24);
    }
  });
  it('conserva el avance suficiente sobre el borde del umbral de desvío', () => {
    const result = stepCompanion({ position: { x: -23, z: 0 }, facing: 0, speed: 6 }, { x: 40, z: 0 }, 0, { distance: 0, angle: 0 }, 5 / 3, [{ center: { x: 0, z: 0 }, radius: 19.58 }]);
    expect(result.position).toEqual({ x: -20, z: 0 });
  });

});
