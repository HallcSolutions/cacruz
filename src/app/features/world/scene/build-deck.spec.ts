import { Box3, InstancedMesh, Mesh, MeshStandardMaterial } from 'three';
import { buildDeck } from './build-deck';
import { disposeModel } from './dispose-model';

describe('Suelo de placas (002/R10/R15)', () => {
  it('cubre la plaza con placas de geometría real y mantiene la superficie transitable', () => {
    const deck = buildDeck();
    const plates = deck.getObjectByName('deck-plates') as InstancedMesh;
    expect(plates).toBeInstanceOf(InstancedMesh);
    expect(plates.count).toBeGreaterThan(100);
    expect(plates.receiveShadow).toBeTrue();
    const box = new Box3().setFromObject(plates);
    expect(box.max.y).toBeLessThan(0.04);
    expect(box.min.x).toBeLessThan(-20);
    expect(box.max.x).toBeGreaterThan(20);
    const material = (plates as Mesh).material as MeshStandardMaterial;
    expect(material.emissiveIntensity).toBe(0);
    expect(material.roughness).toBeGreaterThan(0.5);
    disposeModel(deck);
  });
});
