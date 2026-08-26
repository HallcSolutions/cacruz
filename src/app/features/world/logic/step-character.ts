import { CharacterState } from '../model/character-state';
import { MoveInput } from '../model/move-input';
import { Vector2 } from '../model/vector2';
import { WorldSurface } from '../model/world-surface';

export const MAX_SPEED = 5.2;
export const ACCELERATION = 24;
export const FRICTION = 13;
export const GRAVITY = 26;
export const JUMP_SPEED = 8.6;

export const INITIAL_CHARACTER: CharacterState = {
  position: { x: 1.4, z: 2.6 },
  velocity: { x: 0, z: 0 },
  altitude: 0,
  verticalSpeed: 0,
  grounded: true,
  facing: 0,
};

/**
 * Avanza un instante del personaje (R74, R76, R89, R94). Aritmética pura, sin three.js.
 * Horizontal: aceleración y rozamiento. Vertical: gravedad y salto solo desde el suelo.
 * Nunca sale del mundo: si el paso completo cae fuera, prueba cada eje por separado.
 */
export function stepCharacter(
  state: CharacterState,
  input: MoveInput,
  deltaSeconds: number,
  world: WorldSurface,
): CharacterState {
  const heading = normalize(input.direction);
  const wanted = {
    x: state.position.x + state.velocity.x * deltaSeconds,
    z: state.position.z + state.velocity.z * deltaSeconds,
  };
  const position = keepInside(state.position, wanted, world);

  const velocity = heading
    ? capSpeed(accelerate(state.velocity, heading, deltaSeconds))
    : brake(state.velocity, deltaSeconds);
  const facing = heading ? Math.atan2(heading.x, heading.z) : state.facing;
  const ground = world.heightAt(position.x, position.z);
  const jumping = input.jump && state.grounded;

  /*
   * En el suelo y sin saltar, los pies siguen al terreno. Sin esto, al bajar una cuesta el suelo
   * caía más rápido que el personaje y cada frame lo declaraba "en el aire": parpadeo
   * suelo/aire que disparaba el aterrizaje sin parar y congelaba la carrera.
   */
  if (state.grounded && !jumping) {
    return { position, velocity, facing, altitude: ground, verticalSpeed: 0, grounded: true };
  }

  const verticalSpeed = (jumping ? JUMP_SPEED : state.verticalSpeed) - GRAVITY * deltaSeconds;
  const risen = state.altitude + verticalSpeed * deltaSeconds;
  const landed = !jumping && verticalSpeed <= 0 && risen <= ground;

  return {
    position,
    velocity,
    facing,
    altitude: landed ? ground : risen,
    verticalSpeed: landed ? 0 : verticalSpeed,
    grounded: landed,
  };
}

export function speedOf(state: CharacterState): number {
  return length(state.velocity);
}

function keepInside(from: Vector2, to: Vector2, world: WorldSurface): Vector2 {
  const candidates = [to, { x: to.x, z: from.z }, { x: from.x, z: to.z }];
  return candidates.find((candidate) => world.isInside(candidate.x, candidate.z)) ?? from;
}

function accelerate(velocity: Vector2, heading: Vector2, deltaSeconds: number): Vector2 {
  const push = ACCELERATION * deltaSeconds;
  return { x: velocity.x + heading.x * push, z: velocity.z + heading.z * push };
}

function brake(velocity: Vector2, deltaSeconds: number): Vector2 {
  const speed = length(velocity);
  const drop = FRICTION * deltaSeconds;
  return speed <= drop ? { x: 0, z: 0 } : scale(velocity, (speed - drop) / speed);
}

function capSpeed(velocity: Vector2): Vector2 {
  const speed = length(velocity);
  return speed > MAX_SPEED ? scale(velocity, MAX_SPEED / speed) : velocity;
}

function normalize(direction: Vector2): Vector2 | null {
  const size = length(direction);
  return size === 0 ? null : scale(direction, 1 / size);
}

function length(vector: Vector2): number {
  return Math.hypot(vector.x, vector.z);
}

function scale(vector: Vector2, factor: number): Vector2 {
  return { x: vector.x * factor, z: vector.z * factor };
}
