import { Group, MeshStandardMaterial } from 'three';
import { ModelParts } from './model-parts';
import { buildSpellbook } from './build-spellbook';

function matte(color: number): MeshStandardMaterial {
  return new MeshStandardMaterial({ color, roughness: 0.86, metalness: 0, emissiveIntensity: 0 });
}

/** R15: superficies facetadas con cintura, hombros inclinados y articulaciones anatómicas. */
export function buildDeveloper(): Group {
  const p = new ModelParts(true);
  const shirt = matte(0x528db7);
  const cuff = matte(0x70a3c5);
  const pants = matte(0x19263d);
  const skin = matte(0xc18f73);
  const hair = matte(0x151b29);
  const shoes = matte(0x27242a);
  const leather = matte(0x624639);
  const sole = matte(0xaaa69a);
  const body = p.joint(p.root, 'body', 0, 0.84, 0);
  p.profile(body, pants, [[-0.09, 0.16, 0.12], [0.06, 0.175, 0.115]]);
  p.profile(body, shirt, [
    [0.035, 0.165, 0.105], [0.13, 0.175, 0.112], [0.34, 0.205, 0.128],
    [0.44, 0.205, 0.115], [0.495, 0.175, 0.105], [0.565, 0.078, 0.07],
  ]).name = 'shirt';
  p.profile(body, leather, [[0.012, 0.173, 0.119], [0.051, 0.173, 0.119]]);
  p.box(body, sole, [0.042, 0.038, 0.013], [0, 0.032, 0.122]);
  p.box(body, cuff, [0.015, 0.4, 0.009], [0, 0.28, 0.124]);
  for (const side of [-1, 1]) {
    const collar = p.profile(body, cuff, [[0.46, 0.027, 0.006], [0.55, 0.045, 0.008]]);
    collar.position.set(side * 0.055, 0, 0.112);
    collar.rotation.z = side * 0.28;
  }
  p.profile(body, skin, [[0.535, 0.058, 0.058], [0.665, 0.06, 0.06]]);
  const head = p.joint(body, 'head', 0, 0.78, 0.012);
  p.profile(head, skin, [
    [-0.155, 0.08, 0.077, 0.018], [-0.095, 0.116, 0.105, 0.008],
    [0.065, 0.126, 0.113], [0.135, 0.1, 0.095, -0.008],
  ]).name = 'face';
  p.profile(head, hair, [[0.067, 0.133, 0.119, -0.01], [0.155, 0.134, 0.12, -0.016], [0.199, 0.105, 0.098, -0.023]]).name = 'hair';
  p.profile(head, hair, [[-0.055, 0.112, 0.024, -0.104], [0.11, 0.129, 0.035, -0.091]]);
  p.profile(head, hair, [[0.01, 0.048, 0.012], [0.12, 0.074, 0.014]]).position.set(-0.066, 0, 0.101);
  p.profile(head, skin, [[-0.05, 0.026, 0.012, 0.123], [0.019, 0.019, 0.024, 0.118]]);
  p.profile(head, hair, [[-0.151, 0.08, 0.012, 0.073], [-0.115, 0.094, 0.011, 0.097]]);
  for (const side of [-1, 1]) {
    p.sphere(head, skin, [0.023, 0.04, 0.025], [side * 0.126, -0.03, 0]);
    p.box(head, hair, [0.026, 0.012, 0.008], [side * 0.059, 0.016, 0.115]);
    p.box(head, hair, [0.019, 0.04, 0.025], [side * 0.117, 0.007, 0.03]);
    const name = side === 1 ? 'left' : 'right';
    const arm = p.joint(body, `${name}-arm`, side * 0.217, 0.438, 0);
    p.profile(arm, shirt, [[-0.185, 0.06, 0.065], [-0.08, 0.066, 0.071], [0.016, 0.056, 0.06]]);
    p.profile(arm, cuff, [[-0.193, 0.062, 0.067], [-0.161, 0.063, 0.068]]);
    p.profile(arm, skin, [[-0.302, 0.047, 0.049], [-0.17, 0.059, 0.062]]);
    const elbow = p.joint(arm, `${name}-elbow`, 0, -0.292, 0);
    p.profile(elbow, skin, [[-0.257, 0.036, 0.037], [-0.13, 0.047, 0.051], [0.008, 0.05, 0.05]]);
    const hand = p.joint(elbow, `${name}-hand`, 0, -0.27, 0);
    p.box(hand, skin, [0.077, 0.028, 0.091], [0, -0.011, 0.021]);
    // La palma sostiene el canto por debajo, con dedos separados y pulgar sobre la tapa.
    for (let finger = 0; finger < 4; finger++) {
      const digit = p.joint(hand, `finger-${finger}`, (finger - 1.5) * 0.018, -0.006, 0.072);
      p.box(digit, skin, [0.016, 0.022, 0.045], [0, 0, 0.004]);
      p.box(digit, skin, [0.016, 0.026, 0.018], [0, 0.012, 0.021]);
    }
    const thumb = p.joint(hand, 'finger-thumb', -side * 0.044, 0.026, 0.031);
    p.box(thumb, skin, [0.026, 0.022, 0.06], [0, 0, 0.01]).rotation.y = side * 0.35;
    const leg = p.joint(body, `${name}-leg`, side * 0.098, -0.05, 0);
    p.profile(leg, pants, [[-0.397, 0.065, 0.07], [-0.19, 0.078, 0.083], [0.035, 0.099, 0.11]]);
    const knee = p.joint(leg, `${name}-knee`, 0, -0.39, 0);
    p.profile(knee, pants, [[-0.383, 0.05, 0.051], [-0.14, 0.065, 0.065], [0.012, 0.067, 0.071]]);
    const foot = p.joint(knee, `${name}-foot`, 0, -0.39, 0);
    p.profile(foot, sole, [[-0.06, 0.075, 0.14, 0.055], [-0.043, 0.078, 0.143, 0.055]]);
    p.profile(foot, leather, [[-0.043, 0.078, 0.143, 0.055], [-0.027, 0.077, 0.14, 0.055]]);
    p.profile(foot, shoes, [[-0.027, 0.077, 0.14, 0.055], [0.02, 0.07, 0.129, 0.052], [0.068, 0.054, 0.062, -0.008]]);
  }
  const book = buildSpellbook();
  book.position.set(0, 0.245, 0.425);
  book.scale.set(0.92, 1, 0.82);
  body.add(book);
  return p.root;
}

