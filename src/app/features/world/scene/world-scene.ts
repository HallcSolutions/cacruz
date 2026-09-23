import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Mesh,
  Sprite,
  PCFShadowMap,
  PMREMGenerator,
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
import { blockedBySolids } from '../logic/blocked-by-solids';
import { stepMachines } from '../logic/machine-motion';
import { machineObstacles } from '../logic/machine-obstacles';
import { buildDecorLayout, decorObstacles } from '../logic/decor-layout';
import { followCamera } from '../logic/follow-camera';
import { stepCompanion } from '../logic/follow-companion';
import { heal, takeHit, tickHealth } from '../logic/health';
import { nearestZone } from '../logic/nearest-zone';
import { resolveCircles } from '../logic/resolve-circles';
import { resolveCollisions } from '../logic/resolve-collisions';
import { INITIAL_CHARACTER, speedOf, stepCharacter } from '../logic/step-character';
import { isInsideWorld, terrainHeightAt } from '../logic/terrain-height';
import { HEALTH_PICKUPS, TURRETS, WORLD_ZONES } from '../logic/world-zones';
import { buildAgentPool, buildBulletPool, buildCity, buildPickups, buildTurrets, MergeBurst, paintMachine } from './build-city';
import { WorldAudio } from './world-audio';
import { WorldSceneOptions } from '../model/world-scene-options';
import { activateDebtEncounter } from '../logic/activate-debt-encounter';
import { launchCompanionPower } from '../logic/companion-power';
import { createDebtEncounter, startDebtEncounter, advanceDebtEncounter, analyzeDebtEncounter, refactorDebtEncounter, supportDebtEncounter } from '../logic/debt-encounter';
import { DebtMonsterView } from './debt-monster-view';
import { TerminalBubble } from './terminal-bubble';
import { buildFloor } from './build-floor';
import { buildStations, buildWorkstation } from './build-stations';
import { buildDeveloper, buildCompanion } from './build-world-cast';
import { poseDeveloper, poseCompanion } from './pose-world-cast';
import { poseThoughtBolt } from './build-thought-bolt';
import { disposeModel } from './dispose-model';
import { loadAssets } from './load-assets';
import { PALETTE } from './palette';
import { SceneHandle } from './scene-handle';
import { CAMERA_FOCUS_HEIGHT, DEFAULT_CAMERA_ZOOM, createWorldCamera, panWorldCamera, positionWorldCamera, positionEncounterCamera } from './world-camera';


const MAX_DELTA = 1 / 20;
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 3.2;
const SEAT = { x: 0, z: 0.9 };
const SEAT_FACING = Math.PI;
const BULLET_HEIGHT = 0.6;
const PICKUP_RADIUS = 0.9;
const SURFACE = { heightAt: terrainHeightAt, isInside: isInsideWorld };
const LAYOUT = buildDecorLayout(WORLD_ZONES, TURRETS);
const SOLIDS = decorObstacles(LAYOUT);


