import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SceneHandle } from './scene/scene-handle';
import { WorldCanvas } from './world-canvas';

describe('Controles de cámara (002/R1)', () => {
  let fixture: ComponentFixture<WorldCanvas>;
  let scene: jasmine.SpyObj<SceneHandle>;
  let surface: HTMLElement;

  beforeEach(() => {
    spyOn<any>(WorldCanvas.prototype, 'start').and.resolveTo();
    TestBed.configureTestingModule({ imports: [WorldCanvas] });
    fixture = TestBed.createComponent(WorldCanvas);
    fixture.detectChanges();
    surface = fixture.nativeElement.querySelector('.canvas');
    scene = jasmine.createSpyObj<SceneHandle>('scene', ['getZoom', 'setZoom', 'panByPixels', 'orbitByPixels', 'setDirection', 'recenter', 'armAudio', 'dispose']);
    scene.getZoom.and.returnValue(1.3);
    fixture.componentInstance['scene'] = scene;
    fixture.componentInstance['attachInput']();
  });

  afterEach(() => fixture.destroy());

  it('tolera usar los controles mientras la escena todavía está cargando', () => {
    fixture.componentInstance['scene'] = undefined;
    expect(() => {
      fixture.componentInstance.zoom(1.2);
      fixture.componentInstance.recenter();
      for (const button of [0, 2]) {
        fixture.componentInstance['startDrag'](new PointerEvent('pointerdown', { button, clientX: 100, clientY: 120 }));
        fixture.componentInstance['onPointerMove'](new PointerEvent('pointermove', { clientX: 130, clientY: 145 }));
      }
    }).not.toThrow();
  });

  it('reserva el arrastre táctil de un dedo para caminar', () => {
    surface.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', button: 0, clientX: 100, clientY: 120 }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 190, clientY: 120 }));
    expect(scene.panByPixels).not.toHaveBeenCalled();
    expect(scene.setDirection).toHaveBeenCalledWith({ x: 1, z: 0 });
  });

  it('gira con el arrastre izquierdo del mouse sin caminar, usando deltas sucesivos', () => {
    surface.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0, clientX: 100, clientY: 120 }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 140, clientY: 135 }));
    expect(scene.orbitByPixels).toHaveBeenCalledWith(40, 15);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 160, clientY: 125 }));
    expect(scene.orbitByPixels).toHaveBeenCalledWith(20, -10);
    expect(scene.panByPixels).not.toHaveBeenCalled();
    expect(scene.setDirection.calls.allArgs()).toEqual([[{ x: 0, z: 0 }]]);
    window.dispatchEvent(new PointerEvent('pointerup'));
    scene.orbitByPixels.calls.reset();
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 190, clientY: 160 }));
    expect(scene.orbitByPixels).not.toHaveBeenCalled();
  });

  it('la rueda cambia el zoom sin desplazar la página y centrar se delega a la escena', () => {
    const wheel = new WheelEvent('wheel', { deltaY: 100, cancelable: true });
    surface.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBeTrue();
    expect(scene.setZoom).toHaveBeenCalledWith(1.3 * Math.exp(0.15));
    fixture.componentInstance.recenter();
    expect(scene.recenter).toHaveBeenCalledTimes(1);
  });

  it('el arrastre derecho mueve solo la cámara y finaliza al soltar', () => {
    surface.dispatchEvent(new PointerEvent('pointerdown', { button: 2, clientX: 100, clientY: 120 }));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 135, clientY: 145 }));
    expect(scene.panByPixels).toHaveBeenCalledWith(35, 25, surface.clientHeight);
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 145, clientY: 170 }));
    expect(scene.panByPixels).toHaveBeenCalledWith(10, 25, surface.clientHeight);
    expect(scene.setDirection.calls.allArgs()).toEqual([[{ x: 0, z: 0 }]]);
    window.dispatchEvent(new PointerEvent('pointerup'));
    scene.panByPixels.calls.reset();
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 190, clientY: 190 }));
    expect(scene.panByPixels).not.toHaveBeenCalled();
  });

  it('perder el foco cancela el arrastre para que la cámara no quede pegada al puntero', () => {
    surface.dispatchEvent(new PointerEvent('pointerdown', { button: 2, clientX: 100, clientY: 120 }));
    scene.setDirection.calls.reset();
    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 190, clientY: 190 }));
    expect(scene.panByPixels).not.toHaveBeenCalled();
    expect(scene.setDirection).toHaveBeenCalledWith({ x: 0, z: 0 });
  });
});
