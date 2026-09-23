import { Box3, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { buildMachine } from './build-machine';
import { disposeModel } from './dispose-model';

describe('Máquinas mecánicas (002/R13/R15)', () => {
  it('ofrece tres siluetas distintas y mantiene el núcleo reparable (002/R19)', () => {
    const variants = [0, 1, 2].map(index => buildMachine(index));
    expect(variants[0].getObjectByName('heavy-fist')).toBeDefined();
    expect(variants[1].getObjectByName('spider-leg-3')).toBeDefined();
    expect(variants[2].getObjectByName('shield-arm')).toBeDefined();
    for (const model of variants) {
      const bounds = new Box3().setFromObject(model);
      expect(bounds.max.x).toBeLessThan(1.1);
      expect(bounds.min.x).toBeGreaterThan(-1.1);
      expect(model.getObjectByName('status-light')).toBeDefined();
      disposeModel(model);
    }
  });
  it('tiene cuerpo, emisor y articulación propios, sin compartir materiales mutables', () => {
    const a = buildMachine();
    const b = buildMachine();
    expect(new Box3().setFromObject(a).getSize(new Vector3()).y).toBeGreaterThan(1);
    expect(a.getObjectByName('machine-head')).toBeDefined();
    const first = (a.getObjectByName('status-light') as Mesh).material as MeshStandardMaterial;
    const second = (b.getObjectByName('status-light') as Mesh).material as MeshStandardMaterial;
    const original = second.emissive.getHex();
    first.emissive.set(0x55dd99);
    expect(second.emissive.getHex()).toBe(original);
    disposeModel(a);
    disposeModel(b);
  });
});
