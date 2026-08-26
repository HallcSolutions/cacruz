import { Agent } from '../model/agent';
import { ArenaState, BUGS_PER_MACHINE } from '../model/arena-state';
import { Bullet } from '../model/bullet';
import { Turret } from '../model/turret';
import { Vector2 } from '../model/vector2';

export const BULLET_SPEED = 7.5;
export const BULLET_TTL = 3;
export const HIT_RADIUS = 0.6;
/** Por encima de esta altura la bala pasa por debajo: se esquiva saltando. */
export const DODGE_ALTITUDE = 0.85;
export const AGENT_SPEED = 10;
/** Hasta dónde llega un comando en busca de una máquina con bugs. */
export const COMMAND_RANGE = 13;

export interface ArenaStep {
  readonly state: ArenaState;
  readonly shots: readonly Turret[];
  readonly hit: boolean;
  /** Máquinas que han recibido un parche en este instante (para el destello). */
  readonly patched: readonly string[];
}

export function bugsOf(state: ArenaState, turret: Turret): number {
  return state.bugs[turret.id] ?? BUGS_PER_MACHINE;
}

export function isPatched(state: ArenaState, turret: Turret): boolean {
  return bugsOf(state, turret) <= 0;
}

/**
 * Ejecutar un comando: lanza un agente hacia la máquina con bugs más cercana en rango.
 * Devuelve el estado sin cambios si no hay ninguna al alcance.
 */
export function runCommand(
  state: ArenaState,
  turrets: readonly Turret[],
  from: Vector2,
): { state: ArenaState; target: Turret | null } {
  let target: Turret | null = null;
  let best = COMMAND_RANGE;
  for (const turret of turrets) {
    if (isPatched(state, turret)) {
      continue;
    }
    const distance = Math.hypot(turret.position.x - from.x, turret.position.z - from.z);
    if (distance <= best) {
      best = distance;
      target = turret;
    }
  }
  if (!target) {
    return { state, target: null };
  }
  const agent: Agent = { position: { ...from }, targetId: target.id };
  return { state: { ...state, agents: [...state.agents, agent] }, target };
}

/**
 * Un instante del campo: las máquinas con bugs en rango disparan; las balas avanzan, caducan
 * o chocan con un sólido; los agentes vuelan a su máquina y le corrigen un bug al llegar.
 * Puro y determinista.
 */
export function stepArena(
  state: ArenaState,
  turrets: readonly Turret[],
  player: { position: Vector2; altitude: number },
  elapsed: number,
  deltaSeconds: number,
  isBlocked: (position: Vector2) => boolean = () => false,
): ArenaStep {
  const shots: Turret[] = [];
  const lastShot: Record<string, number> = { ...state.lastShot };
  const bullets: Bullet[] = [];
  const byId = new Map(turrets.map((turret) => [turret.id, turret]));

  for (const turret of turrets) {
    if (isPatched(state, turret)) {
      continue;
    }
    const dx = player.position.x - turret.position.x;
    const dz = player.position.z - turret.position.z;
    const distance = Math.hypot(dx, dz);
    const last = lastShot[turret.id] ?? turret.phase - turret.cooldown;
    if (distance <= turret.range && elapsed - last >= turret.cooldown) {
      lastShot[turret.id] = elapsed;
      shots.push(turret);
      bullets.push({
        position: { ...turret.position },
        velocity: { x: (dx / distance) * BULLET_SPEED, z: (dz / distance) * BULLET_SPEED },
        ttl: BULLET_TTL,
      });
    }
  }

  let hit = false;
  for (const bullet of state.bullets) {
    const ttl = bullet.ttl - deltaSeconds;
    if (ttl <= 0) {
      continue;
    }
    const position = {
      x: bullet.position.x + bullet.velocity.x * deltaSeconds,
      z: bullet.position.z + bullet.velocity.z * deltaSeconds,
    };
    if (isBlocked(position)) {
      continue;
    }
    const reach = Math.hypot(position.x - player.position.x, position.z - player.position.z);
    if (reach <= HIT_RADIUS && player.altitude < DODGE_ALTITUDE) {
      hit = true;
      continue;
    }
    bullets.push({ position, velocity: bullet.velocity, ttl });
  }

  const bugs: Record<string, number> = { ...state.bugs };
  const patched: string[] = [];
  const agents: Agent[] = [];
  for (const agent of state.agents) {
    const target = byId.get(agent.targetId);
    if (!target) {
      continue;
    }
    const dx = target.position.x - agent.position.x;
    const dz = target.position.z - agent.position.z;
    const distance = Math.hypot(dx, dz);
    const step = AGENT_SPEED * deltaSeconds;
    if (distance <= step + 0.3) {
      bugs[target.id] = Math.max(0, (bugs[target.id] ?? BUGS_PER_MACHINE) - 1);
      patched.push(target.id);
      continue;
    }
    agents.push({
      targetId: agent.targetId,
      position: { x: agent.position.x + (dx / distance) * step, z: agent.position.z + (dz / distance) * step },
    });
  }

  return { state: { bullets, agents, bugs, lastShot }, shots, hit, patched };
}
