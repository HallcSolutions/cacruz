import { Agent } from './agent';
import { Bullet } from './bullet';

/** Lo que pasa en el campo en un instante. */
export interface ArenaState {
  readonly bullets: readonly Bullet[];
  readonly agents: readonly Agent[];
  /** Bugs que le quedan a cada máquina; a cero queda parcheada y deja de disparar. */
  readonly bugs: Readonly<Record<string, number>>;
  /** Último instante de disparo por máquina. */
  readonly lastShot: Readonly<Record<string, number>>;
}

export const BUGS_PER_MACHINE = 3;
export const INITIAL_ARENA: ArenaState = { bullets: [], agents: [], bugs: {}, lastShot: {} };
