import { PerspectiveCamera, Spherical, Vector3 } from 'three';
import { Vector2 } from '../model/vector2';

export const DEFAULT_CAMERA_ZOOM = 1.3;
export const CAMERA_FOCUS_HEIGHT = 1.2;

/** R1: el campo vertical estable mantiene la presencia del avatar también en móvil. */
export function createWorldCamera(aspect: number): PerspectiveCamera {
  return new PerspectiveCamera(42, aspect, 0.5, 160);
}

/** R1: vista oblicua cercana; el zoom conserva el ángulo respecto al foco. */
export function positionWorldCamera(
  camera: PerspectiveCamera,
  focus: Vector2,
  zoom: number,
  yaw = 0,
  elevation = 0,
): void {
  const offset = orbitOffset(new Vector3(5.4, 7.6, 10.4), yaw, elevation).multiplyScalar(zoom);
  camera.position.set(focus.x + offset.x, CAMERA_FOCUS_HEIGHT + offset.y, focus.z + offset.z);
  camera.lookAt(focus.x, CAMERA_FOCUS_HEIGHT, focus.z);
}

/** R1: arrastrar el suelo sigue los ejes de pantalla, también en vista oblicua. */
export function panWorldCamera(camera: PerspectiveCamera, pan: Vector2, dx: number, dy: number, viewportHeight: number): Vector2 {
  const forward = camera.getWorldDirection(new Vector3());
  const distance = (camera.position.y - CAMERA_FOCUS_HEIGHT) / -forward.y;
  const units = 2 * Math.tan(camera.fov * Math.PI / 360) * distance / Math.max(viewportHeight, 1);
  const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
  up.y = 0;
  up.divideScalar(up.lengthSq());
  return {
    x: pan.x + (-dx * right.x + dy * up.x) * units,
    z: pan.z + (-dx * right.z + dy * up.z) * units,
  };
}

/** R15: conserva ambos cuerpos completos incluso en una pantalla vertical. */
export function positionEncounterCamera(camera: PerspectiveCamera, player: Vector2, boss: Vector2, zoom: number, yaw = 0, elevation = 0): void {
  const focus = new Vector3((player.x + boss.x) / 2, 1.5, (player.z + boss.z) / 2);
  const offset = orbitOffset(new Vector3(5.4, 7.6, 10), yaw, elevation);
  const back = offset.clone().normalize();
  const right = new Vector3(0, 1, 0).cross(back).normalize();
  const up = back.clone().cross(right);
  const vertical = Math.tan(camera.fov * Math.PI / 360);
  let distance = offset.length() * Math.max(1, zoom);
  for (const actor of [{ ...player, width: 0.6, height: 2, depth: 0.6 }, { ...boss, width: 2.7, height: 5, depth: 1.3 }]) {
    for (const x of [-actor.width, actor.width]) for (const y of [0, actor.height]) for (const z of [-actor.depth, actor.depth]) {
      // Stryker disable next-line ArithmeticOperator: invertir +x/+z solo permuta los mismos extremos simétricos de la caja.
      const point = new Vector3(actor.x + x, y, actor.z + z).sub(focus);
      const depth = point.dot(back);
      distance = Math.max(distance,
        depth + Math.abs(point.dot(right)) / (vertical * camera.aspect * 0.88),
        depth + Math.abs(point.dot(up)) / (vertical * 0.76));
    }
  }
  camera.position.copy(focus).addScaledVector(back, distance);
  camera.lookAt(focus);
  camera.updateMatrixWorld();
}

function orbitOffset(offset: Vector3, yaw: number, elevation: number): Vector3 {
  const spherical = new Spherical().setFromVector3(offset);
  spherical.theta += yaw;
  spherical.phi = Math.max(0.3, Math.min(1.3, spherical.phi - elevation));
  return offset.setFromSpherical(spherical);
}
