import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector2 as ThreeVector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { ArenaState, INITIAL_ARENA } from '../model/arena-state';
import { CharacterState } from '../model/character-state';
import { CompanionState } from '../model/companion-state';
import { HealthState, INITIAL_HEALTH, MAX_HP } from '../model/health-state';
import { Vector2 } from '../model/vector2';
import { WorldZone } from '../model/world-zone';
import { bugsOf, runCommand, stepArena } from '../logic/arena';
import { gitStepFor } from '../logic/git-steps';
import { blockedBySolids } from '../logic/blocked-by-solids';
import { buildDecorLayout, decorObstacles } from '../logic/decor-layout';
import { followCamera } from '../logic/follow-camera';
import { stepCompanion } from '../logic/follow-companion';
import { heal, takeHit, tickHealth } from '../logic/health';
import { nearestZone } from '../logic/nearest-zone';
import { resolveCircles } from '../logic/resolve-circles';
import { resolveCollisions } from '../logic/resolve-collisions';
import { INITIAL_CHARACTER, MAX_SPEED, speedOf, stepCharacter } from '../logic/step-character';
import { isInsideWorld, terrainHeightAt } from '../logic/terrain-height';
import { HEALTH_PICKUPS, TURRETS, WORLD_ZONES } from '../logic/world-zones';
import { buildAgentPool, buildBulletPool, buildCity, buildPickups, buildTurrets, MergeBurst, paintMachine } from './build-city';
import { BarkAudio } from './bark-audio';
import { TerminalBubble } from './terminal-bubble';
import { buildFloor } from './build-floor';
import { buildStations, buildWorkstation } from './build-stations';
import { CharacterAnimator, DEVELOPER_CLIPS, DOG_CLIPS } from './character-animator';
import { fit } from './fit';
import { cloneCharacter, loadAssets } from './load-assets';
import { PALETTE } from './palette';
import { SceneHandle } from './scene-handle';
import { disposeSharedGeometry, disposeVoxels } from './voxel';

export interface WorldSceneOptions {
  readonly host: HTMLElement;
  readonly reducedMotion: boolean;
  readonly lowPower: boolean;
  readonly onZoneChange: (zone: WorldZone | null) => void;
  readonly onProgress?: (ratio: number) => void;
  readonly onHealth?: (hp: number) => void;
  readonly onHit?: () => void;
}

const MAX_DELTA = 1 / 20;
const CAMERA_OFFSET = new Vector3(0, 15, 13);
const SEAT = { x: 0, z: 0.9 };
const SEAT_FACING = Math.PI;
const BULLET_HEIGHT = 0.6;
const PICKUP_RADIUS = 0.9;
const SURFACE = { heightAt: terrainHeightAt, isInside: isInsideWorld };
const LAYOUT = buildDecorLayout(WORLD_ZONES, TURRETS);
const SOLIDS = decorObstacles(LAYOUT);

/** Sudadera oscura, jeans y sin corbata: el hombre de traje del kit, vestido de desarrollador. */
const OUTFIT: Record<string, number | null> = {
  Shirt: 0x4fb0d6,
  Pants: 0x2a2f45,
  Details: 0x1c1c24,
  TieTexture: null,
};

