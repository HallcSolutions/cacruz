import { Vector3 } from 'three';
import { buildThoughtBolt, poseThoughtBolt } from './build-thought-bolt';
import { disposeModel } from './dispose-model';

describe('Poder del libro (002/R16)', () => {
  it('muestra una red para el lector y conserva la energía cian de los perros', () => {
    const bolt = buildThoughtBolt();
    bolt.position.set(5, 2, 3);
    poseThoughtBolt(bolt, 0.3, false);
    expect(bolt.getObjectByName('thought')!.visible).toBeTrue();
    expect(bolt.getObjectByName('pulse')!.visible).toBeFalse();
    const rotation = bolt.getObjectByName('thought')!.rotation.z;
    poseThoughtBolt(bolt, 0.8, true);
    expect(bolt.getObjectByName('thought')!.visible).toBeFalse();
    expect(bolt.getObjectByName('pulse')!.visible).toBeTrue();
    poseThoughtBolt(bolt, 1, false);
    const turn = bolt.getObjectByName('thought')!.rotation.z - rotation;
    expect(turn).toBeGreaterThan(1);
    expect(turn).toBeLessThan(2);
    expect(bolt.position).toEqual(new Vector3(5, 2, 3));
    disposeModel(bolt);
  });
});
