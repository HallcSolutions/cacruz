import {
  BackSide,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
  RepeatWrapping,
  SphereGeometry,
  SRGBColorSpace,
} from 'three';
import { WORLD_RADIUS } from '../logic/terrain-height';
import { STATION_SETBACK, WORLD_ZONES, zoneAngle } from '../logic/world-zones';
import { fit } from './fit';
import { AssetLibrary, placeProp } from './load-assets';

/**
 * Suelo de otro planeta: tierra azul-violeta con vetas de energía que brillan, bajo un cielo de
 * nebulosa. Todo dibujado en canvas, determinista. La superficie física sigue siendo plana.
 */
export function buildFloor(library: AssetLibrary): Group {
  const floor = new Group();

  const ground = new Mesh(
    new CircleGeometry(WORLD_RADIUS, 96),
    new MeshStandardMaterial({
      color: 0xffffff,
      map: soilTexture(),
      roughness: 0.85,
      metalness: 0.1,
      emissiveMap: veinsTexture(),
      emissive: 0x5ef0ff,
      emissiveIntensity: 0.22,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  floor.add(ground);

  const rim = new Mesh(
    new CylinderGeometry(WORLD_RADIUS, WORLD_RADIUS * 0.72, 7, 96, 1, true),
    new MeshStandardMaterial({ color: 0x1d1f28, roughness: 1 }),
  );
  rim.position.y = -3.52;
  floor.add(rim);

  floor.add(nebula());
  floor.add(stars());

  floor.add(pad(library, 0, 0, 0, 9));
  for (const zone of WORLD_ZONES) {
    if (zone.id === 'about') {
      continue;
    }
    const angle = zoneAngle(zone);
    floor.add(pad(library, zone.position.x - Math.sin(angle) * STATION_SETBACK, zone.position.z - Math.cos(angle) * STATION_SETBACK, angle, 7));
  }
  return floor;
}

function pad(library: AssetLibrary, x: number, z: number, rotation: number, width: number): Group {
  const platform = fit(placeProp(library, 'Platform_4x4'), { width });
  /* La plataforma trae un letrero con kanji en `Texture_Signs`: se cambia por un panel negro con brillo blanco. */
  platform.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) {
      return;
    }
    const swap = (material: Material) =>
      material.name === 'Texture_Signs'
        ? new MeshStandardMaterial({ color: 0x0b0b10, emissive: 0xffffff, emissiveIntensity: 0.12, roughness: 0.35, metalness: 0.3 })
        : material;
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(swap) : swap(mesh.material);
  });
  platform.position.set(x, platform.position.y + 0.02, z);
  platform.rotation.y = rotation;
  const group = new Group();
  group.add(platform);
  return group;
}

function rand(seed: number): number {
  const n = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return n - Math.floor(n);
}

/** Tierra alienígena: base azul-violeta con manchas teal y magenta, y algún cráter suave. */
function soilTexture(): CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#3a3d4a';
    ctx.fillRect(0, 0, size, size);
    const tints = ['rgba(120,130,160,0.16)', 'rgba(90,80,120,0.16)', 'rgba(60,60,80,0.22)', 'rgba(150,140,170,0.1)'];
    for (let i = 0; i < 90; i++) {
      const x = rand(i) * size;
      const y = rand(i + 500) * size;
      const r = 18 + rand(i + 900) * 60;
      const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
      blob.addColorStop(0, tints[i % tints.length]);
      blob.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = blob;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = rand(i + 77) > 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.1)';
      ctx.fillRect(rand(i + 11) * size, rand(i + 33) * size, 2, 2);
    }
    for (let i = 0; i < 12; i++) {
      const x = rand(i + 1300) * size;
      const y = rand(i + 1700) * size;
      const r = 12 + (i % 4) * 8;
      const crater = ctx.createRadialGradient(x, y, r * 0.3, x, y, r);
      crater.addColorStop(0, 'rgba(0,0,30,0.22)');
      crater.addColorStop(0.85, 'rgba(0,0,0,0.05)');
      crater.addColorStop(1, 'rgba(255,255,255,0.1)');
      ctx.fillStyle = crater;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Vetas de energía: grietas cian que serpentean; es lo que brilla con el bloom. */
function veinsTexture(): CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    for (let v = 0; v < 7; v++) {
      let x = rand(v * 3) * size;
      let y = rand(v * 3 + 1) * size;
      let angle = rand(v * 3 + 2) * Math.PI * 2;
      ctx.lineWidth = 1 + rand(v + 40);
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < 18; s++) {
        angle += (rand(v * 100 + s) - 0.5) * 1.2;
        x += Math.cos(angle) * 14;
        y += Math.sin(angle) * 14;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(5, 5);
  return texture;
}

/** Cielo de nebulosa: una esfera vista desde dentro con manchas violeta, cian y magenta. */
function nebula(): Mesh {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#07060f';
    ctx.fillRect(0, 0, size, size / 2);
    const tints = ['rgba(120,70,220,0.28)', 'rgba(60,200,230,0.16)', 'rgba(230,80,200,0.14)', 'rgba(40,40,140,0.3)'];
    for (let i = 0; i < 28; i++) {
      const x = rand(i + 5) * size;
      const y = rand(i + 9) * (size / 2);
      const r = 90 + rand(i + 13) * 220;
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
      cloud.addColorStop(0, tints[i % tints.length]);
      cloud.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cloud;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 900; i++) {
      const b = rand(i + 21);
      ctx.fillStyle = `rgba(255,255,255,${0.35 + b * 0.65})`;
      ctx.fillRect(rand(i + 3) * size, rand(i + 7) * (size / 2), b > 0.85 ? 2 : 1, b > 0.85 ? 2 : 1);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const sky = new Mesh(new SphereGeometry(140, 32, 16), new MeshBasicMaterial({ map: texture, side: BackSide, fog: false }));
  sky.position.y = -10;
  return sky;
}

function stars(): Points {
  const count = 900;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = rand(i) * Math.PI * 2;
    const phi = Math.acos(rand(i + 1000) * 1.6 - 0.6);
    const r = 110;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) - 20;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  return new Points(geometry, new PointsMaterial({ color: 0xffffff, size: 1.1, sizeAttenuation: true, fog: false }));
}
