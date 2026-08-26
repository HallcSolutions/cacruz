import { CharacterState } from '../model/character-state';
import { WorldSurface } from '../model/world-surface';
import {
  ACCELERATION,
  FRICTION,
  GRAVITY,
  INITIAL_CHARACTER,
  JUMP_SPEED,
  MAX_SPEED,
  speedOf,
  stepCharacter,
} from './step-character';

const FLAT: WorldSurface = { heightAt: () => 0, isInside: (x, z) => Math.hypot(x, z) <= 10 };
const STILL = { x: 0, z: 0 };
const NO_JUMP = { direction: STILL, jump: false };
const TICK = 1 / 60;

function moving(velocity: { x: number; z: number }, position = STILL): CharacterState {
  return { ...INITIAL_CHARACTER, position, velocity, altitude: 0, grounded: true };
}

describe('stepCharacter — horizontal (R74, R76, R94)', () => {
  it('arranca quieto, en el suelo y dentro de la plaza', () => {
    expect(speedOf(INITIAL_CHARACTER)).toBe(0);
    expect(INITIAL_CHARACTER.grounded).toBeTrue();
    expect(Math.hypot(INITIAL_CHARACTER.position.x, INITIAL_CHARACTER.position.z)).toBeLessThan(9);
  });

  it('acelera progresivamente, no de golpe', () => {
    const first = stepCharacter(INITIAL_CHARACTER, { direction: { x: 1, z: 0 }, jump: false }, TICK, FLAT);
    expect(first.velocity.x).toBeCloseTo(ACCELERATION * TICK, 6);
    expect(first.velocity.x).toBeLessThan(MAX_SPEED);
  });

  it('nunca supera la velocidad máxima', () => {
    let state = INITIAL_CHARACTER;
    for (let i = 0; i < 600; i++) {
      state = stepCharacter(state, { direction: { x: 1, z: 1 }, jump: false }, TICK, FLAT);
      state = { ...state, position: STILL };
    }
    expect(speedOf(state)).toBeCloseTo(MAX_SPEED, 3);
  });

  it('frena progresivamente al soltar y se queda en cero, sin ir hacia atrás', () => {
    const braking = stepCharacter(moving({ x: MAX_SPEED, z: 0 }), NO_JUMP, TICK, FLAT);
    expect(braking.velocity.x).toBeCloseTo(MAX_SPEED - FRICTION * TICK, 6);

    const stopped = stepCharacter(moving({ x: 0.01, z: 0 }), NO_JUMP, 1, FLAT);
    expect(stopped.velocity).toEqual({ x: 0, z: 0 });
  });

  it('no sale del mundo: al chocar con el borde se queda dentro', () => {
    const escaping = moving({ x: MAX_SPEED, z: 0 }, { x: 9.9, z: 0 });
    const next = stepCharacter(escaping, NO_JUMP, 1, FLAT);
    expect(FLAT.isInside(next.position.x, next.position.z)).toBeTrue();
  });

  it('resbala por el borde: si un eje cae fuera, avanza por el otro', () => {
    const grazing = moving({ x: 4, z: 3 }, { x: 9.5, z: 0 });
    const next = stepCharacter(grazing, NO_JUMP, 0.2, FLAT);
    expect(next.position.z).toBeGreaterThan(0);
  });

  it('mira hacia donde camina, nunca de espaldas', () => {
    for (const direction of [{ x: 1, z: 1 }, { x: -1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: -1 }]) {
      const { facing } = stepCharacter(INITIAL_CHARACTER, { direction, jump: false }, TICK, FLAT);
      expect(Math.sin(facing) * direction.x + Math.cos(facing) * direction.z).toBeGreaterThan(0);
    }
  });
});

describe('stepCharacter — salto (R89)', () => {
  it('desde el suelo, salta con la velocidad de salto', () => {
    const jumped = stepCharacter(INITIAL_CHARACTER, { direction: STILL, jump: true }, TICK, FLAT);
    expect(jumped.grounded).toBeFalse();
    expect(jumped.verticalSpeed).toBeCloseTo(JUMP_SPEED - GRAVITY * TICK, 6);
    expect(jumped.altitude).toBeGreaterThan(0);
  });

  it('en el aire no puede volver a saltar', () => {
    const airborne = stepCharacter(INITIAL_CHARACTER, { direction: STILL, jump: true }, TICK, FLAT);
    const again = stepCharacter(airborne, { direction: STILL, jump: true }, TICK, FLAT);
    expect(again.verticalSpeed).toBeLessThan(airborne.verticalSpeed);
  });

  it('la gravedad lo devuelve al suelo y lo deja en reposo', () => {
    let state = stepCharacter(INITIAL_CHARACTER, { direction: STILL, jump: true }, TICK, FLAT);
    let ticks = 0;
    while (!state.grounded && ticks++ < 600) {
      state = stepCharacter(state, NO_JUMP, TICK, FLAT);
    }
    expect(state.grounded).toBeTrue();
    expect(state.altitude).toBe(0);
    expect(state.verticalSpeed).toBe(0);
  });

  it('al bajar una cuesta sigue pegado al suelo, sin entrar en el aire', () => {
    let slope = 3;
    const downhill: WorldSurface = { heightAt: () => slope, isInside: () => true };
    let state = { ...INITIAL_CHARACTER, altitude: 3, velocity: { x: MAX_SPEED, z: 0 } };
    for (let i = 0; i < 60; i++) {
      slope -= 0.08;
      state = stepCharacter(state, { direction: { x: 1, z: 0 }, jump: false }, TICK, downhill);
      expect(state.grounded).toBeTrue();
      expect(state.altitude).toBeCloseTo(slope, 6);
    }
  });

  it('aterriza a la altura del terreno bajo sus pies', () => {
    const hill: WorldSurface = { heightAt: () => 2.5, isInside: () => true };
    let state = stepCharacter({ ...INITIAL_CHARACTER, altitude: 2.5 }, { direction: STILL, jump: true }, TICK, hill);
    for (let i = 0; i < 600 && !state.grounded; i++) {
      state = stepCharacter(state, NO_JUMP, TICK, hill);
    }
    expect(state.altitude).toBe(2.5);
  });
});
