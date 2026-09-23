import { Bullet } from './bullet';
import { DebtPhase } from './debt-phase';
import { Vector2 } from './vector2';

export interface DebtEncounterState {
  readonly phase: DebtPhase;
  readonly position: Vector2;
  readonly hp: number;
  readonly aim: Vector2 | null;
  readonly projectiles: readonly Bullet[];
  readonly analyzed: boolean;
  readonly remaining: number;
  readonly cooldown: number;
  readonly correctionIn: number | null;
}