export async function createWorldScene(options: WorldSceneOptions): Promise<SceneHandle> {
  const { host, reducedMotion, lowPower, onZoneChange, onProgress, onHealth, onHit, onCombat } = options;

  const renderer = new WebGLRenderer({ antialias: !lowPower, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
  renderer.shadowMap.enabled = !lowPower;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(PALETTE.background);
  const fog = new Fog(0x0e0e16, 40, 95);
  scene.fog = fog;

  const environment = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  scene.environmentIntensity = 0.4;
  environment.dispose();
  pmrem.dispose();
  const camera = createWorldCamera(1);

  scene.add(new AmbientLight(0xb6bed0, 0.28));
  scene.add(new HemisphereLight(0x9baed3, 0x252127, 0.65));
  const key = new DirectionalLight(0xe9edff, 3.2);
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
  const occlusion = new GTAOPass(scene, camera, 1, 1);
  occlusion.enabled = !lowPower;
  occlusion.blendIntensity = 0.8;
  occlusion.updateGtaoMaterial({ radius: 0.5, thickness: 1, distanceFallOff: 0.8, samples: 8 });
  composer.addPass(occlusion);
  const bloom = new UnrealBloomPass(new ThreeVector2(1, 1), 0.1, 0.2, 2);
  bloom.enabled = !lowPower;
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const rimLight = new DirectionalLight(0x8eb4dc, 0.7);
  rimLight.position.set(12, 8, -18);
  scene.add(rimLight);

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
  const audio = new WorldAudio();
  const monster = new DebtMonsterView();
  scene.add(monster.root);
  const debtPulsePool = buildAgentPool(3);
  debtPulsePool.forEach(pulse => scene.add(pulse));

  const hero = buildDeveloper();
  scene.add(hero);
  let seated = false;
  const dogs = [0, 1].map((index) => {
    const model = buildCompanion(index);
    scene.add(model);
    return {
      model,
      slot: { distance: 1.15 + index * 0.3, angle: index === 0 ? 0.85 : -0.85 },
      state: { position: { x: -1 - index, z: 3 + index }, facing: 0, speed: 0 } as CompanionState,
    };
  });

  let character: CharacterState = INITIAL_CHARACTER;
  let arena: ArenaState = INITIAL_ARENA;
  let machines = [...TURRETS];
  let health: HealthState = { ...INITIAL_HEALTH, invulnerable: 3 };
  let encounter = createDebtEncounter();
  let supportReadyAt = [0, 0];
  let commandReadyAt = 0;
  let readingUntil = 0;
  let paused = false;
  let combatKey = '';
  const recoil = new Map<string, number>();
  let debtPulses: { from: Vector2; age: number; support: boolean }[] = [];
  let direction: Vector2 = { x: 0, z: 0 };
  let jumpRequested = false;
  let eye: Vector2 = { ...character.position };
  let zoom = DEFAULT_CAMERA_ZOOM;
  let cameraYaw = 0;
  let cameraElevation = 0;
  /* Desplazamiento manual de la cámara (dos dedos). Se deshace al caminar o con C. */
  let pan: Vector2 = { x: 0, z: 0 };
  let activeZone: WorldZone | null = null;
  let elapsed = 0;
  let last = 0;
  const target = new Vector3();
  // El pase de normales no interpreta el alfa de sprites y hologramas.
  const transparentObjects: (Mesh | Sprite)[] = [];
  scene.traverse(object => {
    if (object instanceof Sprite || object instanceof Mesh && (Array.isArray(object.material) ? object.material : [object.material]).some(material => material.transparent)) transparentObjects.push(object);
  });
  const renderOcclusion = occlusion.render.bind(occlusion);
  occlusion.render = (...args) => {
    const visibility = transparentObjects.map(object => object.visible);
    transparentObjects.forEach(object => { object.visible = false; });
    try { renderOcclusion(...args); }
    finally { transparentObjects.forEach((object, index) => { object.visible = visibility[index]; }); }
  };
  const collected = new Set<number>();

  onHealth?.(health.hp);

  const visibilityChanged = () => audio.setPaused(paused || document.hidden);
  document.addEventListener('visibilitychange', visibilityChanged);
  renderer.setAnimationLoop((time) => {
    const delta = last === 0 ? 1 / 60 : Math.min((time - last) / 1000, MAX_DELTA);
    last = time;
    if (paused || document.hidden) return;
    elapsed += delta;

    if (!seated && encounter.phase !== 'player-defeated') {
      const cameraDirection = { x: direction.x * Math.cos(cameraYaw) + direction.z * Math.sin(cameraYaw), z: direction.z * Math.cos(cameraYaw) - direction.x * Math.sin(cameraYaw) };
      const stepped = stepCharacter(character, { direction: cameraDirection, jump: jumpRequested }, delta, SURFACE);
      const clear = resolveCircles(resolveCollisions(stepped.position, WORLD_ZONES), [...SOLIDS, ...machineObstacles(machines, encounter)]);
      character = { ...stepped, position: clear };
    }
    jumpRequested = false;

    runArena(delta);
    runPickups(delta);
    placeCharacter(delta);
    runDogs(delta);
    placeCamera(delta);
    reportZone();
    reportCombat();
    pulseStations();
    hoverDrones();

    composer.render();
  });

  function runArena(delta: number): void {
    health = tickHealth(health, delta);
    bursts.forEach(burst => burst.update(delta));
    terminal.sprite.position.set(character.position.x, character.altitude + 2.6, character.position.z);
    terminal.update(delta);
    if (encounter.phase === 'inactive') {
      machines = stepMachines(machines, arena, character.position, elapsed, delta, position => !isInsideWorld(position.x, position.z) || blockedBySolids(position, WORLD_ZONES, SOLIDS));
      const step = stepArena(arena, machines, character, elapsed, delta,
        position => blockedBySolids(position, WORLD_ZONES, SOLIDS));
      arena = step.state;
      step.shots.forEach(turret => recoil.set(turret.id, elapsed));
      for (const id of step.patched) {
        const rig = turrets.find(one => one.turret.id === id)!;
        const left = bugsOf(arena, rig.turret);
        paintMachine(rig, left);
        audio.play(left <= 0 ? 'merge' : 'impact');
        const machine = machines.find(one => one.id === id)!;
        bursts[nextBurst++ % bursts.length].fire(machine.position.x, 1, machine.position.z);
      }
      if (activateDebtEncounter(encounter.phase, arena, machines) === 'appearing') {
        arena = { ...arena, bullets: [], agents: [] };
        encounter = startDebtEncounter(encounter);
        audio.play('slam');
      } else if (step.hit && !seated) applyHit();
    } else {
      const before = encounter.phase;
      const step = advanceDebtEncounter(encounter, character, delta,
        position => !isInsideWorld(position.x, position.z) || blockedBySolids(position, WORLD_ZONES, SOLIDS));
      encounter = step.state;
      if (step.hit) applyHit();
      if (before !== 'attacking' && encounter.phase === 'attacking') audio.play('slam');
      if (step.corrected) {
        audio.play(encounter.hp === 0 ? 'merge' : 'impact');
        bursts[nextBurst++ % bursts.length].fire(encounter.position.x, 2.6, encounter.position.z);
      }
    }
    if (!seated) character = { ...character, position: resolveCircles(character.position, [...SOLIDS, ...machineObstacles(machines, encounter)]) };
    turrets.forEach(rig => {
      const machine = machines.find(one => one.id === rig.turret.id)!;
      const speed = Math.hypot(machine.position.x - rig.root.position.x, machine.position.z - rig.root.position.z) / delta;
      rig.root.position.set(machine.position.x, 0, machine.position.z);
      rig.badge.position.set(machine.position.x, 2.1, machine.position.z);
      rig.glow.position.set(machine.position.x, 1.6, machine.position.z);
      const dx = character.position.x - machine.position.x;
      const dz = character.position.z - machine.position.z;
      if (bugsOf(arena, rig.turret) > 0) {
        if (Math.hypot(dx, dz) <= rig.turret.range) rig.root.rotation.y = Math.atan2(dx, dz);
        for (let i = 0; i < 4; i++) {
          const leg = rig.root.getObjectByName(`machine-leg-${i}`) ?? rig.root.getObjectByName(`spider-leg-${i}`);
          if (leg) leg.rotation.x = Math.sin(elapsed * 7 + (i % 2) * Math.PI) * Math.min(speed, 1.5) * 0.3;
        }
        rig.root.getObjectByName('machine-head')!.position.z = -Math.max(0, 0.14 - (elapsed - (recoil.get(rig.turret.id) ?? -1)) * 0.65);
      }
      rig.badge.lookAt(camera.position);
    });
    agentPool.forEach((orb, index) => {
      const agent = arena.agents[index];
      orb.visible = Boolean(agent);
      if (agent) {
        const support = agent.source === 'companion';
        orb.position.set(agent.position.x, support ? 0.45 : 1.2, agent.position.z);
        poseThoughtBolt(orb, elapsed, support);
        const to = machines.find(t => t.id === agent.targetId)!.position;
        orb.rotation.y = Math.atan2(to.x - agent.position.x, to.z - agent.position.z);
      }
    });
    bulletPool.forEach((bolt, index) => {
      const bullet = (encounter.phase === 'inactive' ? arena.bullets : encounter.projectiles)[index];
      bolt.visible = Boolean(bullet);
      if (bullet) {
        bolt.position.set(bullet.position.x, BULLET_HEIGHT, bullet.position.z);
        bolt.rotation.y = Math.atan2(bullet.velocity.x, bullet.velocity.z);
      }
    });
    debtPulses = debtPulses.filter(pulse => pulse.age < 0.45);
    debtPulsePool.forEach((mesh, index) => {
      const pulse = debtPulses[index];
      mesh.visible = Boolean(pulse);
      if (!pulse) return;
      pulse.age += delta;
      const t = Math.min(1, pulse.age / 0.45);
      const startHeight = pulse.support ? 0.45 : 1.2;
      mesh.position.set(pulse.from.x + (encounter.position.x - pulse.from.x) * t, startHeight + t * (2.7 - startHeight), pulse.from.z + (encounter.position.z - pulse.from.z) * t);
      mesh.lookAt(encounter.position.x, 2.7, encounter.position.z);
      poseThoughtBolt(mesh, elapsed, pulse.support);
      if (t === 1 && pulse.support) encounter = supportDebtEncounter(encounter);
    });
    monster.update(encounter, character.position, elapsed, delta);
    // Un impacto sigue siendo legible sin hacer desaparecer al protagonista.
    hero.visible = true;
  }

  function applyHit(): void {
    const outcome = takeHit(health);
    if (outcome.state === health) return;
    health = outcome.state;
    audio.play('impact');
    onHit?.();
    if (outcome.respawn && encounter.phase !== 'inactive') {
      health = { hp: 0, invulnerable: 0 };
      encounter = { ...encounter, phase: 'player-defeated', correctionIn: null, projectiles: [] };
      debtPulses = [];
      direction = { x: 0, z: 0 };
    } else if (outcome.respawn) {
      character = { ...INITIAL_CHARACTER };
      eye = { ...character.position };
    }
    onHealth?.(health.hp);
  }

  function reportCombat(): void {
    const patched = machines.filter(turret => bugsOf(arena, turret) === 0).length;
    const supportReady = supportReadyAt.map(time => elapsed >= time);
    const message = encounter.phase === 'inactive' ? 'world.objective'
      : encounter.phase === 'defeated' ? 'world.victory'
      : encounter.phase === 'player-defeated' ? 'world.defeat'
      : encounter.phase === 'telegraphing' ? 'world.dodge'
      : encounter.phase === 'appearing' ? 'world.appearing'
      : !encounter.analyzed ? 'world.scanHint'
      : Math.hypot(character.position.x - encounter.position.x, character.position.z - encounter.position.z) > 9 ? 'world.approach'
      : encounter.phase === 'recovering' ? 'world.refactorHint' : 'world.waitOpening';
    const view = { patched, total: machines.length, phase: encounter.phase, hp: encounter.hp, analyzed: encounter.analyzed, supportReady, message,
      player: { x: Math.round(character.position.x), z: Math.round(character.position.z) },
      remaining: machines.filter(turret => bugsOf(arena, turret) > 0).map(turret => ({ x: Math.round(turret.position.x), z: Math.round(turret.position.z) })),
    };
    const key = JSON.stringify(view);
    if (key !== combatKey) { combatKey = key; onCombat?.(view); }
  }

  function runPickups(delta: number): void {
    if (encounter.phase === 'player-defeated') return;
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
    poseDeveloper(hero, elapsed, seated ? 0 : speedOf(character), character.grounded, seated, Math.max(0, Math.min(1, (readingUntil - elapsed) / 0.8)));
  }

  function runDogs(delta: number): void {
    for (const dog of dogs) {
      dog.state = stepCompanion(dog.state, character.position, character.facing, dog.slot, delta, [...SOLIDS, ...machineObstacles(machines, encounter)]);
      dog.model.position.set(dog.state.position.x, 0, dog.state.position.z);
      dog.model.rotation.y = shortestTurn(dog.model.rotation.y, dog.state.facing, delta);
      poseCompanion(dog.model, elapsed, dog.state.speed);
    }
  }

  function placeCamera(delta: number): void {
    eye = followCamera(eye, character.position, delta);
    if (speedOf(character) > 0.4) {
      pan = followCamera(pan, { x: 0, z: 0 }, delta, 0.5);
    }
    const focusX = eye.x + pan.x;
    const focusZ = eye.z + pan.z;
    target.set(focusX, CAMERA_FOCUS_HEIGHT, focusZ);
    if (encounter.phase !== 'inactive') positionEncounterCamera(camera, { x: character.position.x + pan.x, z: character.position.z + pan.z }, { x: encounter.position.x + pan.x, z: encounter.position.z + pan.z }, zoom, cameraYaw, cameraElevation);
    else positionWorldCamera(camera, target, zoom, cameraYaw, cameraElevation);
    fog.near = Math.max(40, camera.position.y * 1.7);
    fog.far = fog.near + 55;
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
      station.light.intensity += ((active ? 0.7 : 0.2) - station.light.intensity) * 0.1;
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
    recenter: () => {
      eye = { ...character.position };
      pan = { x: 0, z: 0 };
      cameraYaw = 0;
      cameraElevation = 0;
    },
    orbitByPixels: (dx, dy) => {
      cameraYaw -= dx * 0.006;
      cameraElevation = Math.max(-0.28, Math.min(0.65, cameraElevation + dy * 0.004));
    },
    panByPixels: (dx, dy, viewportHeight) => {
      pan = panWorldCamera(camera, pan, dx, dy, viewportHeight);
    },
    setZoom: (factor) => { zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, factor)); },
    getZoom: () => zoom,
    runCommand: () => {
      if (seated || paused || encounter.phase === 'player-defeated') return;
      if (encounter.phase !== 'inactive') {
        const next = refactorDebtEncounter(encounter, character.position);
        if (next === encounter) return;
        encounter = next;
        readingUntil = elapsed + 0.8;
        character = { ...character, facing: Math.atan2(encounter.position.x - character.position.x, encounter.position.z - character.position.z) };
        debtPulses = [{ from: { ...character.position }, age: 0, support: false }];
        dogs.forEach((dog, index) => {
          if (elapsed < supportReadyAt[index] || Math.hypot(dog.state.position.x - encounter.position.x, dog.state.position.z - encounter.position.z) > 10) return;
          debtPulses.push({ from: { ...dog.state.position }, age: 0, support: true });
          supportReadyAt[index] = elapsed + 2.4;
        });
        audio.play('pulse');
        return;
      }
      if (elapsed < commandReadyAt) return;
      const result = runCommand(arena, machines, character.position);
      if (!result.target) return;
      readingUntil = elapsed + 0.8;
      commandReadyAt = elapsed + 0.6;
      character = { ...character, facing: Math.atan2(result.target.position.x - character.position.x, result.target.position.z - character.position.z) };
      const supported = launchCompanionPower(result.state, result.target, dogs.map(dog => dog.state.position), supportReadyAt, elapsed);
      arena = supported.arena;
      supportReadyAt = supported.readyAt;
      terminal.type('read() → understand() → refactor()');
      audio.play('pulse');
    },
    analyze: () => {
      if (paused) return;
      readingUntil = elapsed + 1.2;
      const next = analyzeDebtEncounter(encounter);
      if (next !== encounter) { encounter = next; audio.play('scan'); }
    },
    retry: () => {
      if (encounter.phase !== 'player-defeated' && encounter.phase !== 'defeated') return;
      encounter = startDebtEncounter(createDebtEncounter());
      character = { ...INITIAL_CHARACTER, position: { x: -2, z: -1 }, facing: Math.PI };
      eye = { ...character.position };
      health = { ...INITIAL_HEALTH, invulnerable: 2 };
      supportReadyAt = [0, 0];
      debtPulses = [];
      onHealth?.(health.hp);
    },
    setPaused: (value) => { paused = value; direction = { x: 0, z: 0 }; jumpRequested = false; visibilityChanged(); },
    setMuted: (value) => audio.setMuted(value),
    armAudio: () => audio.arm(),
    sit: () => {
      direction = { x: 0, z: 0 };
      character = { ...INITIAL_CHARACTER, position: { ...SEAT }, facing: SEAT_FACING };
      seated = true;
    },
    stand: () => { seated = false; },
    dispose: () => {
      renderer.setAnimationLoop(null);
      resize.disconnect();
      document.removeEventListener('visibilitychange', visibilityChanged);
      audio.dispose();
      monster.dispose();
      environmentMap.dispose();
      composer.passes.forEach(pass => pass.dispose());
      disposeModel(hero);
      dogs.forEach((dog) => disposeModel(dog.model));
      disposeModel(scene);
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

function shortestTurn(current: number, wanted: number, delta: number): number {
  const difference = Math.atan2(Math.sin(wanted - current), Math.cos(wanted - current));
  return current + difference * Math.min(1, delta * 12);
}
