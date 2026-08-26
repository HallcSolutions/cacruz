import { Vector2 } from '../model/vector2';

const FORWARD = ['w', 'arrowup'];
const BACKWARD = ['s', 'arrowdown'];
const LEFT = ['a', 'arrowleft'];
const RIGHT = ['d', 'arrowright'];
export const JUMP_KEYS = [' ', 'space'];
export const RECENTER_KEYS = ['c'];
export const COMMAND_KEYS = ['f'];
/** Entrar a la zona en la que estás parado. */
export const ENTER_KEYS = ['enter', 'e'];

export const MOVEMENT_KEYS = new Set([...FORWARD, ...BACKWARD, ...LEFT, ...RIGHT, ...JUMP_KEYS, ...RECENTER_KEYS, ...COMMAND_KEYS, ...ENTER_KEYS]);

/** Teclas pulsadas → dirección de avance (R74). Las teclas opuestas se anulan. */
export function directionFromKeys(keys: ReadonlySet<string>): Vector2 {
  return { x: axis(keys, RIGHT, LEFT), z: axis(keys, BACKWARD, FORWARD) };
}

/** Arrastre táctil desde el origen → dirección, con zona muerta (R87). */
export function directionFromDrag(dx: number, dy: number, maxRadius: number): Vector2 {
  const distance = Math.hypot(dx, dy);
  if (distance < maxRadius * 0.18) {
    return { x: 0, z: 0 };
  }
  const clamped = Math.min(distance, maxRadius) / maxRadius;
  return { x: (dx / distance) * clamped, z: (dy / distance) * clamped };
}

function axis(keys: ReadonlySet<string>, positive: string[], negative: string[]): number {
  return (held(keys, positive) ? 1 : 0) - (held(keys, negative) ? 1 : 0);
}

function held(keys: ReadonlySet<string>, candidates: string[]): boolean {
  return candidates.some((key) => keys.has(key));
}
