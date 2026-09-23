import { CanvasTexture, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

/** Hoja impresa y curvada, compartida por el libro y sus poderes. */
export function knowledgePage(width: number, height: number): Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#f4e7c7';
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = '#bb915b';
  context.lineWidth = 2;
  context.strokeRect(14, 14, 228, 228);
  context.fillStyle = '#206173';
  context.font = 'bold 40px monospace';
  context.textAlign = 'center';
  context.fillText('{ · }', 128, 70);
  for (let row = 0; row < 7; row++) {
    context.fillStyle = row % 3 === 0 ? '#3c7d83' : '#777063';
    context.fillRect(34 + (row % 3) * 10, 100 + row * 17, 170 - (row % 4) * 25, 4);
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const geometry = new PlaneGeometry(width, height, 5, 6);
  const vertices = geometry.attributes['position'];
  for (let i = 0; i < vertices.count; i++) {
    vertices.setZ(i, 0.012 * Math.sin(vertices.getX(i) / width * Math.PI) + 0.008 * Math.cos(vertices.getY(i) / height * Math.PI));
  }
  geometry.computeVertexNormals();
  const page = new Mesh(geometry, new MeshStandardMaterial({ map: texture, roughness: 0.85, side: DoubleSide, emissive: 0x14343e, emissiveIntensity: 0.15 }));
  page.castShadow = page.receiveShadow = true;
  return page;
}
