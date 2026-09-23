import { PerspectiveCamera, Vector3 } from 'three';
import { followCamera } from '../logic/follow-camera';
import { directionFromKeys } from '../logic/read-move-input';
import { INITIAL_CHARACTER, stepCharacter } from '../logic/step-character';
import { Vector2 } from '../model/vector2';
import { createWorldCamera, positionWorldCamera, positionEncounterCamera, panWorldCamera, CAMERA_FOCUS_HEIGHT, DEFAULT_CAMERA_ZOOM } from './world-camera';

const ORIGIN = { x: 0, z: 0 };
const AVATAR_HEIGHT = 1.8;
const VIEWPORTS = [
  [1440, 900],
  [390, 844],
  [2525, 841],
  [844, 390],
] as const;

function projectedBody(camera: PerspectiveCamera, position: Vector2, altitude = 0): Vector3[] {
  camera.updateMatrixWorld(true);
  const points: Vector3[] = [];
  for (const x of [-0.35, 0.35]) {
    for (const y of [0, AVATAR_HEIGHT]) {
      for (const z of [-0.25, 0.25]) {
        points.push(new Vector3(position.x + x, altitude + y, position.z + z).project(camera));
      }
    }
  }
  return points;
}

function projectedHeight(points: readonly Vector3[]): number {
  const heights = points.map((point) => point.y);
  return (Math.max(...heights) - Math.min(...heights)) / 2;
}

function expectBodyInFrame(points: readonly Vector3[]): void {
  for (const point of points) {
    expect(point.x).toBeGreaterThan(-1);
    expect(point.x).toBeLessThan(1);
    expect(point.y).toBeGreaterThan(-1);
    expect(point.y).toBeLessThan(1);
    expect(point.z).toBeGreaterThan(-1);
    expect(point.z).toBeLessThan(1);
  }
}

