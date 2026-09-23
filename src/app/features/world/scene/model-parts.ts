import { BufferGeometry, CatmullRomCurve3, CylinderGeometry, Float32BufferAttribute, Group, Material, Mesh, Object3D, SphereGeometry, TubeGeometry, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Primitivas compartidas dentro de un modelo; ninguna geometría pertenece a otro modelo. */
export class ModelParts {
  readonly root = new Group();

  constructor(private readonly smoothProfiles = false) {}
  private readonly boxGeometry = new RoundedBoxGeometry(1, 1, 1, 1, 0.065);
  private readonly cylinderGeometry = new CylinderGeometry(1, 1, 1, 10);
  private readonly sphereGeometry = new SphereGeometry(1, 10, 7);

  joint(parent: Object3D, name: string, x: number, y: number, z: number): Group {
    const joint = new Group();
    joint.name = name;
    joint.position.set(x, y, z);
    parent.add(joint);
    return joint;
  }

  box(parent: Object3D, material: Material, size: readonly number[], position: readonly number[]): Mesh {
    return this.mesh(parent, this.boxGeometry, material, size, position);
  }

  cylinder(parent: Object3D, material: Material, radius: number, height: number, position: readonly number[]): Mesh {
    return this.mesh(parent, this.cylinderGeometry, material, [radius, height, radius], position);
  }

  sphere(parent: Object3D, material: Material, size: readonly number[], position: readonly number[]): Mesh {
    return this.mesh(parent, this.sphereGeometry, material, size, position);
  }

  /** Secciones [altura, semiancho, semifondo, centroZ?, centroX?], de abajo hacia arriba. */
  profile(parent: Object3D, material: Material, sections: readonly (readonly number[])[]): Mesh {
    const vertices: number[] = [];
    const indices: number[] = [];
    const outline = [[-0.65, -1], [0.65, -1], [1, -0.65], [1, 0.65], [0.65, 1], [-0.65, 1], [-1, 0.65], [-1, -0.65]];
    for (const [y, width, depth, z = 0, x = 0] of sections) {
      for (const [u, v] of outline) vertices.push(x + u * width, y, z + v * depth);
    }
    for (let ring = 1; ring < sections.length; ring++) {
      for (let side = 0; side < 8; side++) {
        const a = (ring - 1) * 8 + side;
        const b = (ring - 1) * 8 + (side + 1) % 8;
        indices.push(a, a + 8, b, b, a + 8, b + 8);
      }
    }
    const top = (sections.length - 1) * 8;
    for (let side = 1; side < 7; side++) {
      indices.push(0, side, side + 1, top, top + side + 1, top + side);
    }
    const indexed = new BufferGeometry();
    indexed.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    indexed.setIndex(indices);
    const geometry = this.smoothProfiles ? indexed : indexed.toNonIndexed();
    if (geometry !== indexed) indexed.dispose();
    geometry.computeVertexNormals();
    return this.mesh(parent, geometry, material, [1, 1, 1], [0, 0, 0]);
  }

  cable(parent: Object3D, material: Material, points: readonly (readonly number[])[], radius = 0.055): Mesh {
    const curve = new CatmullRomCurve3(points.map(p => new Vector3(p[0], p[1], p[2])));
    return this.mesh(parent, new TubeGeometry(curve, 18, radius, 6, false), material, [1, 1, 1], [0, 0, 0]);
  }

  private mesh(parent: Object3D, geometry: BufferGeometry, material: Material, size: readonly number[], position: readonly number[]): Mesh {
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(size[0], size[1], size[2]);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
}
