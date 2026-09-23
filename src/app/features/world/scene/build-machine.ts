import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { ModelParts } from './model-parts';
import { labelTexture } from './make-texture';

/** R19: tres familias pequeñas del jefe, con masa, extremidades y núcleos reparables. */
export function buildMachine(variant = 0): Group {
  const p = new ModelParts();
  const family = variant % 3;
  const armor = new MeshStandardMaterial({ color: [0x3d4858, 0x494454, 0x434d49][family], roughness: 0.56, metalness: 0.64 });
  const edge = new MeshStandardMaterial({ color: 0x8b929e, roughness: 0.4, metalness: 0.72 });
  const dark = new MeshStandardMaterial({ color: 0x141820, roughness: 0.75, metalness: 0.2 });
  const light = new MeshStandardMaterial({ color: 0xffa27c, emissive: 0xff4939, emissiveIntensity: 1.3 });
  const accent = new MeshStandardMaterial({ color: [0x9a7052, 0x8a709d, 0x788977][family], roughness: 0.52, metalness: 0.5 });
  if (family === 1) {
    for (let i = 0; i < 4; i++) {
      const side = i % 2 ? 1 : -1;
      const front = i < 2 ? 1 : -1;
      const leg = p.joint(p.root, `spider-leg-${i}`, side * 0.28, 0.55, front * 0.18);
      p.cable(leg, edge, [[0, 0, 0], [side * 0.38, -0.12, front * 0.18], [side * 0.52, -0.46, front * 0.28]], 0.055);
      p.box(leg, armor, [0.27, 0.19, 0.23], [side * 0.32, -0.11, front * 0.16]).rotation.z = side * -0.3;
      p.box(leg, dark, [0.22, 0.1, 0.27], [side * 0.52, -0.49, front * 0.28]);
    }
  } else {
    for (const side of [-1, 1]) {
      const leg = p.joint(p.root, `machine-leg-${side === -1 ? 0 : 1}`, side * 0.26, 0.56, 0);
      p.cylinder(leg, dark, 0.105, 0.52, [-side * 0.03, -0.2, 0]);
      p.box(leg, armor, [0.25, 0.35, 0.29], [0, -0.26, 0.015]).rotation.z = side * 0.1;
      p.box(leg, edge, [0.21, 0.1, 0.12], [side * 0.005, -0.21, 0.19]);
      p.box(leg, dark, [0.33, 0.15, 0.47], [side * 0.025, -0.47, 0.1]);
      p.box(leg, armor, [0.32, 0.07, 0.28], [side * 0.025, -0.39, 0.18]);
    }
  }
  const torso = p.joint(p.root, 'machine-head', 0, 0.95, 0);
  p.profile(torso, dark, [[-0.45, 0.23, 0.2], [0.21, 0.32, 0.23]]);
  p.profile(torso, armor, [[-0.3, 0.26, 0.23], [0.24, 0.38, 0.27], [0.32, 0.29, 0.23]]);
  const frame = p.cylinder(torso, accent, 0.165, 0.08, [0, 0.005, 0.278]);
  frame.rotation.x = Math.PI / 2;
  const core = p.cylinder(torso, light, 0.108, 0.088, [0, 0.005, 0.29]);
  core.rotation.x = Math.PI / 2;
  core.name = 'status-light';
  for (const side of [-1, 1]) {
    const chest = p.box(torso, edge, [0.15, 0.22, 0.06], [side * 0.19, 0.14, 0.265]);
    chest.rotation.z = side * -0.2;
    p.box(torso, armor, [0.16, 0.23, 0.08], [side * 0.16, -0.2, 0.26]).rotation.z = side * 0.2;
    p.cable(torso, dark, [[side * 0.2, 0.26, -0.2], [side * 0.39, 0.43, -0.32], [side * 0.46, -0.26, -0.22], [side * 0.2, -0.42, -0.1]], 0.043);
    const shoulder = p.joint(torso, side === 1 ? 'left-arm' : 'right-arm', side * 0.46, 0.18, 0);
    p.box(shoulder, armor, [0.33, 0.21, 0.37], [0, 0.055, 0]).rotation.z = side * 0.2;
    p.cylinder(shoulder, dark, 0.065, 0.34, [0, -0.2, 0]);
    p.box(shoulder, edge, [0.23, 0.29, 0.25], [side * 0.02, -0.15, 0.025]).rotation.z = side * -0.12;
    const hand = p.joint(shoulder, family === 0 && side === -1 ? 'heavy-fist' : family === 2 && side === 1 ? 'shield-arm' : 'claw-arm', side * 0.055, -0.43, 0.11);
    if (family === 0 && side === -1) {
      p.box(hand, armor, [0.39, 0.43, 0.37], [0, -0.035, 0]);
      p.box(hand, accent, [0.4, 0.085, 0.39], [0, 0.13, 0]);
      for (let finger = 0; finger < 3; finger++) p.box(hand, dark, [0.1, 0.14, 0.16], [(finger - 1) * 0.12, -0.16, 0.16]);
    } else if (family === 2 && side === 1) {
      p.box(hand, armor, [0.35, 0.56, 0.2], [0.025, 0, 0.08]);
      p.box(hand, edge, [0.26, 0.46, 0.035], [0.025, 0, 0.196]);
      p.box(hand, accent, [0.075, 0.41, 0.04], [0.025, 0, 0.22]);
    } else {
      p.box(hand, armor, [0.23, 0.25, 0.26], [0, 0, 0]);
      for (const claw of [-1, 1]) p.box(hand, edge, [0.054, 0.22, 0.065], [claw * 0.08, -0.17, 0.09]).rotation.z = claw * 0.16;
    }
  }
  p.box(torso, dark, [0.26, 0.17, 0.22], [0, 0.36, 0]);
  p.profile(torso, armor, [[0.36, 0.2, 0.17], [0.58, 0.22, 0.18], [0.63, 0.16, 0.13]]);
  const screen = new Mesh(new PlaneGeometry(0.34, 0.13), new MeshStandardMaterial({ map: labelTexture(family === 0 ? '{ }' : family === 1 ? '≠' : '</>', { background: '#0d111b', color: '#ff8467', fontSize: 110 }), roughness: 0.5, emissive: 0x552119, emissiveIntensity: 0.3 }));
  screen.position.set(0, 0.5, 0.184);
  torso.add(screen);
  for (const side of [-1, 1]) p.box(torso, accent, [0.055, family === 1 ? 0.23 : 0.12, 0.08], [side * 0.16, 0.68, -0.045]).rotation.z = side * -0.28;
  return p.root;
}
