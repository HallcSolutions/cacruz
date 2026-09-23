import { Bullet } from '../model/bullet';
import { INITIAL_ARENA } from '../model/arena-state';
import { stepArena } from './arena';
import { CharacterState } from '../model/character-state';
import { DebtEncounterState } from '../model/debt-encounter-state';
import { Vector2 } from '../model/vector2';

export const DEBT_SPAWN: Vector2 = { x: 0, z: -8 };
export const DEBT_ATTACK_RADIUS = 3.4;

export function createDebtEncounter(): DebtEncounterState {
  return { phase: 'inactive', position: { ...DEBT_SPAWN }, hp: 3, aim: null, projectiles: [], analyzed: false, remaining: 0, cooldown: 0, correctionIn: null };
}

export function startDebtEncounter(state: DebtEncounterState): DebtEncounterState {
  return state.phase === 'inactive' ? { ...state, phase: 'appearing', remaining: 1.6 } : state;
}

function active(state: DebtEncounterState): boolean {
  return ['approaching', 'telegraphing', 'attacking', 'recovering'].includes(state.phase);
}

export function analyzeDebtEncounter(state: DebtEncounterState): DebtEncounterState {
  return active(state) && !state.analyzed ? { ...state, analyzed: true } : state;
}

export function refactorDebtEncounter(state: DebtEncounterState, from: Vector2): DebtEncounterState {
  if (state.phase !== 'recovering' || !state.analyzed || state.cooldown > 0 || state.correctionIn !== null || distance(from, state.position) > 9) return state;
  return { ...state, cooldown: 2.4, correctionIn: 0.45 };
}

/** Los compañeros conceden una pausa; los hallazgos siguen reservados al jugador. */
export function supportDebtEncounter(state: DebtEncounterState): DebtEncounterState {
  return state.phase === 'recovering' && state.analyzed ? { ...state, remaining: Math.min(1.8, state.remaining + 0.2) } : state;
}

export function advanceDebtEncounter(
  state: DebtEncounterState,
  player: Pick<CharacterState, 'position' | 'altitude'>,
  delta: number,
  isBlocked: (position: Vector2) => boolean = () => false,
): { state: DebtEncounterState; hit: boolean; corrected: boolean } {
  if (delta <= 0 || ['inactive', 'defeated', 'player-defeated'].includes(state.phase)) return { state, hit: false, corrected: false };
  const reach = distance(player.position, state.position);
  if (state.phase === 'appearing') {
    if (reach < DEBT_ATTACK_RADIUS) return { state, hit: false, corrected: false };
    const remaining = Math.max(0, state.remaining - delta);
    return { state: { ...state, remaining, phase: remaining === 0 ? 'approaching' : 'appearing' }, hit: false, corrected: false };
  }
  const corrected = state.correctionIn !== null && state.correctionIn <= delta;
  const hp = state.hp - (corrected ? 1 : 0);
  let next: DebtEncounterState = {
    ...state,
    hp,
    cooldown: Math.max(0, state.cooldown - delta),
    correctionIn: state.correctionIn === null || corrected ? null : state.correctionIn - delta,
    remaining: Math.max(0, state.remaining - delta),
  };
  if (hp === 0) return { state: { ...next, phase: 'defeated', remaining: 0, projectiles: [] }, hit: false, corrected };
  const flight = stepArena({ ...INITIAL_ARENA, bullets: state.projectiles }, [], player, 0, delta, isBlocked);
  next = { ...next, projectiles: flight.state.bullets };
  let hit = flight.hit;
  if (state.phase === 'approaching') {
    if (reach <= 14) {
      next = { ...next, phase: 'telegraphing', remaining: 1.05, aim: { ...player.position } };
    } else {
      const step = Math.min(1.05 * delta, reach - 14);
      const position = { x: state.position.x + (player.position.x - state.position.x) / reach * step, z: state.position.z + (player.position.z - state.position.z) / reach * step };
      if (isBlocked(position) === false) next = { ...next, position };
    }
  } else if (next.remaining === 0) {
    if (state.phase === 'telegraphing') {
      hit = hit || reach <= DEBT_ATTACK_RADIUS && player.altitude < 0.85;
      next = { ...next, phase: 'attacking', remaining: 0.28, projectiles: [...next.projectiles, ...debtVolley(state)] };
    } else if (state.phase === 'attacking') {
      next = { ...next, phase: 'recovering', remaining: 1.45 };
    } else {
      next = { ...next, phase: 'approaching', remaining: 0, cooldown: 0 };
    }
  }
  return { state: next, hit, corrected };
}

function distance(a: Vector2, b: Vector2): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

/** La puntería queda fijada al anunciar el ataque; los proyectiles nunca persiguen. */
function debtVolley(state: DebtEncounterState): Bullet[] {
  const aim = state.aim ?? state.position;
  const direction = Math.atan2(aim.x - state.position.x, aim.z - state.position.z);
  const angles = [-0.42, -0.21, 0, 0.21, 0.42].map(offset => direction + offset);
  if (state.hp === 1) for (let i = 0; i < 8; i++) angles.push(i * Math.PI / 4);
  return angles.map(angle => ({
    position: { x: state.position.x + Math.sin(angle) * 2.9, z: state.position.z + Math.cos(angle) * 2.9 },
    velocity: { x: Math.sin(angle) * 6.5, z: Math.cos(angle) * 6.5 },
    ttl: 3,
  }));
}
