import { BufferGeometry, CanvasTexture, Group, Points, PointsMaterial, Sprite, SpriteMaterial } from 'three';
import { disposeModel } from './dispose-model';

describe('Limpieza de efectos y texturas (002/R8)', () => {
  it('libera partículas y texturas de sprites una vez al salir del mundo', () => {
    const root = new Group();
    const geometry = new BufferGeometry();
    const texture = new CanvasTexture(document.createElement('canvas'));
    const particles = new PointsMaterial({ map: texture });
    const sprite = new SpriteMaterial({ map: texture });
    const label = new Sprite(sprite);
    const sharedSpriteGeometry = spyOn(label.geometry, 'dispose').and.callThrough();
    root.add(new Points(geometry, particles), label);
    const spies = [geometry, texture, particles, sprite].map(resource => spyOn(resource, 'dispose').and.callThrough());
    disposeModel(root);
    disposeModel(root);
    spies.forEach(dispose => expect(dispose).toHaveBeenCalledTimes(1));
    expect(sharedSpriteGeometry).not.toHaveBeenCalled();
  });
});
