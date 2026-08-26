/**
 * La base flotante es una plataforma plana: el suelo está a cota cero en todo el radio.
 * Se mantiene la misma interfaz que tenía el terreno con relieve, para no tocar al personaje.
 */
export const WORLD_RADIUS = 40;
const EDGE_MARGIN = 1.2;

export function terrainHeightAt(_x: number, _z: number): number {
  return 0;
}

export function isInsideWorld(x: number, z: number): boolean {
  return Math.hypot(x, z) <= WORLD_RADIUS - EDGE_MARGIN;
}
