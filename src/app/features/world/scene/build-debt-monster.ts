import { CanvasTexture, Group, Mesh, MeshStandardMaterial, OctahedronGeometry, SRGBColorSpace, TorusGeometry } from 'three';
import { ModelParts } from './model-parts';

/** R10/R15: carcasa articulada de servidores, núcleo encajado y cables de volumen real. */
export function buildDebtMonster(): Group {
  const parts = new ModelParts();
  const root = parts.root;
  root.name = 'technical-debt';
  const armor = new MeshStandardMaterial({ color: 0x434550, roughness: 0.62, metalness: 0.65 });
  const edge = new MeshStandardMaterial({ color: 0x73757e, roughness: 0.48, metalness: 0.72 });
  const dark = new MeshStandardMaterial({ color: 0x171a21, roughness: 0.78, metalness: 0.4 });
  const rubber = new MeshStandardMaterial({ color: 0x101217, roughness: 0.88, metalness: 0.05 });
  const amber = new MeshStandardMaterial({ color: 0xffb139, emissive: 0xff8c12, emissiveIntensity: 2, roughness: 0.3 });

  parts.box(root, dark, [1.3, 0.45, 0.85], [0, 1.75, 0]);
  for (const side of [-1, 1]) {
    const name = side === 1 ? 'left' : 'right';
    const hip = parts.joint(root, `${name}-hip`, side * 0.62, 1.72, 0);
    parts.cylinder(hip, edge, 0.23, 0.52, [0, -0.1, 0]).rotation.z = Math.PI / 2;
    parts.box(hip, dark, [0.48, 0.68, 0.54], [0, -0.45, -0.05]);
    const knee = parts.joint(hip, `${name}-knee`, 0, -0.79, 0.08);
    parts.box(knee, armor, [0.65, 0.73, 0.7], [0, -0.25, 0]);
    parts.box(knee, edge, [0.47, 0.25, 0.1], [0, 0.02, 0.39]);
    const foot = parts.joint(knee, `${name}-foot`, 0, -0.73, 0.24);
    parts.box(foot, dark, [0.85, 0.4, 1.25], [0, 0, 0]);
    for (let toe = 0; toe < 3; toe++) {
      parts.box(foot, armor, [0.255, 0.31, 0.73], [(toe - 1) * 0.28, 0.035, 0.29]);
    }
    parts.box(knee, dark, [0.12, 0.62, 0.1], [side * 0.23, -0.26, 0.42]);
  }

  const torso = parts.joint(root, 'torso', 0, 2.75, 0);
  parts.box(torso, dark, [1.8, 1.8, 1.25], [0, 0.05, -0.19]);
  // El hueco central permanece abierto: las placas rodean el núcleo.
  for (const side of [-1, 1]) {
    const cheek = parts.box(torso, armor, [0.54, 1.6, 0.52], [side * 0.78, 0.04, 0.53]);
    cheek.rotation.z = side * -0.16;
    for (let row = 0; row < 4; row++) {
      const plate = parts.box(torso, row % 2 ? armor : edge, [0.49, 0.3, 0.17], [side * (0.74 - row * 0.035), 0.62 - row * 0.36, 0.85]);
      plate.rotation.z = side * -0.18;
      parts.box(torso, dark, [0.055, 0.055, 0.045], [side * 0.75, 0.65 - row * 0.36, 0.96]);
    }
  }
  parts.box(torso, armor, [1.36, 0.3, 0.6], [0, 0.9, 0.41]);
  parts.box(torso, armor, [1.12, 0.32, 0.72], [0, -0.82, 0.46]);
  const core = parts.joint(torso, 'amber-core', 0, 0.05, 0.69);
  const ring = new Mesh(new TorusGeometry(0.43, 0.12, 6, 8), edge);
  core.add(ring);
  const crystal = new Mesh(new OctahedronGeometry(0.32), amber);
  crystal.rotation.z = Math.PI / 4;
  core.add(crystal);
  for (const side of [-1, 1]) parts.box(core, amber, [0.055, 0.35, 0.07], [side * 0.32, 0, 0.12]);

  const head = parts.joint(torso, 'head', 0, 1.08, 0.35);
  parts.box(head, dark, [0.58, 0.46, 0.48], [0, 0, 0]);
  parts.box(head, armor, [0.65, 0.16, 0.54], [0, 0.19, 0]);
  parts.box(head, amber, [0.32, 0.045, 0.05], [0, 0.01, 0.26]);

  for (const side of [-1, 1]) {
    const name = side === 1 ? 'left' : 'right';
    const shoulder = parts.joint(torso, `${name}-shoulder`, side * 1.18, 0.7, -0.02);
    const heavy = side === -1;
    parts.sphere(shoulder, dark, [0.4, 0.4, 0.4], [0, -0.1, 0]);
    const upper = parts.box(shoulder, armor, [0.71, 1.05, 0.76], [side * 0.19, -0.55, 0]);
    upper.rotation.z = side * 0.18;
    const elbow = parts.joint(shoulder, `${name}-elbow`, side * 0.38, -1.12, 0.04);
    parts.cylinder(elbow, edge, 0.24, 0.7, [0, 0, 0]).rotation.z = Math.PI / 2;
    const hand = parts.joint(elbow, `${name}-hand`, side * 0.17, -0.77, 0.21);
    const width = heavy ? 1.03 : 0.78;
    parts.box(hand, dark, [width, 1.15, 0.96], [0, 0, 0]);
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 2; column++) {
        parts.box(hand, row % 2 ? armor : edge, [width * 0.46, 0.32, 0.16], [(column - 0.5) * width * 0.5, 0.36 - row * 0.36, 0.51]);
        parts.box(hand, dark, [0.055, 0.055, 0.05], [(column - 0.5) * width * 0.5, 0.4 - row * 0.36, 0.61]);
      }
    }
    for (let finger = 0; finger < 3; finger++) {
      parts.box(hand, armor, [0.22, 0.33, 0.7], [(finger - 1) * 0.25, -0.59, 0.14]);
    }
    const screen = parts.joint(torso, `${name}-code-screen`, side * 1.18, 0.76, 0.52);
    screen.rotation.z = side * -0.16;
    screen.rotation.y = side * 0.12;
    parts.box(screen, edge, [1.08, 0.96, 0.18], [0, 0, 0]);
    parts.box(screen, dark, [0.96, 0.83, 0.1], [0, 0, 0.1]);
    const texture = codeTexture(heavy);
    const display = new MeshStandardMaterial({ map: texture, emissiveMap: texture, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.8 });
    parts.box(screen, display, [0.84, 0.69, 0.015], [0, 0, 0.16]);
    for (let cable = 0; cable < 4; cable++) {
      const shift = cable * 0.19;
      parts.cable(torso, rubber, [
        [side * (0.25 + shift), 0.1, -0.78],
        [side * (0.42 + shift), 1.72 - shift * 0.35, -0.82],
        [side * (1.17 + shift * 0.5), 1.5 - shift * 0.2, -0.35],
        [side * 1.36, 0.15 - shift, 0.03],
      ], 0.065);
      parts.box(torso, armor, [0.25, 0.35, 0.18], [side * (0.25 + shift), 0.16, -0.83]);
    }
    parts.cable(torso, rubber, [[side * 0.86, 0.2, 0.2], [side * 1.04, -0.9, 0.45], [side * 0.48, -1.08, 0.48], [side * 0.48, -0.5, 0.2]], 0.07);
  }
  root.updateMatrixWorld(true);
  return root;
}

function codeTexture(error: boolean): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#080b11';
    context.fillRect(0, 0, 256, 192);
    context.fillStyle = error ? '#fa6b62' : '#e9aa50';
    context.font = '22px monospace';
    const lines = error ? ['<error>', ' undefined', ' null', '</>'] : ['while(true) {', '  fix();', '  // TODO', '}'];
    lines.forEach((line, i) => context.fillText(line, 17, 35 + i * 38));
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
