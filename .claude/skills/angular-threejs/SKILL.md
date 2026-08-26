---
name: angular-threejs
description: Integra three.js dentro de Angular en cacruz.com — dónde vive la escena, carga perezosa para no romper el budget, el bucle de render fuera de NgZone, la limpieza del contexto WebGL y cómo se testea. Úsala siempre que la tarea toque 3D, WebGL, canvas, shaders, escenas o el paquete `three` en este proyecto. Complementa a las skills `threejs-*` (que explican la API de three.js pero no saben nada de Angular).
---

# three.js en Angular (cacruz.com)

Las skills `threejs-fundamentals`, `threejs-materials`, `threejs-shaders`… explican **la API de three.js**.
Esta explica **cómo se monta eso dentro de este proyecto** sin romper el bundle, el change detection ni la memoria.
Cuando la tarea sea de 3D, abre las dos: esta manda sobre la otra en todo lo que sea Angular.

## Contexto real del proyecto (verificado)

| Dato | Valor | Consecuencia |
|---|---|---|
| Angular | 20.3, standalone, **zone-based** (`provideZoneChangeDetection` con `eventCoalescing`) | Un bucle de render dentro de la zona dispara change detection **en cada frame** |
| SSR | **No hay** (`@angular/ssr` no está instalado) | No hay problema de hidratación, pero sigue sin haber `window` en tests |
| Bundle inicial | **329 kB** raw / 93 kB transferidos | three.js core son ~700 kB raw |
| Budget de producción | 500 kB *warning*, **1 MB *error*** | Import estático de `three` en el bundle inicial → ~1,03 MB → **el build falla** |
| Tests | Karma + Jasmine, ChromeHeadless | Sin GPU fiable: **nunca instancies un renderer en un test** |
| Mutation testing | Stryker, score ≥ 80% | La lógica 3D testeable tiene que vivir en funciones puras |

## Instalación (una sola vez)

`three` **no trae tipos propios** (`types` es `null` en su `package.json`). Van dos paquetes, y su versión
menor debe coincidir — three rompe API entre versiones menores:

```bash
npm i three@0.185.1
npm i -D @types/three@0.185.4
```

Los addons se importan por el subpath oficial, **con extensión `.js`**:

