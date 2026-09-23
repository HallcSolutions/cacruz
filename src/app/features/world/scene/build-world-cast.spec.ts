import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { buildDeveloper, buildCompanion } from './build-world-cast';
import { poseDeveloper, poseCompanion } from './pose-world-cast';
import { disposeModel } from './dispose-model';

describe('Personajes jugables de la referencia (002/R9/R15)', () => {
  it('sostiene un libro abierto con ambas manos y lo conserva en movimiento (002/R16)', () => {
    const root = buildDeveloper();
    const book = root.getObjectByName('spellbook');
    expect(book).toBeDefined();
    expect(root.getObjectByName('refactor-tool')).toBeUndefined();
    expect(root.getObjectByName('left-pages')).toBeDefined();
    expect(root.getObjectByName('right-pages')).toBeDefined();
    expect(root.getObjectByName('reading-leaf')).toBeDefined();
    for (const [speed, grounded, seated] of [[0, true, false], [4, true, false], [0, false, false], [0, true, true]] as const) {
      poseDeveloper(root, 0.2, speed, grounded, seated);
      root.updateMatrixWorld(true);
      for (const side of ['left', 'right']) {
        const hand = root.getObjectByName(`${side}-hand`)!;
        const edge = root.getObjectByName(`${side}-book-grip`);
        expect(edge).toBeDefined();
        if (edge) expect(hand.getWorldPosition(new Vector3()).distanceTo(edge.getWorldPosition(new Vector3()))).toBeLessThan(0.085);
      }
    }
    disposeModel(root);
  });
  it('apoya los pies fuera de las caderas y escalonados en reposo de combate (002/R15)', () => {
    const root = buildDeveloper();
    poseDeveloper(root, 0, 0, true, false);
    root.updateMatrixWorld(true);
    const feet = ['left', 'right'].map(side => {
      const foot = root.getObjectByName(`${side}-foot`);
      expect(foot).withContext(`${side}: apoyo identificable`).toBeDefined();
      return new Box3().setFromObject(foot ?? root).getCenter(new Vector3());
    });
    expect(root.getObjectByName('right-knee')!.rotation.x).toBeGreaterThan(root.getObjectByName('left-knee')!.rotation.x + 0.2);
    expect(feet[0].x).toBeGreaterThan(0.22);
    expect(feet[1].x).toBeLessThan(-0.22);
    expect(feet[1].z - feet[0].z).toBeGreaterThan(0.25);
    for (const side of ['left', 'right']) {
      const bounds = new Box3().setFromObject(root.getObjectByName(`${side}-foot`) ?? root);
      expect(bounds.min.y).toBeGreaterThanOrEqual(-0.015);
      expect(bounds.min.y).toBeLessThan(0.035);
    }
    disposeModel(root);
  });

  it('lee y mueve la hoja al lanzar, volviendo a reposo sin alterar la raíz (002/R16)', () => {
    const root = buildDeveloper();
    root.position.set(4, 0, -3);
    const leaf = root.getObjectByName('reading-leaf');
    expect(leaf).toBeDefined();
    poseDeveloper(root, 0, 0, true, false, 0);
    const resting = leaf?.rotation.z;
    const insight = root.getObjectByName('book-insight')!;
    expect(insight.visible).toBeFalse();
    poseDeveloper(root, 0.25, 0, true, false, 0.75);
    expect(leaf?.rotation.z).not.toBe(resting);
    expect(root.getObjectByName('head')!.rotation.x).toBeGreaterThan(0.15);
    expect(root.getObjectByName('head')!.rotation.x).toBeLessThan(0.5);
    expect(insight.visible).toBeTrue();
    expect(insight.getObjectByName('thought')!.visible).toBeTrue();
    expect(insight.getObjectByName('pulse')!.visible).toBeFalse();
    poseDeveloper(root, 0.4, 0, true, false, 0.5);
    root.updateMatrixWorld(true);
    const paperCenter = leaf!.children[0].getWorldPosition(new Vector3());
    expect(paperCenter.x - root.position.x).toBeLessThan(-0.1);
    poseDeveloper(root, 0.4, 0, true, false, 0.25);
    root.updateMatrixWorld(true);
    expect(leaf!.children[0].getWorldPosition(new Vector3()).y - leaf!.getWorldPosition(new Vector3()).y).toBeGreaterThan(0.09);
    poseDeveloper(root, 2, 0, true, false, 0);
    expect(leaf?.rotation.z).toBe(resting);
    expect(insight.visible).toBeFalse();
    expect(root.position.toArray()).toEqual([4, 0, -3]);
    disposeModel(root);
  });

  it('muestra al desarrollador de cuerpo completo, con ropa y pelo no emisivos', () => {
    const root = buildDeveloper();
    const height = new Box3().setFromObject(root).getSize(new Vector3()).y;
    expect(height).toBeGreaterThan(1.7);
    expect(height).toBeLessThan(1.95);
    for (const name of ['shirt', 'hair', 'face']) {
      const material = (root.getObjectByName(name) as Mesh).material as MeshStandardMaterial;
      expect(material.emissiveIntensity).toBe(0);
      expect(material.metalness).toBe(0);
    }
    disposeModel(root);
  });

  it('mueve brazos y piernas al caminar y se detiene sin cambiar la posición del jugador', () => {
    const root = buildDeveloper();
    root.position.set(4, 0, -3);
    poseDeveloper(root, 0.2, 3, true, false);
    const leg = root.getObjectByName('left-leg')!;
    const initial = leg.rotation.x;
    poseDeveloper(root, 0.5, 3, true, false);
    expect(leg.rotation.x).not.toBe(initial);
    poseDeveloper(root, 0.7, 0, true, false);
    const resting = leg.rotation.x;
    poseDeveloper(root, 4, 0, true, false);
    expect(leg.rotation.x).toBe(resting);
    expect(root.position.toArray()).toEqual([4, 0, -3]);
    disposeModel(root);
  });

  it('distingue sentarse, saltar y estar de pie', () => {
    const root = buildDeveloper();
    const leg = root.getObjectByName('left-leg')!;
    poseDeveloper(root, 0, 0, true, true);
    expect(leg.rotation.x).toBeLessThan(-1);
    expect(root.getObjectByName('body')!.position.y).toBeLessThan(0.7);
    poseDeveloper(root, 0, 0, false, false);
    expect(leg.rotation.x).toBeLessThan(-0.1);
    expect(root.getObjectByName('left-knee')!.rotation.x).toBeGreaterThan(0.5);
    poseDeveloper(root, 0, 0, true, false);
    expect(Math.abs(leg.rotation.x)).toBeLessThan(0.3);
    disposeModel(root);
  });

  it('alterna zancadas, limita su amplitud y mantiene las suelas niveladas (002/R15/R16)', () => {
    const root = buildDeveloper();
    const left = root.getObjectByName('left-leg')!;
    const right = root.getObjectByName('right-leg')!;
    poseDeveloper(root, Math.PI / 20, 2, true, false);
    expect(left.rotation.x).toBeGreaterThan(0.35);
    expect(left.rotation.x).toBeLessThan(0.55);
    poseDeveloper(root, Math.PI / 20, 4, true, false);
    expect(left.rotation.x).toBeGreaterThan(0.55);
    expect(left.rotation.x).toBeLessThan(0.8);
    expect(right.rotation.x).toBeCloseTo(-left.rotation.x);
    expect(left.rotation.z).toBe(0);
    expect(right.rotation.z).toBe(0);
    expect(root.getObjectByName('left-knee')!.rotation.x).toBe(0);
    expect(root.getObjectByName('right-knee')!.rotation.x).toBeGreaterThan(0.4);
    expect(root.getObjectByName('right-knee')!.rotation.x).toBeLessThan(0.65);
    root.updateMatrixWorld(true);
    for (const side of ['left', 'right']) {
      const foot = root.getObjectByName(`${side}-foot`)!;
      expect(new Vector3(0, 1, 0).transformDirection(foot.matrixWorld).y).toBeGreaterThan(0.99);
    }
    const angle = left.rotation.x;
    poseDeveloper(root, Math.PI / 20, 8, true, false);
    expect(left.rotation.x).toBe(angle);
    poseDeveloper(root, 3 * Math.PI / 20, 4, true, false);
    expect(left.rotation.x).toBeLessThan(-0.55);
    disposeModel(root);
  });

  it('los perros trotan en diagonal, paran las patas y mueven la cola sin girar su raíz (002/R15)', () => {
    const root = buildCompanion(0);
    poseCompanion(root, Math.PI / 28, 2);
    const front = root.getObjectByName('front-left')!;
    expect(front.rotation.x).toBeGreaterThan(0.2);
    expect(front.rotation.x).toBeLessThan(0.35);
    expect(root.getObjectByName('back-right')!.rotation.x).toBe(front.rotation.x);
    expect(root.getObjectByName('back-left')!.rotation.x).toBe(-front.rotation.x);
    expect(root.getObjectByName('front-right')!.rotation.x).toBe(-front.rotation.x);
    poseCompanion(root, Math.PI / 28, 4);
    const fast = front.rotation.x;
    expect(fast).toBeGreaterThan(0.4);
    expect(fast).toBeLessThan(0.7);
    poseCompanion(root, Math.PI / 28, 8);
    expect(front.rotation.x).toBe(fast);
    poseCompanion(root, 0.1, 0);
    expect(front.rotation.x).toBe(0);
    const tail = root.getObjectByName('tail')!;
    expect(tail.rotation.y).toBeGreaterThan(0.06);
    expect(tail.rotation.y).toBeLessThan(0.24);
    poseCompanion(root, 0.7, 0);
    expect(tail.rotation.y).toBeLessThan(0);
    expect(root.rotation.y).toBe(0);
    disposeModel(root);
  });

  it('diferencia a los perros en altura y pelaje, conservando el collar cian', () => {
    const larger = buildCompanion(0);
    const smaller = buildCompanion(1);
    const size = (root: typeof larger) => new Box3().setFromObject(root).getSize(new Vector3()).y;
    expect(size(larger)).toBeGreaterThan(size(smaller));
    const fur = (root: typeof larger) => ((root.getObjectByName('fur') as Mesh).material as MeshStandardMaterial).color.getHex();
    expect(fur(larger)).not.toBe(fur(smaller));
    expect(larger.getObjectByName('collar')).toBeDefined();
    expect(smaller.getObjectByName('collar')).toBeDefined();
    poseCompanion(larger, 0.2, 3);
    const angle = larger.getObjectByName('front-left')!.rotation.x;
    poseCompanion(larger, 0.6, 3);
    expect(larger.getObjectByName('front-left')!.rotation.x).not.toBe(angle);
    expect(smaller.getObjectByName('front-left')!.rotation.x).toBe(0);
    disposeModel(larger);
    disposeModel(smaller);
  });
});