export async function createWorldScene(options: WorldSceneOptions): Promise<SceneHandle> {
  const { host, reducedMotion, lowPower, onZoneChange, onProgress, onHealth, onHit } = options;

  const renderer = new WebGLRenderer({ antialias: !lowPower, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(PALETTE.background);
  scene.fog = new Fog(0x0e0e16, 40, 95);

  const camera = new PerspectiveCamera(48, 1, 0.5, 160);

  scene.add(new AmbientLight(PALETTE.light, 0.75));
  scene.add(new HemisphereLight(PALETTE.accentDeep, 0x05050a, 0.8));
  const key = new DirectionalLight(0xdfe3ff, 1.3);
  key.position.set(-18, 30, 12);
  key.castShadow = !lowPower;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -30; key.shadow.camera.right = 30;
  key.shadow.camera.top = 30; key.shadow.camera.bottom = -30;
  key.shadow.camera.far = 100;
  key.shadow.normalBias = 0.04;
  scene.add(key);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new ThreeVector2(1, 1), 0.5, 0.45, 0.85);
  bloom.enabled = !lowPower;
  composer.addPass(bloom);

  const resize = new ResizeObserver(() => {
    const width = host.clientWidth;
    const height = Math.max(host.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    bloom.resolution.set(width, height);
  });
  resize.observe(host);

  const library = await loadAssets(onProgress);

  scene.add(buildFloor(library));
  const city = buildCity(library, LAYOUT);
  scene.add(city.root);
  const stations = buildStations(WORLD_ZONES, library);
  stations.forEach((station) => scene.add(station.root));
  const workstation = buildWorkstation(library);
  workstation.position.set(SEAT.x, 0, SEAT.z);
  scene.add(workstation);

  const turrets = buildTurrets(library, TURRETS);
  turrets.forEach((rig) => scene.add(rig.root));
  const pickups = buildPickups(library, HEALTH_PICKUPS);
  pickups.forEach((pickup) => scene.add(pickup));
  const bulletPool = buildBulletPool(library, 40);
  bulletPool.forEach((bullet) => scene.add(bullet));
  const agentPool = buildAgentPool(8);
  agentPool.forEach((orb) => scene.add(orb));
  turrets.forEach((rig) => {
    scene.add(rig.badge, rig.glow);
    paintMachine(rig, 3);
  });

  const bursts = [new MergeBurst(), new MergeBurst(), new MergeBurst()];
  bursts.forEach((burst) => scene.add(burst.points));
  let nextBurst = 0;

  const terminal = new TerminalBubble();
  scene.add(terminal.sprite);
  const barks = new BarkAudio();
  let nextBark = 3;

  const hero = dressDeveloper(fit(cloneCharacter(library.developer), { height: 1.8 }));
  scene.add(hero);
  const heroAnimator = new CharacterAnimator(hero, library.developer.clips, DEVELOPER_CLIPS, MAX_SPEED);

  const dogs = [0.62, 0.42].map((height, i) => {
    const model = fit(cloneCharacter(library.dog), { height });
    scene.add(model);
    return {
      model,
      animator: new CharacterAnimator(model, library.dog.clips, DOG_CLIPS, 6),
      slot: { distance: 1.6 + i * 0.7, angle: i === 0 ? 0.7 : -0.7 },
      state: { position: { x: -1 - i, z: 3 + i }, facing: 0, speed: 0 } as CompanionState,
    };
  });

  const lantern = new PointLight(PALETTE.light, 6, 8, 2);
  scene.add(lantern);

  let character: CharacterState = INITIAL_CHARACTER;
  let arena: ArenaState = INITIAL_ARENA;
  let health: HealthState = INITIAL_HEALTH;
  let direction: Vector2 = { x: 0, z: 0 };
  let jumpRequested = false;
  let eye: Vector2 = { ...character.position };
  let activeZone: WorldZone | null = null;
  let elapsed = 0;
  let last = 0;
  const target = new Vector3();
  const collected = new Set<number>();

  onHealth?.(health.hp);

  renderer.setAnimationLoop((time) => {
    const delta = last === 0 ? 1 / 60 : Math.min((time - last) / 1000, MAX_DELTA);
    last = time;
    elapsed += delta;

    if (!heroAnimator.isSeated) {
      const stepped = stepCharacter(character, { direction, jump: jumpRequested }, delta, SURFACE);
      const clear = resolveCircles(resolveCollisions(stepped.position, WORLD_ZONES), SOLIDS);
      character = { ...stepped, position: clear };
    }
    jumpRequested = false;

    runArena(delta);
    runPickups(delta);
    placeCharacter(delta);
    runDogs(delta);
    placeCamera(delta);
    reportZone();
    pulseStations();
    hoverDrones();

    composer.render();
  });

  function runArena(delta: number): void {
      const step = stepArena(
      arena,
      TURRETS,
      { position: character.position, altitude: character.altitude },
      elapsed,
      delta,
      (position) => blockedBySolids(position, WORLD_ZONES, SOLIDS),
    );
    arena = step.state;
    for (const id of step.patched) {
      const rig = turrets.find((one) => one.turret.id === id);
      if (rig) {
        const left = bugsOf(arena, rig.turret);
        paintMachine(rig, left);
        if (left <= 0) {
          bursts[nextBurst++ % bursts.length].fire(rig.turret.position.x, 1.2, rig.turret.position.z);
        }
      }
    }
    bursts.forEach((burst) => burst.update(delta));
    health = tickHealth(health, delta);

    if (step.hit && !heroAnimator.isSeated) {
      const outcome = takeHit(health);
      const changed = outcome.state !== health;
      health = outcome.state;
      if (changed) {
        onHit?.();
        onHealth?.(health.hp);
        if (outcome.respawn) {
          character = { ...INITIAL_CHARACTER };
          eye = { ...character.position };
        } else {
          /* Empujón: el golpe te saca de la línea de tiro. */
          const kick = { x: character.velocity.x * -1.4 || 2, z: character.velocity.z * -1.4 || 2 };
          character = { ...character, velocity: kick };
        }
      }
    }

    /* Las torretas giran hacia ti; las balas del estado se pintan con la reserva. */
    turrets.forEach((rig) => {
      const dx = character.position.x - rig.turret.position.x;
      const dz = character.position.z - rig.turret.position.z;
      if (bugsOf(arena, rig.turret) > 0 && Math.hypot(dx, dz) <= rig.turret.range) {
        rig.root.rotation.y = Math.atan2(dx, dz);
      }
      rig.badge.lookAt(camera.position);
    });
    agentPool.forEach((orb, i) => {
      const agent = arena.agents[i];
      orb.visible = Boolean(agent);
      if (agent) {
        orb.position.set(agent.position.x, 1.2 + Math.sin(elapsed * 9 + i) * 0.15, agent.position.z);
        orb.rotation.y = elapsed * 3;
      }
    });
    terminal.sprite.position.set(character.position.x, character.altitude + 2.6, character.position.z);
    terminal.update(delta);
    bulletPool.forEach((bug, i) => {
      const bullet = arena.bullets[i];
      bug.visible = Boolean(bullet);
      if (bullet) {
        bug.position.set(bullet.position.x, BULLET_HEIGHT, bullet.position.z);
        bug.rotation.y = Math.atan2(bullet.velocity.x, bullet.velocity.z);
        bug.rotation.x = elapsed * 9 + i;
      }
    });
    hero.visible = health.invulnerable <= 0 || Math.floor(elapsed * 14) % 2 === 0;
  }

  function runPickups(delta: number): void {
    pickups.forEach((pickup, i) => {
      if (collected.has(i)) {
        return;
      }
      pickup.rotation.y += delta * 1.6;
      pickup.position.y = 0.45 + Math.sin(elapsed * 2 + i) * 0.12;
      const reach = Math.hypot(pickup.position.x - character.position.x, pickup.position.z - character.position.z);
      if (reach < PICKUP_RADIUS && health.hp < MAX_HP) {
        collected.add(i);
        pickup.visible = false;
        health = heal(health, MAX_HP);
        onHealth?.(health.hp);
      }
    });
  }

  function placeCharacter(delta: number): void {
    hero.position.set(character.position.x, character.altitude, character.position.z);
    hero.rotation.y = shortestTurn(hero.rotation.y, character.facing, delta);
    heroAnimator.update(delta, heroAnimator.isSeated ? 0 : speedOf(character), character.grounded);
    lantern.position.set(character.position.x + 1, character.altitude + 3, character.position.z + 1);
  }

  function runDogs(delta: number): void {
    /* Ladran de vez en cuando cuando están cerca; el pequeño más agudo. */
    if (elapsed >= nextBark) {
      nextBark = elapsed + 4 + (Math.sin(elapsed * 3.1) + 1) * 3;
      dogs.forEach((dog, i) => barks.bark(i === 0 ? 0.95 : 1.35, 0.45));
    }
    for (const dog of dogs) {
      dog.state = stepCompanion(dog.state, character.position, character.facing, dog.slot, delta);
      dog.model.position.set(dog.state.position.x, 0, dog.state.position.z);
      dog.model.rotation.y = shortestTurn(dog.model.rotation.y, dog.state.facing, delta);
      dog.animator.update(delta, dog.state.speed, true);
    }
  }

  function placeCamera(delta: number): void {
    eye = followCamera(eye, character.position, delta);
    camera.position.set(eye.x + CAMERA_OFFSET.x, CAMERA_OFFSET.y, eye.z + CAMERA_OFFSET.z);
    target.set(eye.x, 1.2, eye.z);
    camera.lookAt(target);
  }

  function reportZone(): void {
    const found = nearestZone(character.position, WORLD_ZONES);
    if (found?.id !== activeZone?.id) {
      activeZone = found;
      onZoneChange(found);
    }
  }

  function pulseStations(): void {
    stations.forEach((station) => {
      const active = station.zoneId === activeZone?.id;
      station.light.intensity += ((active ? 6 : 2.5) - station.light.intensity) * 0.1;
      station.hologram.position.y = 3.4 + (reducedMotion ? 0 : Math.sin(elapsed * 1.6) * 0.08);
      station.hologram.lookAt(camera.position);
    });
  }

  function hoverDrones(): void {
    city.drones.forEach((drone, i) => {
      const angle = drone.angle + (reducedMotion ? 0 : elapsed * 0.12);
      drone.root.position.x = Math.cos(angle) * 17;
      drone.root.position.z = Math.sin(angle) * 17;
      drone.root.position.y = 4 + Math.sin(elapsed * 1.3 + i) * 0.3;
      drone.root.rotation.y = -angle;
    });
  }

  return {
    setDirection: (next) => { direction = next; },
    jump: () => { jumpRequested = true; },
    recenter: () => { eye = { ...character.position }; },
    runCommand: () => {
      if (heroAnimator.isSeated) {
        return;
      }
      const result = runCommand(arena, TURRETS, character.position);
      /* El comando corresponde al paso de git en el que va la máquina (antes de que llegue el agente). */
      const command = result.target ? gitStepFor(result.target.id, bugsOf(arena, result.target)).command : 'git status  # sin bugs en rango';
      arena = result.state;
      terminal.type(command);
    },
    armAudio: () => barks.arm(),
    sit: () => {
      direction = { x: 0, z: 0 };
      character = { ...INITIAL_CHARACTER, position: { ...SEAT }, facing: SEAT_FACING };
      heroAnimator.sit();
    },
    stand: () => heroAnimator.stand(),
    dispose: () => {
      renderer.setAnimationLoop(null);
      resize.disconnect();
      heroAnimator.dispose();
      dogs.forEach((dog) => dog.animator.dispose());
      disposeVoxels(scene);
      disposeSharedGeometry();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

function dressDeveloper(model: Object3D): Object3D {
  model.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) {
      return;
    }
    for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      const color = OUTFIT[material.name];
      if (color === null) {
        material.visible = false;
      } else if (color !== undefined) {
        (material as MeshStandardMaterial).color?.set(color);
      }
    }
  });
  return model;
}

function shortestTurn(current: number, wanted: number, delta: number): number {
  const difference = Math.atan2(Math.sin(wanted - current), Math.cos(wanted - current));
  return current + difference * Math.min(1, delta * 12);
}