```ts
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

Funciona porque `tsconfig.json` usa `"module": "preserve"` (→ `moduleResolution: bundler`), que sí lee el
campo `exports` de `three`. Si alguien cambia eso a `node10`, los addons dejan de resolver.

## Reglas duras

1. **`three` nunca entra al bundle inicial.** Se alcanza solo por un `import()` dinámico dentro de un feature con ruta lazy. Verifica con `npx ng build` que aparece como *lazy chunk*.
2. **El bucle de render va fuera de Angular**, con `NgZone.runOutsideAngular`. Sin esto son 60 ciclos de change detection por segundo.
3. **Usa `renderer.setAnimationLoop()`**, no `requestAnimationFrame` a mano: se cancela con `setAnimationLoop(null)` y es lo único compatible con WebXR.
4. **Todo lo que se crea, se destruye.** Geometrías, materiales, texturas, render targets y el propio renderer. El navegador limita los contextos WebGL vivos (~16): un contexto filtrado por navegación deja la página muerta.
5. **La escena no sabe que existe Angular.** Un archivo aparte, sin decoradores ni `inject()`, que recibe un `HTMLElement` y devuelve un handle con `dispose()`. Así es testeable y sustituible.
6. **`ResizeObserver` sobre el contenedor**, nunca `window.resize`: el canvas cambia de tamaño por layout, no solo por la ventana.
7. **`setPixelRatio(Math.min(devicePixelRatio, 2))`.** En pantallas 3x se renderiza 9× de píxeles para nada.
8. **`prefers-reduced-motion` está derogado en este proyecto por R38.** El dueño decidió que todas las animaciones corren siempre, porque su propio SO reporta `reduce` y no veía su sitio. R38 deroga R17 y R23 explícitamente: **no metas el guard sin una enmienda a la spec**. Ojo con el matiz: R38 se decidió para fades y typewriter; una cámara 3D que se mueve provoca mareo real, que es otra clase de riesgo. Si una escena mueve la cámara, plantea la enmienda antes de implementar — pero la decisión es del dueño, no tuya.
9. **Degrada si no hay WebGL.** El constructor del renderer lanza si no consigue contexto. Un `try/catch` y un fallback estático — la landing no se cae por una decoración.
10. **Import nombrado, no namespace.** `import { Scene, Mesh } from 'three'` deja que el bundler haga tree-shaking; `import * as THREE` se lo come casi todo.

## Dónde va cada archivo

Manda `docs/architecture.md` (feature-first). Para una escena en el feature `home`:

```
src/app/features/home/
├─ hero-scene.canvas.ts     # componente Angular: ciclo de vida, zona, nada de three
├─ hero-scene.ts            # la escena pura: crea, anima, dispone. Sin Angular
├─ scene-handle.ts          # la interfaz (Artículo 4: un tipo, un archivo)
├─ hero-rotation.ts         # matemática pura y determinista → aquí van los tests
└─ hero-rotation.spec.ts
```

`three` **no sube a `shared/`** salvo que dos features distintos lo usen de verdad. Un solo consumidor = vive en su feature.

## Plantilla canónica

**`scene-handle.ts`** — el contrato entre Angular y la escena:

```ts
export interface SceneHandle {
  dispose(): void;
}
```

**`hero-scene.ts`** — three.js puro. Los imports estáticos son correctos aquí: este archivo solo se
alcanza por `import()` dinámico, así que el bundler lo separa junto con `three`.

```ts
import {
  Mesh,
  MeshBasicMaterial,
  IcosahedronGeometry,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { SceneHandle } from './scene-handle';
import { nextRotation } from './hero-rotation';

export function createHeroScene(host: HTMLElement): SceneHandle {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4;

  const geometry = new IcosahedronGeometry(1, 1);
  const material = new MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const resize = new ResizeObserver(() => {
    const { clientWidth, clientHeight } = host;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    camera.updateProjectionMatrix();
  });
  resize.observe(host);

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) {
    renderer.render(scene, camera);
  } else {
    renderer.setAnimationLoop(() => {
      mesh.rotation.y = nextRotation(mesh.rotation.y);
      renderer.render(scene, camera);
    });
  }

  return {
    dispose: () => {
      renderer.setAnimationLoop(null);
      resize.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
```

**`hero-scene.canvas.ts`** — el componente. Fíjate en el flag `destroyed`: entre el `import()` y su
resolución el usuario puede haber navegado, y sin esa guarda la escena se crea **después** de `ngOnDestroy`
y ya nadie la destruye. Es la fuga más fácil de introducir aquí.

```ts
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { SceneHandle } from './scene-handle';

@Component({
  selector: 'app-hero-scene',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #host class="hero-scene" aria-hidden="true"></div>`,
  styles: `.hero-scene { display: block; inline-size: 100%; block-size: 100%; }`,
})
export class HeroSceneCanvas implements OnDestroy {
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly zone = inject(NgZone);
  private scene?: SceneHandle;
  private destroyed = false;

  constructor() {
    afterNextRender(() => void this.start());
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scene?.dispose();
  }

  private async start(): Promise<void> {
    const { createHeroScene } = await import('./hero-scene');
    if (this.destroyed) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      try {
        this.scene = createHeroScene(this.host().nativeElement);
      } catch {
        this.host().nativeElement.classList.add('hero-scene--fallback');
      }
    });
  }
}
```

`afterNextRender` garantiza que el `<div>` ya está en el DOM y con tamaño; `ngAfterViewInit` se ejecuta
antes de que el layout se haya asentado y el `ResizeObserver` arranca midiendo cero.

## Cómo se testea

**Nada de WebGL en los tests.** ChromeHeadless no garantiza GPU y el renderer lanza o cae a software.
Lo que se testea es la lógica pura que extrajiste:

```ts
// hero-rotation.ts
const ROTATION_STEP = 0.004;
const FULL_TURN = Math.PI * 2;

export function nextRotation(current: number): number {
  return (current + ROTATION_STEP) % FULL_TURN;
}
```

```ts
// hero-rotation.spec.ts — R<n>
describe('nextRotation', () => {
  it('avanza un paso fijo', () => {
    expect(nextRotation(0)).toBeCloseTo(0.004, 6);
  });

  it('da la vuelta al completar un giro', () => {
    expect(nextRotation(Math.PI * 2 - 0.002)).toBeCloseTo(0.002, 6);
  });
});
```

Esto es lo que Stryker puede mutar y lo que sube el score. El componente en sí no tiene lógica que mutar:
si te ves escribiendo un test complicado del componente, es señal de que hay lógica que debería estar
en un archivo puro.

Para el componente basta un test de contrato — que al destruirlo se libera la escena — sustituyendo el
handle, no montando three.

## Flujo SDD (no lo saltes)

Una escena 3D es una feature como cualquier otra: **spec → tests en rojo → código mínimo → refactor → Stryker**.
Los criterios en EARS también aplican a esto y son perfectamente escribibles:

> WHEN el usuario tiene `prefers-reduced-motion: reduce` THE SYSTEM SHALL renderizar un único frame estático.
> WHEN el componente de la escena se destruye THE SYSTEM SHALL liberar el contexto WebGL.
> WHEN el navegador no soporta WebGL THE SYSTEM SHALL mostrar el fallback sin lanzar errores.

## Errores frecuentes

| Síntoma | Causa | Arreglo |
|---|---|---|
| El build falla por budget | `import 'three'` estático alcanzable desde el bundle inicial | Muévelo tras un `import()` en un feature lazy |
| La app se arrastra con la escena visible | El bucle corre dentro de NgZone | `runOutsideAngular` |
| Tras navegar varias veces: "Too many active WebGL contexts" | Falta `renderer.dispose()` / `forceContextLoss()` | Completa el `dispose()` del handle |
| La escena se ve borrosa o pixelada | Falta `setPixelRatio` | `Math.min(devicePixelRatio, 2)` |
| El canvas se estira al cambiar de sección | Se escucha `window.resize` | `ResizeObserver` sobre el contenedor |
| El canvas arranca de 0×0 | Se montó en `ngAfterViewInit` | `afterNextRender` |
| Fuga al navegar rápido | El `import()` resolvió después de `ngOnDestroy` | Flag `destroyed` antes de crear |
| `Cannot find module 'three/addons/...'` | `moduleResolution` que no lee `exports` | Mantén `"module": "preserve"` en `tsconfig.json` |

## Checklist antes de cerrar la tarea

- [ ] `npx ng build` pasa y `three` aparece como **lazy chunk**, no en el inicial.
- [ ] El bucle está dentro de `runOutsideAngular`.
- [ ] `dispose()` libera geometría, material, texturas, renderer y contexto; hay guarda `destroyed`.
- [ ] Se respeta `prefers-reduced-motion` y hay fallback sin WebGL.
- [ ] La lógica determinista está en archivos puros, con tests, y Stryker ≥ 80%.
- [ ] Cada test referencia su `R#`.

## Documentación oficial

- Manual: <https://threejs.org/docs/#manual/en/introduction/Installation>
- Referencia de API: <https://threejs.org/docs/>
- Cómo destruir objetos: <https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects>
- Notas de migración entre versiones: <https://github.com/mrdoob/three.js/wiki/Migration-Guide>
- Angular `afterNextRender`: <https://angular.dev/api/core/afterNextRender>
- Angular `NgZone.runOutsideAngular`: <https://angular.dev/api/core/NgZone>
