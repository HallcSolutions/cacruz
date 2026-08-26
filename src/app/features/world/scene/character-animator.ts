import { AnimationAction, AnimationClip, AnimationMixer, LoopOnce, Object3D } from 'three';

/**
 * Nombres de clip de cada modelo. Los opcionales pueden faltar: el animador se adapta
 * (sin `sitEnter`, sentarse es un fundido directo al bucle sentado, etc.).
 */
export interface ClipNames {
  readonly idle: string;
  readonly walk: string;
  readonly run: string;
  readonly jumpLoop?: string;
  readonly jumpLand?: string;
  readonly sitEnter?: string;
  readonly sitIdle?: string;
  readonly sitExit?: string;
}

/** El desarrollador de Quaternius (Animated Men Pack). */
export const DEVELOPER_CLIPS: ClipNames = {
  idle: 'HumanArmature|Man_Idle',
  walk: 'HumanArmature|Man_Walk',
  run: 'HumanArmature|Man_Run',
  jumpLoop: 'HumanArmature|Man_Jump',
  sitIdle: 'HumanArmature|Man_Sitting',
};

/** El perro de Quaternius. */
export const DOG_CLIPS: ClipNames = {
  idle: 'AnimalArmature|AnimalArmature|AnimalArmature|Idle',
  walk: 'AnimalArmature|AnimalArmature|AnimalArmature|Walk',
  run: 'AnimalArmature|AnimalArmature|AnimalArmature|Run',
  jumpLoop: 'AnimalArmature|AnimalArmature|AnimalArmature|Jump_Loop',
};

/**
 * Anima un personaje glTF. Quieto, andar y correr suenan a la vez y se mezclan por peso según
 * la velocidad (sin cortes al arrancar ni frenar). Salto y sentarse son estados aparte.
 */
export class CharacterAnimator {
  private readonly mixer: AnimationMixer;
  private readonly idle: AnimationAction;
  private readonly walk: AnimationAction;
  private readonly run: AnimationAction;
  private readonly jumpLoop: AnimationAction | null;
  private readonly jumpLand: AnimationAction | null;
  private readonly sitEnter: AnimationAction | null;
  private readonly sitIdle: AnimationAction | null;
  private readonly sitExit: AnimationAction | null;
  private seated = false;
  private airborne = false;

  constructor(root: Object3D, clips: readonly AnimationClip[], names: ClipNames, private readonly maxSpeed: number) {
    this.mixer = new AnimationMixer(root);
    const list = clips as AnimationClip[];
    const required = (name: string) => {
      const clip = AnimationClip.findByName(list, name);
      if (!clip) {
        throw new Error(`El modelo no trae la animación "${name}"`);
      }
      return this.mixer.clipAction(clip);
    };
    const optional = (name?: string) => {
      const clip = name ? AnimationClip.findByName(list, name) : null;
      return clip ? this.mixer.clipAction(clip) : null;
    };

    this.idle = required(names.idle);
    this.walk = required(names.walk);
    this.run = required(names.run);
    this.jumpLoop = optional(names.jumpLoop);
    this.jumpLand = optional(names.jumpLand);
    this.sitEnter = optional(names.sitEnter);
    this.sitIdle = optional(names.sitIdle);
    this.sitExit = optional(names.sitExit);

    for (const once of [this.sitEnter, this.sitExit, this.jumpLand]) {
      if (once) {
        once.setLoop(LoopOnce, 1);
        once.clampWhenFinished = true;
      }
    }

    this.idle.play();
    this.walk.play();
    this.run.play();
    this.applyLocomotion(0);

    this.mixer.addEventListener('finished', ({ action }) => {
      if (action === this.sitEnter && this.sitIdle) {
        this.sitEnter.crossFadeTo(this.sitIdle.reset(), 0.25, false);
        this.sitIdle.play();
      }
      if (action === this.sitExit) {
        this.sitExit.stop();
        this.resumeLocomotion();
      }
      if (action === this.jumpLand) {
        this.jumpLand.fadeOut(0.15);
      }
    });
  }

  get isSeated(): boolean {
    return this.seated;
  }

  update(delta: number, speed: number, grounded: boolean): void {
    if (!this.seated) {
      this.applyLocomotion(grounded ? speed : 0);
      if (!grounded && !this.airborne) {
        this.airborne = true;
        this.jumpLoop?.reset().fadeIn(0.12).play();
      }
      if (grounded && this.airborne) {
        this.airborne = false;
        this.jumpLoop?.fadeOut(0.12);
        this.jumpLand?.reset().fadeIn(0.1).play();
      }
    }
    this.mixer.update(delta);
  }

  sit(): void {
    if (this.seated || !this.sitIdle) {
      return;
    }
    this.seated = true;
    for (const motion of [this.idle, this.walk, this.run]) {
      motion.fadeOut(0.25);
    }
    if (this.sitEnter) {
      this.sitEnter.reset().fadeIn(0.25).play();
    } else {
      this.sitIdle.reset().fadeIn(0.3).play();
    }
  }

  stand(): void {
    if (!this.seated) {
      return;
    }
    this.seated = false;
    this.sitIdle?.fadeOut(0.2);
    this.sitEnter?.stop();
    if (this.sitExit) {
      this.sitExit.reset().fadeIn(0.2).play();
    } else {
      this.resumeLocomotion();
    }
  }

  dispose(): void {
    this.mixer.stopAllAction();
  }

  private resumeLocomotion(): void {
    this.idle.reset().fadeIn(0.3).play();
    this.walk.play();
    this.run.play();
  }

  private applyLocomotion(speed: number): void {
    const ratio = Math.min(speed / this.maxSpeed, 1);
    const walkWeight = ratio < 0.65 ? ratio / 0.65 : 1 - (ratio - 0.65) / 0.35;
    this.idle.setEffectiveWeight(Math.max(0, 1 - ratio / 0.65));
    this.walk.setEffectiveWeight(Math.max(0, walkWeight));
    this.run.setEffectiveWeight(Math.max(0, (ratio - 0.65) / 0.35));
    this.walk.timeScale = 0.9 + ratio * 0.5;
  }
}
