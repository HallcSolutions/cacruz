import { Vector2 } from '../model/vector2';
import { WorldZone } from '../model/world-zone';
import { zoneAngle } from './world-zones';

/**
 * Cada construcción mira hacia la plaza central, así que su sistema local está girado.
 * Estas funciones llevan puntos del mundo al sistema de la zona y de vuelta.
 */
export function toZoneSpace(position: Vector2, zone: WorldZone): Vector2 {
  return rotate(
    { x: position.x - zone.position.x, z: position.z - zone.position.z },
    -zoneAngle(zone),
  );
}

export function toWorldSpace(local: Vector2, zone: WorldZone): Vector2 {
  const turned = rotate(local, zoneAngle(zone));
  return { x: turned.x + zone.position.x, z: turned.z + zone.position.z };
}

/** Distancia del punto al borde de la huella de entrada; 0 si ya está dentro. */
export function distanceToFootprint(position: Vector2, zone: WorldZone): number {
  const local = toZoneSpace(position, zone);
  const dx = Math.max(0, Math.abs(local.x) - zone.footprint.halfWidth);
  const dz = Math.max(0, Math.abs(local.z) - zone.footprint.halfDepth);
  return Math.hypot(dx, dz);
}

/**
 * Rotación en Y con la **misma convención que three.js** (`Object3D.rotation.y`).
 * Con la convención matemática habitual el signo del seno va al revés y la huella de cada
 * construcción quedaba reflejada al lado equivocado: se chocaba contra el aire y se atravesaba la casa.
 */
export function rotate(vector: Vector2, angle: number): Vector2 {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return { x: vector.x * cos + vector.z * sin, z: -vector.x * sin + vector.z * cos };
}
