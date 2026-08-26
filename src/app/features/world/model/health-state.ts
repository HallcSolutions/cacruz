export interface HealthState {
  readonly hp: number;
  /** Segundos de invulnerabilidad que quedan tras un golpe. */
  readonly invulnerable: number;
}

export const MAX_HP = 3;
export const INITIAL_HEALTH: HealthState = { hp: MAX_HP, invulnerable: 0 };