/** R15: lomo plano, vientre recogido y articulaciones de las cuatro patas. */
export function buildCompanion(index: number): Group {
  const p = new ModelParts(true);
  const fur = matte(index === 0 ? 0xac743e : 0xc7bba8);
  const lightFur = matte(index === 0 ? 0xd4a263 : 0xeee2cf);
  const dark = matte(0x232329);
  const earInner = matte(index === 0 ? 0x775238 : 0x998b83);
  const body = p.joint(p.root, 'dog-body', 0, 0.335, 0);
  const trunk = p.profile(body, fur, [[-0.31, 0.088, 0.096, -0.033], [-0.22, 0.127, 0.13], [0.15, 0.135, 0.145], [0.265, 0.105, 0.133, 0.005]]);
  trunk.rotation.x = Math.PI / 2;
  trunk.name = 'fur';
  const neck = p.joint(body, 'dog-neck', 0, 0.055, 0.205);
  p.profile(neck, fur, [[-0.055, 0.106, 0.107], [0.17, 0.086, 0.079, 0.063], [0.245, 0.075, 0.068, 0.08]]);
  const cyan = new MeshStandardMaterial({ color: 0xa0efff, emissive: 0x29bdf3, emissiveIntensity: 1.7, roughness: 0.5 });
  p.profile(neck, cyan, [[0.103, 0.095, 0.09, 0.045], [0.133, 0.092, 0.087, 0.053]]).name = 'collar';
  const head = p.joint(neck, 'dog-head', 0, 0.232, 0.075);
  p.profile(head, fur, [[-0.075, 0.073, 0.073, 0.028], [0.035, 0.097, 0.096], [0.085, 0.083, 0.072, -0.012]]);
  const muzzle = p.profile(head, lightFur, [[0.065, 0.067, 0.058], [0.169, 0.048, 0.038]]);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.y = -0.037;
  p.sphere(head, dark, [0.036, 0.025, 0.025], [0, -0.025, 0.18]);
  for (const side of [-1, 1]) {
    const ear = p.joint(head, `${side === 1 ? 'left' : 'right'}-ear`, side * 0.065, 0.051, -0.016);
    p.profile(ear, fur, [[0, 0.044, 0.028], [0.07, 0.035, 0.021, -0.005, side * 0.014], [0.14, 0.006, 0.006, -0.024, side * 0.026]]);
    p.profile(ear, earInner, [[0.018, 0.025, 0.003, 0.025], [0.13, 0.003, 0.003, -0.003, side * 0.02]]);
    p.sphere(head, dark, [0.014, 0.017, 0.013], [side * 0.079, 0.027, 0.078]);
    for (const front of [true, false]) {
      const leg = p.joint(body, `${front ? 'front' : 'back'}-${side === 1 ? 'left' : 'right'}`, side * 0.104, -0.071, front ? 0.196 : -0.215);
      p.profile(leg, fur, front
        ? [[-0.224, 0.027, 0.029], [-0.091, 0.035, 0.034], [0.07, 0.046, 0.064]]
        : [[-0.222, 0.027, 0.029], [-0.116, 0.038, 0.034, -0.034], [-0.022, 0.067, 0.073, 0.016], [0.07, 0.058, 0.07]]);
      p.profile(leg, lightFur, [[-0.264, 0.042, 0.061, 0.023], [-0.223, 0.039, 0.054, 0.026]]);
    }
  }
  const tail = p.joint(body, 'tail', 0, 0.07, -0.27);
  tail.rotation.x = -1.65;
  p.profile(tail, fur, [[0, 0.029, 0.029], [0.14, 0.024, 0.024], [0.245, 0.012, 0.012]]);
  p.root.scale.setScalar(index === 0 ? 1 : 0.79);
  return p.root;
}
