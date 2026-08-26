import { AdditiveBlending, BufferGeometry, DoubleSide, Float32BufferAttribute, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, PointLight, Points, PointsMaterial, SphereGeometry } from 'three';
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
    const root = fit(placeProp(library, i % 2 ? 'Turret_Gun_Base' : 'Turret_GunDouble_Base'), { height: 1.5 });
    root.position.x = turret.position.x;
    root.position.z = turret.position.z;

    const badge = new Mesh(
      new PlaneGeometry(3.4, 0.95),
      new MeshBasicMaterial({ transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
    );
    badge.position.set(turret.position.x, 2.7, turret.position.z);

    const glow = new PointLight(PALETTE.danger, 3, 5, 2);
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
  rig.root.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) {
      return;
    }
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const standard = material as MeshStandardMaterial;
      if (standard.emissive) {
        standard.emissive.set(merged ? 0x1f8f62 : 0x000000);
        standard.emissiveIntensity = merged ? 0.3 : 0;
      }
    }
  });
}

export function buildPickups(library: AssetLibrary, spots: readonly { x: number; z: number }[]): Object3D[] {
  return spots.map((spot) => {
    const pickup = fit(placeProp(library, 'Pickup_Health'), { height: 0.8 });
    pickup.position.set(spot.x, pickup.position.y + 0.3, spot.z);
    return pickup;
  });
}

/** Reserva de balas: robots-bug del kit, rojos, que giran mientras vuelan hacia ti. */
export function buildBulletPool(library: AssetLibrary, size: number): Object3D[] {
  return Array.from({ length: size }, () => {
    /* Robot_Cube trae esqueleto: un clone() normal lo deja invisible; hay que clonar con huesos. */
    const bug = fit(placeSkinnedProp(library, 'Robot_Cube'), { size: 0.7 });
    bug.traverse((node) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) {
        return;
      }
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        const standard = (material as MeshStandardMaterial).clone();
        standard.emissive?.set(PALETTE.danger);
        standard.emissiveIntensity = 0.9;
        mesh.material = standard;
      }
    });
    bug.visible = false;
    return bug;
  });
}

/** Reserva de agentes: cerebros de IA, rosa con halo cian. */
export function buildAgentPool(size: number): Object3D[] {
  return Array.from({ length: size }, () => {
    const brain = buildBrain();
    brain.visible = false;
    return brain;
  });
}

/**
 * Un cerebro low-poly hecho en código: dos hemisferios deformados con ruido para los surcos,
 * un tallo y un halo aditivo. Ningún kit trae uno, y a este tamaño se lee perfectamente.
 */
function buildBrain(): Group {
  const brain = new Group();
  const pink = new MeshStandardMaterial({ color: 0xff7fb6, emissive: 0xff3d8f, emissiveIntensity: 0.45, roughness: 0.55, flatShading: true });

  for (const side of [-1, 1]) {
    const geometry = new IcosahedronGeometry(0.22, 2);
    const position = geometry.attributes['position'];
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      const ridge = 1 + Math.sin(x * 22 + y * 9) * Math.cos(z * 19) * 0.09;
      position.setXYZ(i, x * ridge, y * ridge, z * ridge);
    }
    geometry.computeVertexNormals();
    const hemisphere = new Mesh(geometry, pink);
    hemisphere.position.x = side * 0.19;
    hemisphere.scale.set(0.9, 0.85, 1.1);
    brain.add(hemisphere);
  }

  const stem = new Mesh(new SphereGeometry(0.09, 8, 6), new MeshStandardMaterial({ color: 0xd94f8a, roughness: 0.7 }));
  stem.position.set(0, -0.2, -0.05);
  stem.scale.set(1, 1.8, 1);
  brain.add(stem);

  const halo = new Mesh(
    new SphereGeometry(0.42, 12, 10),
    new MeshBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false }),
  );
  brain.add(halo);
  return brain;
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
