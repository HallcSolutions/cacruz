import { Group, MeshStandardMaterial } from 'three';
import { ModelParts } from './model-parts';
import { knowledgePage } from './knowledge-page';
import { buildThoughtBolt } from './build-thought-bolt';

/** Libro abierto con lomo, guardas doradas, cantos de papel y una hoja articulada. */
export function buildSpellbook(): Group {
  const p = new ModelParts();
  p.root.name = 'spellbook';
  const cover = new MeshStandardMaterial({ color: 0x184d62, roughness: 0.64, metalness: 0.15 });
  const gold = new MeshStandardMaterial({ color: 0xb98c48, roughness: 0.38, metalness: 0.65 });
  const paper = new MeshStandardMaterial({ color: 0xe5d8ba, roughness: 0.95 });
  const ribbon = new MeshStandardMaterial({ color: 0x26bddd, emissive: 0x1197af, emissiveIntensity: 0.7 });
  p.box(p.root, cover, [0.06, 0.085, 0.47], [0, -0.022, 0]);
  for (const side of [-1, 1]) {
    const half = p.joint(p.root, side === 1 ? 'left-pages' : 'right-pages', 0, 0, 0);
    half.rotation.z = side * 0.18;
    p.box(half, cover, [0.31, 0.035, 0.47], [side * 0.155, -0.018, 0]);
    p.box(half, paper, [0.279, 0.045, 0.427], [side * 0.152, 0.022, 0]);
    for (const edge of [-1, 1]) {
      p.box(half, gold, [0.055, 0.008, 0.06], [side * 0.279, 0.004, edge * 0.204]);
    }
    for (let line = 0; line < 3; line++) {
      p.box(half, gold, [0.279, 0.0015, 0.0015], [side * 0.152, 0.009 + line * 0.013, -0.214]);
    }
    const page = knowledgePage(0.276, 0.421);
    page.rotation.x = -Math.PI / 2;
    page.position.set(side * 0.152, 0.049, 0);
    half.add(page);
    p.joint(p.root, side === 1 ? 'left-book-grip' : 'right-book-grip', side * 0.295, 0.015, -0.047);
  }
  const leaf = p.joint(p.root, 'reading-leaf', 0, 0.056, 0);
  const page = knowledgePage(0.27, 0.42);
  page.rotation.x = -Math.PI / 2;
  page.position.x = 0.143;
  leaf.add(page);
  p.box(p.root, ribbon, [0.029, 0.006, 0.34], [0.025, 0.057, -0.155]);
  const insight = buildThoughtBolt();
  insight.name = 'book-insight';
  insight.position.set(0, 0.28, 0);
  insight.scale.setScalar(0.8);
  p.root.add(insight);
  return p.root;
}
