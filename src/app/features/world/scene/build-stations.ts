import { AdditiveBlending, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneGeometry, PointLight } from 'three';
import { WorldZone } from '../model/world-zone';
import { STATION_SETBACK, zoneAngle } from '../logic/world-zones';
import { fit } from './fit';
import { AssetLibrary, placeProp } from './load-assets';
import { labelTexture } from './make-texture';
import { PALETTE } from './palette';

export interface StationRig {
  readonly zoneId: string;
  readonly root: Group;
  readonly light: PointLight;
  readonly hologram: Mesh<PlaneGeometry, MeshBasicMaterial>;
}

/** Qué consola preside cada estación y de qué color es su holograma. */
const CONSOLES: Record<string, { prop: string; height: number; color: number }> = {
  experience: { prop: 'Turret_Teleporter', height: 1.5, color: PALETTE.amber },
  stack: { prop: 'AC_Stacked', height: 2.6, color: PALETTE.accent },
  projects: { prop: 'TV_3', height: 1.6, color: PALETTE.cyan },
  software: { prop: 'Lootbox_Base', height: 1.5, color: 0x34d399 },
  daily: { prop: 'Collectible_Board', height: 1.8, color: 0xff8a65 },
  value: { prop: 'Computer_Large', height: 2.1, color: PALETTE.magenta },
  contact: { prop: 'Antenna_2', height: 3, color: 0x64b5f6 },
};

/** Una estación por zona: plataforma (la pone el suelo), consola, farolas y holograma. */
export function buildStations(zones: readonly WorldZone[], library: AssetLibrary): StationRig[] {
  return zones
    .filter((zone) => zone.id !== 'about')
    .map((zone) => {
      const spec = CONSOLES[zone.id] ?? CONSOLES['stack'];
      const root = new Group();
      root.position.set(zone.position.x, 0, zone.position.z);
      root.rotation.y = zoneAngle(zone);

      const console = fit(placeProp(library, spec.prop), { height: spec.height });
      console.position.z = -STATION_SETBACK - 0.6;
      root.add(console);

      for (const x of [-2.6, 2.6]) {
        const lamp = fit(placeProp(library, 'Light_Street_1'), { height: 3.2 });
        lamp.position.set(x, lamp.position.y, -STATION_SETBACK + 1.2);
        root.add(lamp);
      }

      const hologram = buildHologram(zone.labelKey.replace('world.zone.', ''), spec.color);
      hologram.position.set(0, 3.4, -STATION_SETBACK - 0.6);
      root.add(hologram);

      const light = new PointLight(spec.color, 2.5, 10, 2);
      light.position.set(0, 2.6, -STATION_SETBACK);
      root.add(light);

      return { zoneId: zone.id, root, light, hologram };
    });
}

/** Texto flotante, aditivo: se lee como proyección, no como cartel. */
function buildHologram(text: string, color: number): Mesh<PlaneGeometry, MeshBasicMaterial> {
  const hex = `#${color.toString(16).padStart(6, '0')}`;
  const mesh = new Mesh(
    new PlaneGeometry(3.2, 1),
    new MeshBasicMaterial({
      map: labelTexture(text, { background: '#000000', color: hex, fontSize: 84 }),
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide,
      opacity: 0.85,
    }),
  );
  return mesh;
}

/** El puesto de trabajo de la plaza: el computador grande del kit. */
export function buildWorkstation(library: AssetLibrary): Group {
  const station = new Group();
  const desk = fit(placeProp(library, 'Computer_Large'), { height: 1.7 });
  desk.position.z = -0.9;
  station.add(desk);
  const seat = fit(placeProp(library, 'Lever_Base'), { height: 0.5 });
  station.add(seat);
  return station;
}
