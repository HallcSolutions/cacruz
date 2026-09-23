import { Box3, BufferGeometry, Group, Material, Mesh, Object3D, Texture, Vector3 } from 'three';
import { buildDebtMonster } from './build-debt-monster';
import { disposeModel } from './dispose-model';

function part(root: Group, name: string): Object3D {
  const object = root.getObjectByName(name);
  if (!object) {
    throw new Error(`Falta la pieza articulable ${name} (002/R10/R15)`);
  }
  return object;
}

function bounds(object: Object3D): Box3 {
  object.updateWorldMatrix(true, true);
  return new Box3().setFromObject(object, true);
}

function resources(root: Group): Set<BufferGeometry | Material | Texture> {
  const owned = new Set<BufferGeometry | Material | Texture>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    owned.add(object.geometry);
    const materials: Material[] = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      owned.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof Texture) owned.add(value);
      }
    }
  });
  return owned;
}

function observeDisposal(root: Group): jasmine.Spy[] {
  return [...resources(root)].map((resource) => {
    const listener = jasmine.createSpy('dispose');
    resource.addEventListener('dispose', listener);
    return listener;
  });
}

describe('Modelo de Deuda técnica — contrato animable (002/R2/R10/R15)', () => {
  let root: Group;

  beforeEach(() => {
    root = buildDebtMonster();
  });

  afterEach(() => {
    disposeModel(root);
  });

  it('construye un volumen 3D completo de dos a tres alturas del protagonista', () => {
    const size = bounds(root).getSize(new Vector3());

    expect(root).toBeInstanceOf(Group);
    expect(size.y).toBeGreaterThanOrEqual(1.8 * 2);
    expect(size.y).toBeLessThanOrEqual(1.8 * 3);
    expect(size.x).toBeGreaterThan(size.y * 0.6);
    expect(size.z).toBeGreaterThan(size.y * 0.2);
    expect(resources(root).size).toBeGreaterThan(0);
  });

  it('mantiene geometría finita al colocar y girar el monstruo dentro del mundo', () => {
    root.position.set(8, 0, -9);
    root.rotation.y = Math.PI / 3;
    const box = bounds(root);

    for (const coordinate of [...box.min.toArray(), ...box.max.toArray()]) {
      expect(Number.isFinite(coordinate)).toBeTrue();
    }
    expect(box.getCenter(new Vector3()).distanceTo(root.position)).toBeLessThan(5.4);
    expect(box.isEmpty()).toBeFalse();
  });

  for (const side of ['left', 'right']) {
    it(`apoya el pie ${side} sobre el suelo sin hundirlo ni dejarlo flotando`, () => {
      const foot = bounds(part(root, `${side}-foot`));

      expect(foot.min.y).toBeGreaterThanOrEqual(-0.02);
      expect(foot.min.y).toBeLessThanOrEqual(0.02);
      expect(foot.getSize(new Vector3()).y).toBeGreaterThan(0.1);
    });

    it(`mueve el brazo ${side} con su hombro sin arrastrar el brazo opuesto`, () => {
      const shoulder = part(root, `${side}-shoulder`);
      const hand = part(root, `${side}-hand`);
      const otherHand = part(root, `${side === 'left' ? 'right' : 'left'}-hand`);
      const before = hand.getWorldPosition(new Vector3());
      const otherBefore = otherHand.getWorldPosition(new Vector3());

      shoulder.rotation.x += 0.4;
      root.updateMatrixWorld(true);

      expect(hand.getWorldPosition(new Vector3()).distanceTo(before)).toBeGreaterThan(0.05);
      expect(otherHand.getWorldPosition(new Vector3()).distanceTo(otherBefore)).toBeLessThan(0.000001);
    });

    it(`articula la pierna ${side} desde la cadera sin mover el torso`, () => {
      const hip = part(root, `${side}-hip`);
      const foot = part(root, `${side}-foot`);
      const torso = part(root, 'torso');
      const footBefore = foot.getWorldPosition(new Vector3());
      const torsoBefore = torso.getWorldPosition(new Vector3());

      hip.rotation.x += 0.3;
      root.updateMatrixWorld(true);

      expect(foot.getWorldPosition(new Vector3()).distanceTo(footBefore)).toBeGreaterThan(0.05);
      expect(torso.getWorldPosition(new Vector3()).distanceTo(torsoBefore)).toBeLessThan(0.000001);
    });
  }

  it('mantiene núcleo y pantallas unidos al torso durante una reacción corporal', () => {
    const torso = part(root, 'torso');
    const attached = ['amber-core', 'left-code-screen', 'right-code-screen'].map(name => part(root, name));
    const before = attached.map(object => object.getWorldPosition(new Vector3()));
    const foot = part(root, 'left-foot');
    const footBefore = foot.getWorldPosition(new Vector3());

    torso.position.y += 0.25;
    root.updateMatrixWorld(true);

    attached.forEach((object, index) => {
      const displacement = object.getWorldPosition(new Vector3()).sub(before[index]);
      expect(displacement.x).toBeCloseTo(0, 6);
      expect(displacement.y).toBeCloseTo(0.25, 6);
      expect(displacement.z).toBeCloseTo(0, 6);
      expect(bounds(object).isEmpty()).toBeFalse();
    });
    expect(foot.getWorldPosition(new Vector3()).distanceTo(footBefore)).toBeLessThan(0.000001);
  });

  it('conserva poses independientes al construir dos instancias para una revisión', () => {
    const other = buildDebtMonster();
    try {
      const before = bounds(other).clone();
      root.position.x = 10;
      part(root, 'left-shoulder').rotation.x = 0.7;

      expect(bounds(other).equals(before)).toBeTrue();
      expect(part(root, 'left-shoulder')).not.toBe(part(other, 'left-shoulder'));
    } finally {
      disposeModel(other);
    }
  });

  it('libera una sola vez cada geometría, material y textura al destruirse repetidamente', () => {
    const listeners = observeDisposal(root);
    expect(listeners.length).toBeGreaterThan(0);

    disposeModel(root);
    disposeModel(root);

    listeners.forEach(listener => expect(listener).toHaveBeenCalledTimes(1));
  });

  it('retira el modelo de la escena al liberar sus recursos', () => {
    const scene = new Group();
    scene.add(root);

    disposeModel(root);

    expect(root.parent).toBeNull();
    expect(scene.children).not.toContain(root);
  });

  it('no invalida recursos de otra instancia al liberar el modelo anterior', () => {
    const other = buildDebtMonster();
    const listeners = observeDisposal(other);
    try {
      disposeModel(root);

      listeners.forEach(listener => expect(listener).not.toHaveBeenCalled());
      expect(bounds(other).isEmpty()).toBeFalse();
    } finally {
      disposeModel(other);
    }
    listeners.forEach(listener => expect(listener).toHaveBeenCalledTimes(1));
  });
});
