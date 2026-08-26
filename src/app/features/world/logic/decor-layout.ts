import { CircleObstacle } from '../model/circle-obstacle';
import { Turret } from '../model/turret';
import { WorldZone } from '../model/world-zone';
import { WORLD_RADIUS } from './terrain-height';

export type DecorKind = 'lamp' | 'antenna' | 'ac' | 'pipe' | 'cable' | 'drone';

export interface DecorPlacement {
  readonly name: string;
  readonly kind: DecorKind;
  readonly x: number;
  readonly z: number;
  readonly rotation: number;
}

const POOL: Array<{ kind: DecorKind; names: string[] }> = [
  { kind: 'lamp', names: ['Light_Street_1', 'Light_Street_2'] },
  { kind: 'antenna', names: ['Antenna_1', 'Antenna_2'] },
  { kind: 'ac', names: ['AC', 'AC_Side', 'AC_Stacked'] },
  { kind: 'pipe', names: ['Pipe_1', 'Support_Short'] },
  { kind: 'cable', names: ['Cable_Long', 'Cable_Small'] },
];

const COUNT = 120;
const PLAZA_CLEAR = 7.5;
const ZONE_CLEAR = 6.5;
const TURRET_CLEAR = 3;

/** Mobiliario de la base: farolas, antenas, aires, tubos. Determinista, sin `Math.random`. */
export function buildDecorLayout(zones: readonly WorldZone[], turrets: readonly Turret[]): DecorPlacement[] {
  const placements: DecorPlacement[] = [];
  for (let i = 0; i < COUNT; i++) {
    const angle = i * 2.399963;
    const distance = Math.sqrt((i + 0.5) / COUNT) * (WORLD_RADIUS - 2);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    if (distance < PLAZA_CLEAR || near(x, z, zones.map((zone) => zone.position), ZONE_CLEAR) || near(x, z, turrets.map((t) => t.position), TURRET_CLEAR)) {
      continue;
    }
    const group = POOL[i % POOL.length];
    placements.push({ kind: group.kind, name: group.names[i % group.names.length], x, z, rotation: i * 1.3 });
  }
  /* Drones patrullando en círculo, arriba. */
  for (let d = 0; d < 6; d++) {
    const angle = (d / 6) * Math.PI * 2;
    placements.push({ kind: 'drone', name: d % 2 ? 'Drone' : 'Drone_2', x: Math.cos(angle) * 17, z: Math.sin(angle) * 17, rotation: angle });
  }
  return placements;
}

/** Farolas, antenas, aires y tubos son sólidos; cables y drones no. */
export function decorObstacles(layout: readonly DecorPlacement[]): CircleObstacle[] {
  const radius: Partial<Record<DecorKind, number>> = { lamp: 0.28, antenna: 0.35, ac: 0.6, pipe: 0.4 };
  return layout
    .filter((p) => radius[p.kind] !== undefined)
    .map((p) => ({ center: { x: p.x, z: p.z }, radius: radius[p.kind] as number }));
}

function near(x: number, z: number, points: readonly { x: number; z: number }[], reach: number): boolean {
  return points.some((p) => Math.hypot(p.x - x, p.z - z) < reach);
}
