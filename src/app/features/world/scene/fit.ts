import { Box3, Object3D, Vector3 } from 'three';

const box = new Box3();
const size = new Vector3();

/**
 * Los modelos del kit vienen a escalas distintas (algunos en centímetros). Se normalizan por
 * su caja envolvente a un ancho o alto en unidades del mundo, y se apoyan en el suelo.
 */
export function fit(object: Object3D, target: { width?: number; height?: number; size?: number }): Object3D {
  object.updateMatrixWorld(true);
  box.setFromObject(object);
  box.getSize(size);
  /* `size` normaliza la dimensión mayor: a prueba de piezas cuya forma no conozco. */
  const current =
    target.size !== undefined
      ? Math.max(size.x, size.y, size.z)
      : target.height !== undefined
        ? size.y
        : Math.max(size.x, size.z);
  const wanted = target.size ?? target.height ?? target.width ?? 1;
  if (current > 0) {
    object.scale.multiplyScalar(wanted / current);
  }
  object.updateMatrixWorld(true);
  box.setFromObject(object);
  object.position.y -= box.min.y;
  return object;
}
