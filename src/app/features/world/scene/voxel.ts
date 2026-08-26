import { BoxGeometry, ColorRepresentation, Mesh, MeshLambertMaterial } from 'three';

/** Geometría única compartida por todos los cubos: se escala por instancia, no se duplica. */
const UNIT_CUBE = new BoxGeometry(1, 1, 1);

export interface VoxelSpec {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly color: ColorRepresentation;
  readonly emissive?: boolean;
}

/** Un cubo del mundo. `emissive` lo usa lo que debe verse encendido (pantallas, luces, carteles). */
export function voxel(spec: VoxelSpec): Mesh {
  const material = new MeshLambertMaterial({
    color: spec.color,
    emissive: spec.emissive ? spec.color : 0x000000,
    emissiveIntensity: spec.emissive ? 0.9 : 0,
  });
  const mesh = new Mesh(UNIT_CUBE, material);
  mesh.scale.set(spec.width, spec.height, spec.depth);
  mesh.position.set(spec.x, spec.y, spec.z);
  mesh.castShadow = !spec.emissive;
  mesh.receiveShadow = true;
  return mesh;
}

/** Libera los materiales creados por `voxel`; la geometría es compartida y no se toca. */
export function disposeVoxels(root: { traverse(fn: (node: unknown) => void): void }): void {
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (mesh.isMesh && mesh.geometry !== UNIT_CUBE) {
      mesh.geometry.dispose();
    }
    const material = (mesh as Mesh).material;
    if (Array.isArray(material)) {
      material.forEach((one) => one.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

export function disposeSharedGeometry(): void {
  UNIT_CUBE.dispose();
}
