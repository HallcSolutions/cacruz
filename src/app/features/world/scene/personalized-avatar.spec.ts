import { Box3, Mesh, SkinnedMesh, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CharacterAnimator, DEVELOPER_CLIPS } from './character-animator';
import { cloneCharacter } from './load-assets';

describe('Avatar personal — spec 002, R9', () => {
  let avatar: GLTF;

  beforeEach(async () => {
    const response = await fetch('/models/character/christian.glb');
    if (!response.ok) {
      throw new Error(`R9: falta el avatar personal christian.glb (${response.status})`);
    }
    avatar = await new GLTFLoader().parseAsync(await response.arrayBuffer(), '/models/character/');
  });

  afterEach(() => {
    avatar?.scene.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      node.geometry.dispose();
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      for (const material of materials) material.dispose();
    });
  });

  it('R9: contiene cuerpo tridimensional, textura y una malla vinculada al esqueleto', () => {
    const size = new Box3().setFromObject(avatar.scene).getSize(new Vector3());
    expect(size.y).toBeGreaterThan(0);
    expect(size.x / size.y).toBeGreaterThan(0.15);
    expect(size.z / size.y).toBeGreaterThan(0.05);
    const meshes: SkinnedMesh[] = [];
    avatar.scene.traverse((node) => {
      if (node instanceof SkinnedMesh) meshes.push(node);
    });
    expect(meshes.length).toBeGreaterThan(0);
    for (const mesh of meshes) {
      expect(mesh.skeleton.bones.length).toBeGreaterThan(10);
      expect(mesh.geometry.getAttribute('skinIndex').count).toBe(
        mesh.geometry.getAttribute('position').count,
      );
      expect(mesh.geometry.getAttribute('skinWeight').count).toBe(
        mesh.geometry.getAttribute('position').count,
      );
    }
    const textured = meshes.some((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      return materials.some((material) => 'map' in material && Boolean(material.map));
    });
    expect(textured).toBeTrue();
  });

  for (const [action, clipName] of Object.entries(DEVELOPER_CLIPS)) {
    it(`R9: ofrece la animación ${action} compatible con el controlador existente`, () => {
      const clip = avatar.animations.find((entry) => entry.name === clipName);
      expect(clip).withContext(`Falta ${clipName}`).toBeDefined();
      expect(clip?.duration ?? 0).toBeGreaterThan(0);
      expect(clip?.tracks.length ?? 0).toBeGreaterThan(0);
    });
  }

  it('R9: caminar mueve el esqueleto de la copia sin alterar el modelo original', () => {
    const copy = cloneCharacter({ model: avatar.scene, clips: avatar.animations });
    const originals: SkinnedMesh[] = [];
    const copies: SkinnedMesh[] = [];
    avatar.scene.traverse((node) => {
      if (node instanceof SkinnedMesh) originals.push(node);
    });
    copy.traverse((node) => {
      if (node instanceof SkinnedMesh) copies.push(node);
    });
    expect(copies.length).toBeGreaterThan(0);
    if (!copies.length || !originals.length) return;
    const original = originals[0].skeleton.bones.map((bone) => bone.quaternion.clone());
    const bones = copies[0].skeleton.bones;
    expect(bones[0]).not.toBe(originals[0].skeleton.bones[0]);
    const animator = new CharacterAnimator(copy, avatar.animations, DEVELOPER_CLIPS, 5);
    animator.update(0, 3.25, true);
    const start = bones.map((bone) => bone.quaternion.clone());
    let maximumChange = 0;
    for (let frame = 0; frame < 30; frame++) {
      animator.update(1 / 60, 3.25, true);
      bones.forEach((bone, index) => {
        maximumChange = Math.max(maximumChange, bone.quaternion.angleTo(start[index]));
      });
    }
    expect(maximumChange).toBeGreaterThan(0.05);
    originals[0].skeleton.bones.forEach((bone, index) => {
      expect(bone.quaternion.angleTo(original[index])).toBeCloseTo(0, 6);
    });
    animator.dispose();
    const stopped = bones.map((bone) => bone.quaternion.clone());
    animator.update(0.25, 3.25, true);
    bones.forEach((bone, index) => {
      expect(bone.quaternion.angleTo(stopped[index])).toBeCloseTo(0, 6);
    });
  });
});
