import { HealthState, INITIAL_HEALTH } from '../model/health-state';

/** Tras un golpe, un respiro sin poder ser alcanzado. */
export const INVULNERABLE_SECONDS = 1.4;

/** Descuenta un golpe si no está en el respiro; a cero, `respawn` es `true`. */
export function takeHit(state: HealthState): { state: HealthState; respawn: boolean } {
  if (state.invulnerable > 0) {
    return { state, respawn: false };
  }
  const hp = state.hp - 1;
  if (hp <= 0) {
    return { state: { ...INITIAL_HEALTH, invulnerable: INVULNERABLE_SECONDS }, respawn: true };
  }
  return { state: { hp, invulnerable: INVULNERABLE_SECONDS }, respawn: false };
}

export function tickHealth(state: HealthState, deltaSeconds: number): HealthState {
  return state.invulnerable <= 0 ? state : { ...state, invulnerable: Math.max(0, state.invulnerable - deltaSeconds) };
}

export function heal(state: HealthState, max: number): HealthState {
  return { ...state, hp: Math.min(max, state.hp + 1) };
}
