import { Group, MeshStandardMaterial, Object3D } from 'three';
import { ModelParts } from './model-parts';
import { knowledgePage } from './knowledge-page';

/** Una hoja libera un núcleo y ramificaciones; los compañeros conservan su pulso. */
export function buildThoughtBolt(): Group {
  const p = new ModelParts();
  const thought = p.joint(p.root, 'thought', 0, 0, 0);
  const cyan = new MeshStandardMaterial({ color: 0xb8f4ff, emissive: 0x33b6e8, emissiveIntensity: 2.8, roughness: 0.35 });
  const amber = new MeshStandardMaterial({ color: 0xffe1aa, emissive: 0xeea23a, emissiveIntensity: 2.2, roughness: 0.45 });
  p.sphere(thought, amber, [0.082, 0.082, 0.082], [0, 0, 0.1]);
  for (let branch = 0; branch < 6; branch++) {
    const angle = branch * Math.PI / 3;
    const x = Math.cos(angle) * 0.25;
    const y = Math.sin(angle) * 0.25;
    p.cable(thought, cyan, [[0, 0, 0.1], [x * 0.5, y * 0.3, 0], [x, y, -0.1]], 0.011);
    p.sphere(thought, branch % 2 ? amber : cyan, [0.034, 0.034, 0.034], [x, y, -0.1]);
    p.cable(thought, cyan, [[x * 0.5, y * 0.3, 0], [x * 0.6 - y * 0.3, y * 0.6 + x * 0.3, -0.16]], 0.006);
  }
  const leaf = knowledgePage(0.17, 0.23);
  leaf.position.z = -0.16;
  leaf.rotation.set(-0.5, 0.3, 0.2);
  thought.add(leaf);
  const pulse = p.joint(p.root, 'pulse', 0, 0, 0);
  p.sphere(pulse, cyan, [0.085, 0.085, 0.3], [0, 0, 0]);
  p.root.visible = false;
  return p.root;
}

export function poseThoughtBolt(root: Object3D, elapsed: number, support: boolean): void {
  const thought = root.getObjectByName('thought')!;
  thought.visible = !support;
  thought.rotation.z = elapsed * 2.4;
  root.getObjectByName('pulse')!.visible = support;
}
