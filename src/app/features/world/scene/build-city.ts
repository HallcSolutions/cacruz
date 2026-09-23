import { AdditiveBlending, BufferGeometry, ConeGeometry, DoubleSide, Float32BufferAttribute, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, PointLight, Points, PointsMaterial, SphereGeometry } from 'three';
import { buildThoughtBolt } from './build-thought-bolt';
import { buildMachine } from './build-machine';
import { gitStepFor } from '../logic/git-steps';
import { labelTexture } from './make-texture';
import { DecorPlacement } from '../logic/decor-layout';
import { Turret } from '../model/turret';
import { fit } from './fit';
import { AssetLibrary, placeProp, placeSkinnedProp } from './load-assets';
import { PALETTE } from './palette';

/** Piezas verticales se ajustan por alto; las tendidas (tubos, cables) por ancho, o crecen gigantes. */
const SIZES: Record<string, { height?: number; width?: number; size?: number }> = {
  lamp: { height: 3.2 }, antenna: { height: 3.4 }, ac: { size: 1.3 },
  pipe: { size: 2.2 }, cable: { size: 2.4 }, drone: { size: 1.1 },
};

export interface DroneRig {
  readonly root: Object3D;
  readonly angle: number;
}

/** Mobiliario de la base desde el layout compartido con las colisiones. */
export function buildCity(library: AssetLibrary, layout: readonly DecorPlacement[]): { root: Group; drones: DroneRig[] } {
  const root = new Group();
  const drones: DroneRig[] = [];
  for (const placement of layout) {
    const prop = fit(placeProp(library, placement.name), SIZES[placement.kind] ?? { height: 1 });
    prop.position.x = placement.x;
    prop.position.z = placement.z;
    prop.rotation.y = placement.rotation;
    if (placement.kind === 'drone') {
      prop.position.y += 4;
      drones.push({ root: prop, angle: placement.rotation });
    }
    root.add(prop);
  }
  return { root, drones };
}

export interface TurretRig {
  readonly turret: Turret;
  readonly root: Object3D;
  /** Holograma con los bugs que le quedan. */
  readonly badge: Mesh<PlaneGeometry, MeshBasicMaterial>;
  readonly glow: PointLight;
}

export function buildTurrets(library: AssetLibrary, turrets: readonly Turret[]): TurretRig[] {
  return turrets.map((turret, i) => {
    const root = buildMachine(i);
    root.position.x = turret.position.x;
    root.position.z = turret.position.z;

    const badge = new Mesh(
      new PlaneGeometry(1.4, 0.38),
      new MeshBasicMaterial({ transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
    );
    badge.position.set(turret.position.x, 2.1, turret.position.z);

    const glow = new PointLight(PALETTE.danger, 0.35, 3, 2);
    glow.position.set(turret.position.x, 1.6, turret.position.z);

    return { turret, root, badge, glow };
  });
}

/** Repinta el holograma de una máquina según el paso de git en el que va. */
export function paintMachine(rig: TurretRig, bugs: number): void {
  const step = gitStepFor(rig.turret.id, bugs);
  const merged = bugs <= 0;
  rig.badge.material.map?.dispose();
  rig.badge.material.map = labelTexture(step.badge, { background: '#000000', color: step.color, fontSize: 80 });
  rig.badge.material.needsUpdate = true;
  rig.glow.color.set(step.color);
  const lamp = rig.root.getObjectByName('status-light') as Mesh;
  const material = lamp.material as MeshStandardMaterial;
  material.color.set(merged ? 0x99e5ad : 0xff6759);
  material.emissive.set(merged ? 0x49c97b : 0xff392c);
  material.emissiveIntensity = merged ? 0.8 : 1.6;
  const head = rig.root.getObjectByName('machine-head')!;
  head.rotation.x = merged ? 0.6 : 0;
  head.position.y = merged ? 0.62 : 0.95;
}

export function buildPickups(library: AssetLibrary, spots: readonly { x: number; z: number }[]): Object3D[] {
  return spots.map((spot) => {
    const pickup = fit(placeProp(library, 'Pickup_Health'), { height: 0.8 });
    pickup.position.set(spot.x, pickup.position.y + 0.3, spot.z);
    return pickup;
  });
}

/** Proyectiles compactos: núcleo caliente y estela fina, legibles sobre el suelo. */
export function buildBulletPool(library: AssetLibrary, size: number): Object3D[] {
  const geometry = new IcosahedronGeometry(0.085, 0);
  const material = new MeshStandardMaterial({ color: 0xffd6a0, emissive: 0xff682c, emissiveIntensity: 1.7 });
  const trailGeometry = new ConeGeometry(0.08, 0.65, 5);
  const trailMaterial = new MeshBasicMaterial({ color: 0xff6535, transparent: true, opacity: 0.48, depthWrite: false });
  return Array.from({ length: size }, () => {
    const bolt = new Group();
    bolt.add(new Mesh(geometry, material));
    const trail = new Mesh(trailGeometry, trailMaterial);
    trail.rotation.x = -Math.PI / 2;
    trail.position.z = -0.3;
    bolt.add(trail);
    bolt.visible = false;
    return bolt;
  });
}

/** Reserva visual del conocimiento del lector y el apoyo de sus compañeros. */
export function buildAgentPool(size: number): Object3D[] {
  return Array.from({ length: size }, () => buildThoughtBolt());
}

/** Estallido de "merge": partículas verdes que suben y se apagan. */
export class MergeBurst {
  readonly points: Points;
  private readonly velocities: Float32Array;
  private life = 0;

  constructor() {
    const count = 70;
    const positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.points = new Points(
      geometry,
      new PointsMaterial({ color: 0x34d399, size: 0.22, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }),
    );
    this.points.visible = false;
  }

  fire(x: number, y: number, z: number): void {
    const position = this.points.geometry.attributes['position'] as Float32BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      const angle = i * 2.399963;
      const spread = 0.3 + (i % 5) * 0.12;
      position.setXYZ(i, x, y, z);
      this.velocities[i * 3] = Math.cos(angle) * spread;
      this.velocities[i * 3 + 1] = 2.2 + (i % 7) * 0.35;
      this.velocities[i * 3 + 2] = Math.sin(angle) * spread;
    }
    position.needsUpdate = true;
    this.life = 1.3;
    this.points.visible = true;
  }

  update(delta: number): void {
    if (!this.points.visible) {
      return;
    }
    this.life -= delta;
    if (this.life <= 0) {
      this.points.visible = false;
      return;
    }
    const position = this.points.geometry.attributes['position'] as Float32BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      position.setXYZ(
        i,
        position.getX(i) + this.velocities[i * 3] * delta,
        position.getY(i) + this.velocities[i * 3 + 1] * delta,
        position.getZ(i) + this.velocities[i * 3 + 2] * delta,
      );
      this.velocities[i * 3 + 1] -= 3 * delta;
    }
    position.needsUpdate = true;
    (this.points.material as PointsMaterial).opacity = Math.min(1, this.life);
  }
}
