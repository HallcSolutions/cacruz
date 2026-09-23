import { Vector2 } from './vector2';
import { DebtPhase } from './debt-phase';

export interface WorldCombatView {
  readonly player: Vector2;
  readonly remaining: readonly Vector2[];
  readonly patched: number;
  readonly total: number;
  readonly phase: DebtPhase;
  readonly hp: number;
  readonly analyzed: boolean;
  readonly supportReady: readonly boolean[];
  readonly message: string;
}
