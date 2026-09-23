import { BufferGeometry, Object3D, Material, Mesh, Points, Line, Sprite, Texture } from 'three';

const disposed = new WeakSet<Object3D>();

/** R8/R10: recursos propios compartidos entre piezas, liberados exactamente una vez. */
export function disposeModel(root: Object3D): void {
  if (disposed.has(root)) return;
  disposed.add(root);
  root.removeFromParent();
  const resources = new Set<BufferGeometry | Material | Texture>();
  root.traverse(object => {
    if (!(object instanceof Mesh || object instanceof Points || object instanceof Line || object instanceof Sprite)) return;
    if (!(object instanceof Sprite)) resources.add(object.geometry);
    const materials: Material[] = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      resources.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof Texture) resources.add(value);
      }
    }
  });
  resources.forEach(resource => resource.dispose());
}
