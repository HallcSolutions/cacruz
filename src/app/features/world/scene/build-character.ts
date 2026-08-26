import { Group, Object3D } from 'three';
import { voxel } from './voxel';

/** El muñeco y las piezas que se animan al caminar (R73). */
export interface CharacterRig {
  readonly root: Group;
  readonly leftArm: Object3D;
  readonly rightArm: Object3D;
  readonly leftLeg: Object3D;
  readonly rightLeg: Object3D;
  readonly head: Object3D;
}

/**
 * Rasgos de Christian sacados de su avatar: piel trigueña, pelo oscuro muy corto, barba
 * recortada, camisa azul claro y pantalón oscuro.
 *
 * La barba va en marrón oscuro y **no** en negro: en negro se fundía con el suelo y parecía que
 * la cabeza flotaba separada del cuerpo.
 */
const SKIN = 0xcf9469;
const SKIN_SHADE = 0xb87a4e;
const HAIR = 0x241a13;
const BEARD = 0x3d2c1f;
const SHIRT = 0xc7d8f0;
const SHIRT_SHADE = 0x9fb6d6;
const TROUSERS = 0x24242e;
const SHOES = 0x121218;

/** Alturas del esqueleto, de los pies a la coronilla. */
const HIP = 0.78;
const SHOULDER = 1.5;
const NECK = 1.58;
const HEAD = 1.83;

export function buildCharacter(): CharacterRig {
  const root = new Group();

  const head = buildHead();
  head.position.y = HEAD;
  root.add(head);

  root.add(voxel({ x: 0, y: NECK, z: 0, width: 0.2, height: 0.16, depth: 0.2, color: SKIN_SHADE }));

  root.add(voxel({ x: 0, y: 1.16, z: 0, width: 0.5, height: 0.78, depth: 0.28, color: SHIRT }));
  root.add(voxel({ x: 0, y: 1.5, z: 0, width: 0.52, height: 0.14, depth: 0.3, color: SHIRT }));
  root.add(voxel({ x: -0.11, y: 1.47, z: 0.15, width: 0.12, height: 0.16, depth: 0.03, color: SHIRT_SHADE }));
  root.add(voxel({ x: 0.11, y: 1.47, z: 0.15, width: 0.12, height: 0.16, depth: 0.03, color: SHIRT_SHADE }));
  root.add(voxel({ x: 0, y: 1.16, z: 0.145, width: 0.03, height: 0.74, depth: 0.02, color: SHIRT_SHADE }));
  root.add(voxel({ x: 0, y: 0.76, z: 0, width: 0.52, height: 0.08, depth: 0.3, color: TROUSERS }));

  const leftArm = buildArm(-0.32);
  const rightArm = buildArm(0.32);
  const leftLeg = buildLeg(-0.13);
  const rightLeg = buildLeg(0.13);
  root.add(leftArm, rightArm, leftLeg, rightLeg);

  return { root, leftArm, rightArm, leftLeg, rightLeg, head };
}

function buildHead(): Group {
  const head = new Group();
  head.add(voxel({ x: 0, y: 0, z: 0, width: 0.42, height: 0.44, depth: 0.4, color: SKIN }));

  head.add(voxel({ x: 0, y: 0.21, z: 0, width: 0.44, height: 0.09, depth: 0.42, color: HAIR }));
  head.add(voxel({ x: 0, y: 0.06, z: -0.2, width: 0.42, height: 0.3, depth: 0.05, color: HAIR }));
  head.add(voxel({ x: -0.21, y: 0.08, z: -0.02, width: 0.04, height: 0.24, depth: 0.38, color: HAIR }));
  head.add(voxel({ x: 0.21, y: 0.08, z: -0.02, width: 0.04, height: 0.24, depth: 0.38, color: HAIR }));

  head.add(voxel({ x: 0, y: -0.17, z: 0.01, width: 0.4, height: 0.11, depth: 0.39, color: BEARD }));
  head.add(voxel({ x: -0.19, y: -0.05, z: 0.04, width: 0.05, height: 0.2, depth: 0.32, color: BEARD }));
  head.add(voxel({ x: 0.19, y: -0.05, z: 0.04, width: 0.05, height: 0.2, depth: 0.32, color: BEARD }));
  head.add(voxel({ x: 0, y: -0.09, z: 0.19, width: 0.14, height: 0.12, depth: 0.04, color: BEARD }));

  head.add(voxel({ x: -0.09, y: 0.02, z: 0.2, width: 0.09, height: 0.055, depth: 0.02, color: 0xf4efe9 }));
  head.add(voxel({ x: 0.09, y: 0.02, z: 0.2, width: 0.09, height: 0.055, depth: 0.02, color: 0xf4efe9 }));
  head.add(voxel({ x: -0.09, y: 0.02, z: 0.212, width: 0.04, height: 0.05, depth: 0.02, color: 0x302014 }));
  head.add(voxel({ x: 0.09, y: 0.02, z: 0.212, width: 0.04, height: 0.05, depth: 0.02, color: 0x302014 }));
  head.add(voxel({ x: -0.1, y: 0.09, z: 0.2, width: 0.12, height: 0.03, depth: 0.02, color: HAIR }));
  head.add(voxel({ x: 0.1, y: 0.09, z: 0.2, width: 0.12, height: 0.03, depth: 0.02, color: HAIR }));
  head.add(voxel({ x: 0, y: -0.03, z: 0.21, width: 0.06, height: 0.08, depth: 0.03, color: SKIN_SHADE }));

  return head;
}

function buildArm(x: number): Group {
  const pivot = new Group();
  pivot.position.set(x, SHOULDER, 0);
  pivot.add(voxel({ x: 0, y: -0.24, z: 0, width: 0.15, height: 0.48, depth: 0.18, color: SHIRT }));
  pivot.add(voxel({ x: 0, y: -0.55, z: 0, width: 0.14, height: 0.16, depth: 0.17, color: SKIN }));
  return pivot;
}

function buildLeg(x: number): Group {
  const pivot = new Group();
  pivot.position.set(x, HIP, 0);
  pivot.add(voxel({ x: 0, y: -0.36, z: 0, width: 0.2, height: 0.72, depth: 0.22, color: TROUSERS }));
  pivot.add(voxel({ x: 0, y: -0.76, z: 0.03, width: 0.21, height: 0.1, depth: 0.28, color: SHOES }));
  return pivot;
}
