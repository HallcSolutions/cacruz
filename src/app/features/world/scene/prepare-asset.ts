import { Group, Light, Material, Mesh, MeshStandardMaterial } from 'three';

/** Los modelos aportan geometría; solo la escena controla la iluminación. */
export function prepareAsset(root: Group): Group {
  const prepared = new Set<Material>();
  const importedLights: Light[] = [];
  root.traverse(node => {
    if (node instanceof Light) importedLights.push(node);
    if (!(node instanceof Mesh)) return;
    node.castShadow = true;
    node.receiveShadow = true;
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      if (prepared.has(material)) continue;
      prepared.add(material);
      if (!(material instanceof MeshStandardMaterial)) continue;
      material.color.multiplyScalar(0.42);
      material.roughness = Math.max(material.roughness, 0.65);
      material.metalness = Math.min(material.metalness, 0.4);
      material.emissiveIntensity = Math.min(material.emissiveIntensity, 0.18);
    }
  });
  importedLights.forEach(light => light.removeFromParent());
  return root;
}
