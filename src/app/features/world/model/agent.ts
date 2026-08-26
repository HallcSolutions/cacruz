import { Vector2 } from './vector2';

/** Un agente de IA lanzado por un comando: viaja hasta una máquina y le corrige un bug. */
export interface Agent {
  readonly position: Vector2;
  readonly targetId: string;
}
