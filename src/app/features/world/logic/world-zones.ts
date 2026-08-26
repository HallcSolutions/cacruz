import { Obstacle } from '../model/obstacle';
import { Turret } from '../model/turret';
import { WorldBounds } from '../model/world-bounds';
import { WorldZone } from '../model/world-zone';
import { WORLD_RADIUS } from './terrain-height';

export const WORLD_BOUNDS: WorldBounds = { radius: WORLD_RADIUS };
export const ZONE_ENTER_MARGIN = 1.4;
/** Distancia del centro a la entrada de cada estación. */
const RING_RADIUS = 22;
/** La estación queda detrás de su entrada, alejándose del centro. */
export const STATION_SETBACK = 3;

/** Orientación de cada estación: su frente (local +z) mira a la plaza. Lo comparten escena y colisiones. */
export function zoneAngle(zone: WorldZone): number {
  return Math.atan2(zone.position.x, zone.position.z) + Math.PI;
}

interface ZoneSpec {
  readonly id: string;
  readonly labelKey: string;
  readonly route: string | null;
}

const RING: readonly ZoneSpec[] = [
  { id: 'experience', labelKey: 'world.zone.experience', route: '/experience' },
  { id: 'stack', labelKey: 'world.zone.stack', route: '/stack' },
  { id: 'projects', labelKey: 'world.zone.projects', route: '/projects' },
  { id: 'software', labelKey: 'world.zone.software', route: '/software' },
  { id: 'daily', labelKey: 'world.zone.daily', route: '/daily' },
  { id: 'value', labelKey: 'world.zone.value', route: '/for-companies' },
  { id: 'contact', labelKey: 'world.zone.contact', route: null },
];

/** La consola de cada estación es sólida, con su tamaño real; la plataforma se pisa. */
const CONSOLE_SIZE: Record<string, { halfWidth: number; halfDepth: number }> = {
  experience: { halfWidth: 2.1, halfDepth: 2.1 },
  stack: { halfWidth: 1.1, halfDepth: 1.1 },
  projects: { halfWidth: 1.3, halfDepth: 0.5 },
  software: { halfWidth: 1, halfDepth: 1 },
  daily: { halfWidth: 1.4, halfDepth: 1.1 },
  value: { halfWidth: 1.6, halfDepth: 0.9 },
  contact: { halfWidth: 0.6, halfDepth: 0.6 },
};

function consoleOf(id: string): Obstacle {
  return { center: { x: 0, z: -STATION_SETBACK - 0.6 }, footprint: CONSOLE_SIZE[id] ?? { halfWidth: 1.2, halfDepth: 0.8 } };
}

export const WORLD_ZONES: readonly WorldZone[] = [
  {
    id: 'about',
    labelKey: 'world.zone.about',
    route: null,
    position: { x: 0, z: 0 },
    footprint: { halfWidth: 1.8, halfDepth: 1.8 },
    /* El escritorio es sólido; la silla no, ahí se sienta. */
    obstacles: [{ center: { x: 0, z: -0.15 }, footprint: { halfWidth: 0.9, halfDepth: 0.45 } }],
  },
  ...RING.map((spec, slot): WorldZone => {
    const angle = (slot / RING.length) * Math.PI * 2;
    return {
      ...spec,
      position: { x: Math.sin(angle) * RING_RADIUS, z: Math.cos(angle) * RING_RADIUS },
      /* Cubre desde la entrada hasta la consola: "Entrar" sale en toda la estación, no en un punto. */
      footprint: { halfWidth: 2.8, halfDepth: 3.4 },
      obstacles: [consoleOf(spec.id)],
    };
  }),
];

/** Torretas de vigilancia entre estaciones: disparan al pasar cerca. Se esquivan o se saltan. */
export const TURRETS: readonly Turret[] = [0, 1, 2, 3, 4, 5, 6].map((slot) => {
  const angle = ((slot + 0.5) / 7) * Math.PI * 2;
  const radius = 13 + (slot % 2) * 5;
  return {
    id: `turret-${slot}`,
    position: { x: Math.sin(angle) * radius, z: Math.cos(angle) * radius },
    range: 11,
    cooldown: 1.7 + (slot % 3) * 0.3,
    phase: slot * 0.4,
  };
});

/** Botiquines del kit repartidos por la base. */
export const HEALTH_PICKUPS: readonly { x: number; z: number }[] = [
  { x: 9, z: 9 }, { x: -12, z: 6 }, { x: 4, z: -14 }, { x: -8, z: -11 }, { x: 16, z: -3 },
];