describe('Cámara del mundo — presencia del personaje (002/R1)', () => {
  it('gira alrededor del foco, limita la inclinación y conserva el encuadre de jugador y jefe (002/R1)', () => {
    const camera = createWorldCamera(1.5);
    positionWorldCamera(camera, ORIGIN, 1.3);
    const before = camera.position.clone();
    positionWorldCamera(camera, ORIGIN, 1.3, Math.PI, 0);
    expect(camera.position.x).toBeCloseTo(-before.x, 5);
    expect(camera.position.z).toBeCloseTo(-before.z, 5);
    expect(camera.position.y).toBeCloseTo(before.y, 5);
    for (const tilt of [-10, 10]) {
      positionWorldCamera(camera, ORIGIN, 1.3, 0.5, tilt);
      expect(camera.position.y).toBeGreaterThan(3);
      expect(Math.hypot(camera.position.x, camera.position.z)).toBeGreaterThan(2);
    }
    for (const angle of [0.6, 2.1, 4]) {
      const player = { x: 25, z: 27 };
      const boss = { x: -4, z: -8 };
      positionEncounterCamera(camera, player, boss, 1.3, angle, 0.2);
      for (const actor of [player, boss]) {
        const point = new Vector3(actor.x, 1, actor.z).project(camera);
        expect(Math.abs(point.x)).toBeLessThan(0.9);
        expect(Math.abs(point.y)).toBeLessThan(0.9);
      }
    }
  });
  it('el encuentro conserva la orientación de exploración y encuadra también a quien termina lejos del jefe', () => {
    for (const aspect of [1440 / 900, 390 / 844, 2525 / 841]) {
      for (const player of [{ x: 29, z: 28 }, { x: -29, z: -26 }, { x: -2, z: 0 }]) {
        for (const zoom of [0.7, 1.3, 3.2]) {
          const boss = { x: -4, z: -8 };
          const camera = createWorldCamera(aspect);
          positionEncounterCamera(camera, player, boss, zoom);
          expect(camera.position.x).toBeGreaterThan((player.x + boss.x) / 2);
          expect(camera.position.z).toBeGreaterThan((player.z + boss.z) / 2);
          const direction = camera.getWorldDirection(new Vector3());
          expect(direction.x / direction.z).toBeCloseTo(0.54, 4);
          expect(direction.y / direction.z).toBeCloseTo(0.76, 4);
          for (const actor of [{ ...player, width: 0.6, height: 2, depth: 0.6 }, { ...boss, width: 2.7, height: 5, depth: 1.3 }]) {
            for (const x of [-actor.width, actor.width]) for (const y of [0, actor.height]) for (const z of [-actor.depth, actor.depth]) {
              const point = new Vector3(actor.x + x, y, actor.z + z).project(camera);
              expect(Math.abs(point.x)).toBeLessThanOrEqual(0.88001);
              expect(Math.abs(point.y)).toBeLessThanOrEqual(0.76001);
            }
          }
          const midpoint = new Vector3((player.x + boss.x) / 2, 1.5, (player.z + boss.z) / 2).project(camera);
          expect(midpoint.x).toBeCloseTo(0, 5);
          expect(midpoint.y).toBeCloseTo(0, 5);
        }
      }
    }
  });
  it('mantiene el ángulo oblicuo al usar zoom y no aleja al jefe más de lo necesario', () => {
    const camera = createWorldCamera(1440 / 900);
    for (const zoom of [0.6, 1.3, 3.2]) {
      positionWorldCamera(camera, ORIGIN, zoom);
      const direction = camera.getWorldDirection(new Vector3());
      expect(direction.x).toBeLessThan(0);
      expect(direction.x / direction.z).toBeCloseTo(5.4 / 10.4, 5);
      expect(direction.y / direction.z).toBeCloseTo(7.6 / 10.4, 5);
    }
    positionEncounterCamera(camera, { x: -2, z: 0 }, { x: 0, z: -6 }, 1);
    const nearDistance = camera.position.distanceTo(new Vector3(-1, 1.5, -3));
    expect(nearDistance).toBeLessThan(23);
    positionEncounterCamera(camera, { x: -2, z: 0 }, { x: 0, z: -6 }, 3);
    expect(camera.position.distanceTo(new Vector3(-1, 1.5, -3))).toBeGreaterThan(nearDistance * 1.8);
  });
  it('desplaza el terreno en la dirección de pantalla del arrastre, también con la cámara oblicua', () => {
    for (const zoom of [0.7, 1.3, 2.6]) {
      const camera = createWorldCamera(1440 / 900);
      const focus = { x: 8, z: -3 };
      positionWorldCamera(camera, focus, zoom);
      camera.updateMatrixWorld(true);
      const original = new Vector3(focus.x, CAMERA_FOCUS_HEIGHT, focus.z).project(camera);
      for (const [dx, dy] of [[90, 0], [-90, 0], [0, 90], [0, -90]]) {
        positionWorldCamera(camera, focus, zoom);
        const pan = panWorldCamera(camera, { x: 2, z: -1 }, dx, dy, 900);
        positionWorldCamera(camera, { x: focus.x + pan.x - 2, z: focus.z + pan.z + 1 }, zoom);
        camera.updateMatrixWorld(true);
        const moved = new Vector3(focus.x, CAMERA_FOCUS_HEIGHT, focus.z).project(camera);
        if (dx) {
          expect((moved.x - original.x) * 720).toBeCloseTo(dx, 3);
          expect(moved.y).toBeCloseTo(original.y, 5);
        } else {
          expect(Math.sign(original.y - moved.y)).toBe(Math.sign(dy));
          expect(moved.x).toBeCloseTo(original.x, 5);
        }
      }
      expect(panWorldCamera(camera, focus, 0, 0, 0)).toEqual(focus);
    }
  });
  it('inicia más alejada y permite inspeccionar el mundo con zoom manual (corrección R1)', () => {
    const camera = createWorldCamera(1440 / 900);
    expect(DEFAULT_CAMERA_ZOOM).toBeGreaterThan(1.2);
    positionWorldCamera(camera, ORIGIN, DEFAULT_CAMERA_ZOOM);
    expect(projectedHeight(projectedBody(camera, ORIGIN))).toBeLessThan(0.15);
  });
  it('encuadra al jefe completo y al jugador durante el encuentro en escritorio y móvil (002/R15)', () => {
    for (const aspect of [1440 / 900, 390 / 844]) {
      const camera = createWorldCamera(aspect);
      const player = { x: -2, z: 2 };
      const boss = { x: 0, z: -5 };
      positionEncounterCamera(camera, player, boss, 1);
      expectBodyInFrame(projectedBody(camera, player));
      for (const x of [-2.6, 2.6]) {
        for (const y of [0, 5]) {
          for (const z of [-1.2, 1.2]) {
            expectBodyInFrame([new Vector3(boss.x + x, y, boss.z + z).project(camera)]);
          }
        }
      }
    }
  });
  for (const [width, height] of VIEWPORTS) {
    it(`encuadra el cuerpo completo entre el 12 % y el 18 % de la altura a ${width}×${height}`, () => {
      const camera = createWorldCamera(width / height);
      positionWorldCamera(camera, INITIAL_CHARACTER.position, 1);

      const body = projectedBody(camera, INITIAL_CHARACTER.position);
      const screenHeight = projectedHeight(body);

      expectBodyInFrame(body);
      expect(screenHeight).toBeGreaterThanOrEqual(0.12);
      expect(screenHeight).toBeLessThanOrEqual(0.18);
      expect(camera.aspect).toBeCloseTo(width / height, 6);
    });

    it(`mantiene el salto completo en pantalla a ${width}×${height}`, () => {
      const camera = createWorldCamera(width / height);
      positionWorldCamera(camera, ORIGIN, 1);
      let character = { ...INITIAL_CHARACTER, position: ORIGIN };
      const surface = { heightAt: () => 0, isInside: () => true };
      let maximumAltitude = 0;

      for (let frame = 0; frame < 90; frame++) {
        character = stepCharacter(
          character,
          { direction: ORIGIN, jump: frame === 0 },
          1 / 60,
          surface,
        );
        maximumAltitude = Math.max(maximumAltitude, character.altitude);
        expectBodyInFrame(projectedBody(camera, character.position, character.altitude));
      }

      expect(maximumAltitude).toBeGreaterThan(1);
      expect(character.grounded).toBeTrue();
    });
  }

  it('conserva la proporción y el cuerpo completo al pasar de escritorio a móvil y apaisado', () => {
    const camera = createWorldCamera(1440 / 900);
    positionWorldCamera(camera, ORIGIN, 1);
    const initial = projectedBody(camera, ORIGIN);
    const initialHeight = projectedHeight(initial);

    for (const aspect of [390 / 844, 844 / 390, 2525 / 841]) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const body = projectedBody(camera, ORIGIN);

      expectBodyInFrame(body);
      expect(projectedHeight(body)).toBeCloseTo(initialHeight, 6);
    }
  });

  it('aumenta la presencia al acercar el zoom y la reduce al alejarlo, conservando el cuerpo', () => {
    const camera = createWorldCamera(390 / 844);
    const heights = [0.6, 1, 1.9].map((zoom) => {
      positionWorldCamera(camera, ORIGIN, zoom);
      const body = projectedBody(camera, ORIGIN);
      expectBodyInFrame(body);
      return projectedHeight(body);
    });

    expect(heights[0]).toBeGreaterThan(heights[1]);
    expect(heights[1]).toBeGreaterThan(heights[2]);
  });

  it('conserva el encuadre del personaje cuando el foco se desplaza a otras zonas', () => {
    const camera = createWorldCamera(1440 / 900);
    positionWorldCamera(camera, ORIGIN, 1);
    const initial = projectedBody(camera, ORIGIN);

    for (const position of [{ x: 18, z: 13 }, { x: -18, z: -13 }, { x: 4, z: -20 }]) {
      positionWorldCamera(camera, position, 1);
      const body = projectedBody(camera, position);

      expectBodyInFrame(body);
      for (let index = 0; index < body.length; index++) {
        expect(body[index].x).toBeCloseTo(initial[index].x, 6);
        expect(body[index].y).toBeCloseTo(initial[index].y, 6);
        expect(body[index].z).toBeCloseTo(initial[index].z, 6);
      }
    }
  });

  it('mantiene al jugador visible durante el seguimiento existente al caminar en móvil', () => {
    const camera = createWorldCamera(390 / 844);
    const surface = { heightAt: () => 0, isInside: () => true };

    for (const direction of [{ x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 }]) {
      let character = { ...INITIAL_CHARACTER, position: ORIGIN };
      let eye = ORIGIN;

      for (let frame = 0; frame < 120; frame++) {
        character = stepCharacter(character, { direction, jump: false }, 1 / 60, surface);
        eye = followCamera(eye, character.position, 1 / 60);
        positionWorldCamera(camera, eye, 1);
        expectBodyInFrame(projectedBody(camera, character.position));
      }
    }
  });

  it('conserva la dirección visual de WASD y las flechas en escritorio y móvil', () => {
    for (const [width, height] of VIEWPORTS) {
      const camera = createWorldCamera(width / height);
      positionWorldCamera(camera, ORIGIN, 1);
      camera.updateMatrixWorld(true);
      const origin = new Vector3(0, 0, 0).project(camera);

      for (const key of ['w', 'arrowup', 's', 'arrowdown', 'a', 'arrowleft', 'd', 'arrowright']) {
        const direction = directionFromKeys(new Set([key]));
        const destination = new Vector3(direction.x, 0, direction.z).project(camera);

        if (direction.x !== 0) {
          expect(Math.sign(destination.x - origin.x)).withContext(key).toBe(direction.x);
        } else {
          expect(Math.sign(destination.y - origin.y)).withContext(key).toBe(-direction.z);
        }
      }
    }
  });
  it('gira a la derecha con yaw positivo y eleva la vista con elevación positiva (002/R1)', () => {
    const camera = createWorldCamera(1.6);
    positionWorldCamera(camera, new Vector3(0, 0, 0), 1, Math.PI / 2, 0);
    expect(camera.position.x).toBeCloseTo(10.4);
    expect(camera.position.z).toBeCloseTo(-5.4);
    const height = camera.position.y;
    positionWorldCamera(camera, new Vector3(0, 0, 0), 1, 0, 0.2);
    expect(camera.position.y).toBeGreaterThan(height);
  });

});
