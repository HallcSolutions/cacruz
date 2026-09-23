import { BoxGeometry, CanvasTexture, CircleGeometry, Color, CylinderGeometry, ExtrudeGeometry, Group, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, Quaternion, RingGeometry, Shape, SRGBColorSpace, Vector2, Vector3 } from 'three';
import { DeckTextures } from '../model/deck-textures';
import { WORLD_RADIUS } from '../logic/terrain-height';

/** R17: pavimento hexagonal de grafito, biseles reales e inserciones de energía discretas. */
export function buildDeck(textures?: DeckTextures): Group {
  const root = new Group();
  const points: [number, number][] = [];
  const radius = 1.55;
  const width = Math.sqrt(3) * radius;
  for (let row = -20; row <= 20; row++) {
    for (let column = -20; column <= 20; column++) {
      const x = (column + (row % 2) / 2) * width;
      const z = row * radius * 1.5;
      if (Math.hypot(x, z) < WORLD_RADIUS - radius) points.push([x, z]);
    }
  }
  const outline = new Shape();
  for (let corner = 0; corner < 6; corner++) {
    const angle = corner * Math.PI / 3 + Math.PI / 6;
    const x = Math.cos(angle) * (radius - 0.035);
    const y = Math.sin(angle) * (radius - 0.035);
    if (corner === 0) outline.moveTo(x, y); else outline.lineTo(x, y);
  }
  outline.closePath();
  const geometry = new ExtrudeGeometry(outline, { depth: 0.12, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.016, bevelThickness: 0.012 });
  geometry.rotateX(-Math.PI / 2);
  const positions = geometry.attributes['position'];
  const uv = geometry.attributes['uv'];
  for (let vertex = 0; vertex < positions.count; vertex++) uv.setXY(vertex, positions.getX(vertex) / (radius * 2) + 0.5, positions.getZ(vertex) / (radius * 2) + 0.5);
  const surface = textures?.color ?? deckTexture();
  const plates = new InstancedMesh(geometry, new MeshStandardMaterial({
    color: 0x767f95, map: surface, normalMap: textures?.normal ?? null, normalScale: new Vector2(0.22, 0.22),
    roughnessMap: textures?.roughness ?? null, bumpMap: surface, bumpScale: 0.028,
    metalness: 0.05, roughness: 0.86, emissiveIntensity: 0,
  }), points.length);
  plates.name = 'deck-plates';
  const matrix = new Matrix4();
  const color = new Color();
  points.forEach(([x, z], i) => {
    plates.setMatrixAt(i, matrix.makeTranslation(x, -0.132, z));
    const value = 0.76 + ((i * 17) % 7) * 0.028;
    plates.setColorAt(i, color.setRGB(value * 0.93, value * 0.97, value));
  });
  plates.receiveShadow = true;
  root.add(plates);
  const base = new Mesh(new CircleGeometry(WORLD_RADIUS, 96), new MeshStandardMaterial({ color: 0x101b27, roughness: 0.85 }));
  base.rotation.x = -Math.PI / 2;
  base.position.y = -0.145;
  base.receiveShadow = true;
  root.add(base);
  addInlays(root, points);
  return root;
}

function addInlays(root: Group, points: readonly (readonly number[])[]): void {
  const selected = points.filter((_, i) => i % 4 === 0);
  const cyan = new MeshStandardMaterial({ color: 0x78b5c5, emissive: 0x28718c, emissiveIntensity: 0.65, roughness: 0.48, metalness: 0.3 });
  const steel = new MeshStandardMaterial({ color: 0x8f9ca7, metalness: 0.7, roughness: 0.55 });
  const strips = new InstancedMesh(new BoxGeometry(1, 0.005, 1), cyan, selected.length * 2);
  const nodes = new InstancedMesh(new CylinderGeometry(0.045, 0.045, 0.005, 6), steel, selected.length * 2);
  const transform = new Matrix4();
  const rotation = new Quaternion();
  selected.forEach(([x, z], i) => {
    const angle = (i % 3) * Math.PI / 3;
    rotation.setFromAxisAngle(new Vector3(0, 1, 0), angle);
    for (let part = 0; part < 2; part++) {
      const offset = part === 0 ? -0.37 : 0.37;
      const center = new Vector3(x + Math.cos(angle) * 1.18 + Math.sin(angle) * offset, 0.005, z - Math.sin(angle) * 1.18 + Math.cos(angle) * offset);
      strips.setMatrixAt(i * 2 + part, transform.compose(center, rotation, new Vector3(0.018, 1, 0.48)));
      center.x += Math.sin(angle) * (part === 0 ? -0.26 : 0.26);
      center.z += Math.cos(angle) * (part === 0 ? -0.26 : 0.26);
      nodes.setMatrixAt(i * 2 + part, transform.makeTranslation(center.x, center.y, center.z));
    }
  });
  root.add(strips, nodes);
  const track = new Mesh(new RingGeometry(5.85, 5.89, 96), steel);
  track.rotation.x = -Math.PI / 2;
  track.position.set(0, 0.007, -6);
  root.add(track);
  const markers = new InstancedMesh(new BoxGeometry(0.07, 0.008, 0.36), cyan, 24);
  for (let i = 0; i < 24; i++) {
    const angle = i * Math.PI / 12;
    rotation.setFromAxisAngle(new Vector3(0, 1, 0), angle);
    markers.setMatrixAt(i, transform.compose(new Vector3(Math.sin(angle) * 5.65, 0.008, -6 + Math.cos(angle) * 5.65), rotation, new Vector3(1, 1, 1)));
  }
  root.add(markers);
}

function deckTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#707887';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1900; i++) {
    ctx.fillStyle = i % 2 ? 'rgba(0,0,0,.055)' : 'rgba(255,255,255,.04)';
    ctx.fillRect((i * 37.31) % 256, (i * 91.73) % 256, 1, 1);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
