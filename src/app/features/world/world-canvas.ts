import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  afterNextRender,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { Vector2 } from './model/vector2';
import { WorldZone } from './model/world-zone';
import { COMMAND_KEYS, directionFromDrag, directionFromKeys, ENTER_KEYS, JUMP_KEYS, MOVEMENT_KEYS, RECENTER_KEYS } from './logic/read-move-input';
import { SceneHandle } from './scene/scene-handle';

const DRAG_RADIUS = 90;

@Component({
  selector: 'app-world-canvas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #host class="canvas" (pointerdown)="startDrag($event)"></div>`,
  styles: `
    :host { position: absolute; inset: 0; }
    .canvas { width: 100%; height: 100%; touch-action: none; }
    .canvas ::ng-deep canvas { display: block; }
  `,
})
export class WorldCanvas implements OnDestroy {
  readonly zoneChange = output<WorldZone | null>();
  readonly ready = output<boolean>();
  /** 0..1 mientras bajan los modelos (R85). */
  readonly progress = output<number>();
  /** Vidas que quedan; `0` justo al reaparecer. */
  readonly health = output<number>();
  readonly hit = output<void>();
  /** Enter / E: el jugador quiere entrar a la zona activa. */
  readonly enter = output<void>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly zone = inject(NgZone);

  private scene?: SceneHandle;
  private destroyed = false;
  private readonly keys = new Set<string>();
  private dragOrigin: { x: number; y: number } | null = null;
  /** Punteros táctiles activos, para el pellizco. */
  private readonly touches = new Map<number, { x: number; y: number }>();
  private pinchStart: { distance: number; zoom: number } | null = null;

  constructor() {
    afterNextRender(() => void this.start());
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.detachInput();
    this.scene?.dispose();
  }

  private async start(): Promise<void> {
    const { createWorldScene } = await import('./scene/world-scene');
    if (this.destroyed) {
      return;
    }

    try {
      const scene = await this.zone.runOutsideAngular(() =>
        createWorldScene({
          host: this.host().nativeElement,
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
          lowPower: matchMedia('(max-width: 820px)').matches,
          onZoneChange: (found) => this.zone.run(() => this.zoneChange.emit(found)),
          onProgress: (ratio) => this.zone.run(() => this.progress.emit(ratio)),
          onHealth: (hp) => this.zone.run(() => this.health.emit(hp)),
          onHit: () => this.zone.run(() => this.hit.emit()),
        }),
      );
      /* Entre el await y aquí el usuario pudo navegar: si ya no estamos, se libera al momento. */
      if (this.destroyed) {
        scene.dispose();
        return;
      }
      this.scene = scene;
      this.attachInput();
      this.zone.run(() => this.ready.emit(true));
    } catch (error) {
      /* Se cae a la capa HTML (R83), pero el motivo tiene que verse: si no, se depura a ciegas. */
      console.error('[world] no se pudo montar la escena', error);
      this.zone.run(() => this.ready.emit(false));
    }
  }

  /** Botón de salto táctil (R87, R89). */
  jump(): void {
    this.scene?.jump();
  }

  /** El personaje se sienta a trabajar en el centro (lo pide la página al abrir la presentación). */
  sit(): void {
    this.scene?.sit();
  }

  stand(): void {
    this.scene?.stand();
  }

  private attachInput(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
  }

  private detachInput(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }

  protected startDrag(event: PointerEvent): void {
    this.scene?.armAudio();
    this.touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.touches.size === 2) {
      /* Segundo dedo: empieza el pellizco y se cancela el arrastre. */
      this.pinchStart = { distance: this.pinchDistance(), zoom: this.scene?.getZoom() ?? 1 };
      this.dragOrigin = null;
      this.push({ x: 0, z: 0 });
      return;
    }
    this.dragOrigin = { x: event.clientX, y: event.clientY };
  }

  private pinchDistance(): number {
    const [a, b] = [...this.touches.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }

  /** Botón táctil de comando. */
  runCommand(): void {
    this.scene?.armAudio();
    this.scene?.runCommand();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if (!MOVEMENT_KEYS.has(key)) {
      return;
    }
    event.preventDefault();
    this.scene?.armAudio();
    if (ENTER_KEYS.includes(key)) {
      this.zone.run(() => this.enter.emit());
      return;
    }
    if (COMMAND_KEYS.includes(key)) {
      this.scene?.runCommand();
      return;
    }
    if (JUMP_KEYS.includes(key)) {
      this.scene?.jump();
      return;
    }
    if (RECENTER_KEYS.includes(key)) {
      this.scene?.recenter();
      return;
    }
    this.keys.add(key);
    this.push(directionFromKeys(this.keys));
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key.toLowerCase());
    this.push(directionFromKeys(this.keys));
  };

  /** Al perder el foco se sueltan las teclas: si no, el muñeco se queda caminando solo. */
  private readonly onBlur = (): void => {
    this.keys.clear();
    this.push({ x: 0, z: 0 });
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.touches.has(event.pointerId)) {
      this.touches.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    if (this.pinchStart && this.touches.size === 2) {
      const ratio = this.pinchStart.distance / Math.max(this.pinchDistance(), 1);
      this.scene?.setZoom(this.pinchStart.zoom * ratio);
      return;
    }
    if (!this.dragOrigin) {
      return;
    }
    this.push(
      directionFromDrag(
        event.clientX - this.dragOrigin.x,
        event.clientY - this.dragOrigin.y,
        DRAG_RADIUS,
      ),
    );
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    this.touches.delete(event.pointerId);
    if (this.touches.size < 2) {
      this.pinchStart = null;
    }
    this.dragOrigin = null;
    this.push({ x: 0, z: 0 });
  };

  private push(direction: Vector2): void {
    this.scene?.setDirection(direction);
  }
}

