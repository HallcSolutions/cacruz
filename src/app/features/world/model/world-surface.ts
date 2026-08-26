/** Lo que el personaje necesita saber del suelo para moverse. */
export interface WorldSurface {
  heightAt(x: number, z: number): number;
  isInside(x: number, z: number): boolean;
}
