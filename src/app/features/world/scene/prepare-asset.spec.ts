import { BoxGeometry, DirectionalLight, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { prepareAsset } from './prepare-asset';

describe('Materiales del escenario (002/R10/R15)', () => {
  it('elimina luces importadas para que duplicar drones no sobreexponga personajes', () => {
    const root = new Group();
    const nested = new Group();
    root.add(new DirectionalLight(0xffffff, 4.3), nested);
    nested.add(new DirectionalLight(0xffffff, 1));
    prepareAsset(root);
    let lights = 0;
    root.traverse(object => { if (object instanceof DirectionalLight) lights++; });
    expect(lights).toBe(0);
    expect(root.children).toContain(nested);
    expect(root.castShadow).toBeFalse();
    expect(nested.receiveShadow).toBeFalse();
  });
  it('preserva mallas y materiales básicos de las señales', () => {
    const root = new Group();
    const material = new MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new Mesh(new BoxGeometry(), material);
    root.add(mesh);
    prepareAsset(root);
    expect(root.children).toContain(mesh);
    expect(material.color.getHex()).toBe(0xff0000);
    mesh.geometry.dispose(); material.dispose();
  });
  it('ajusta una sola vez cada material compartido y conserva sus sombras', () => {
    const root = new Group();
    const material = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.8, emissiveIntensity: 3 });
    const a = new Mesh(new BoxGeometry(), material);
    const b = new Mesh(a.geometry, material);
    root.add(a, b);
    prepareAsset(root);
    expect(material.color.r).toBeCloseTo(0.42, 6);
    expect(material.roughness).toBe(0.65);
    expect(material.metalness).toBe(0.4);
    expect(material.emissiveIntensity).toBe(0.18);
    expect(a.castShadow && b.receiveShadow).toBeTrue();
    a.geometry.dispose(); material.dispose();
  });
});
