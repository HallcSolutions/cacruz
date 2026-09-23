# Tasks: Encuentro con Deuda técnica

## Estado actual — 2026-09-23

Se continuó con la autorización reiterada de Christian para implementar el juego y corregirlo. La última petición concreta es elevar la dificultad, hacer que los bugs se muevan y que el jefe lance ataques. Se conservan las solicitudes de humano lector, poderes neuronales, dos perros y mejora del suelo. La aprobación explícita de los tests originales de R1 se conserva en el historial. Las comprobaciones añadidas durante las correcciones se describen aquí sin atribuirles una aprobación individual que no se solicitó.

- [x] **T1 (R9)** — Referencia del avatar guardada y aprobada. No certifica modelo personal.
- [ ] **T2 (R9)** — Parecido fotográfico y GLB personal pendientes. No se integra la malla estática rechazada. El protagonista jugable ahora es un modelo estilizado propio de camisa azul, manos articuladas y libro abierto; no se presenta como cumplimiento de R9.
- [x] **T3 (R1)** — Cámara inicial más alejada, zoom por rueda/botones, pan derecho y táctil, centrado, cancelación de gestos al perder foco. Encuadre calculado para jugador y jefe en varios formatos, incluso si la última máquina está lejos. Instrucciones visibles y separación del HUD móvil.
- [x] **T4a (R2)** — Activación pura al impacto que completa todas las máquinas. 31 tests y 13/13 mutantes eliminados en la ejecución original.
- [x] **T4b (R2, R11)** — Aparición integrada en la escena, retirada de proyectiles antiguos, entrada sin daño y encuadre. Verificada la transición real de 6/7 a 7/7 en escritorio y móvil, sin modificar el estado interno desde el navegador.
- [ ] **T4c (R10, R15)** — Modelo articulado integrado: placas grafito, cables, pantallas y núcleo ámbar, jerarquía independiente y limpieza. Sus 13 contratos pasan. La comparación visual aún muestra diferencias con la referencia; no se cierra R15 ni se declara el modelo idéntico.
- [ ] **T5 (R3)** — Análisis Q, bloqueo previo y progreso 0/3–3/3 implementados. Nombres individuales de los tres hallazgos visibles; falta el control de calidad descrito en la spec.
- [x] **T6 (R4)** — Corrección dentro de alcance, reserva, cooldown y descuento solo al impacto; verificado con tests y victoria real con tres correcciones.
- [x] **T7 (R5)** — Aproximación con colisiones, anticipación, golpe único, recuperación y esquiva por altura/distancia; lógica cubierta por mutaciones.
- [ ] **T8 (R6)** — Victoria y desplome únicos implementados y vistos en el navegador; pendiente el texto específico del control de calidad y una reacción corporal de impacto más clara.
- [ ] **T9 (R7)** — HUD ES/EN, progreso real, radar de pendientes, barra y controles integrados. Incluye nombres individuales de los hallazgos; permanece pendiente la aceptación visual del conjunto.
- [ ] **T10 (R8)** — Reintento, checkpoint 7/7, pausa de escena/audio y limpieza implementados. Reintento comprobado visualmente; queda ampliar la prueba de navegación/reentrada del conjunto.
- [ ] **T11 (R1–R15)** — Build y suite del cambio correctos; comprobación real de la partida y del HUD móvil. La fidelidad gráfica y la escucha del audio siguen siendo criterios pendientes, independientes de los tests.
- [ ] **T12 (R10, R11)** — Suelo de placas con texturas CC0 de Poly Haven, sombras de contacto, luces y bloom ajustados. Eliminadas las luces importadas de los drones que causaban sobreexposición y los volúmenes de plataforma que sobresalían del suelo. Espacio del jefe reservado también en colisiones. No se considera igual al arte de referencia.
- [ ] **T13a/T13b (R14)** — Sustituido el ladrido periódico por efectos breves asociados a eventos; silencio, pausa, límite de voces y limpieza. Tres tests correctos; falta escucha/aceptación del timbre y un sonido de apoyo distinto para los perros.
- [ ] **T14 (R12, R15)** — Dos perros diferenciados, pulsos desde cada compañero y recarga individual implementados. Lógica de apoyo: 23/23 mutantes eliminados. La fidelidad de los modelos respecto al recorte continúa pendiente.

## T16 — Humano con libro y páginas (R16), en curso

Elección explícita recibida: humano con libro abierto; perros y robots se conservan. Sustituye la vara de la tarea previa.
- [x] Libro visible con agarre bilateral, compatible con movimiento/salto/asiento; manos abiertas debajo de las tapas.
- [x] Red neuronal con hojas como proyectil del jugador; pulsos de perros conservados durante el vuelo.
- [x] Lectura Q y hallazgos de copia y pega/pruebas/complejidad visibles, HUD bilingüe.
- [x] Contratos, mutación y revisión de la partida real. Esto no sustituye la aceptación artística del usuario.

## T15 — Corrección del elenco (R15), en curso

- [ ] Corregir pies hacia fuera, apoyo en suelo y hoja elevada delante del agarre; contratos de posiciones antes de código.
- [ ] Rehacer contornos de camisa, cabeza, manos, extremidades y cuerpos caninos siguiendo el recorte posterior.
- [ ] Verificar marcha, salto, vista posterior/frontal/lateral y comparación visual en el juego, además de pruebas y mutaciones de la pose.

## Evidencia de las correcciones actuales

- **Red:** el pan falló inicialmente por ausencia del export; la prueba de pérdida de foco falló porque la cámara seguía recibiendo desplazamientos; la prueba de encuentro distante reprodujo recortes en móvil. La limpieza de partículas/sprites falló antes de ampliar `disposeModel`.
- **Green:** suite acotada al cambio, **111/111 tests** en Karma/ChromeHeadless. Incluye 18 de cámara, 3 de controles Angular en esa ejecución (ampliados después a 5/5 durante la mutación), 13 del modelo del jefe, lógica de encuentro/apoyo, activación y ensamblaje de la aparición visible.
- **Stryker, combate/apoyo/materiales:** **230/230 eliminados**, 0 supervivientes y 0 sin cobertura. Ámbito: `debt-encounter.ts`, `companion-power.ts`, `prepare-asset.ts`.
- **Stryker, cámara/limpieza:** **81/81 mutantes no equivalentes eliminados**, 0 supervivientes y 0 sin cobertura. Dos inversiones de signo equivalentes que solo permutan los extremos simétricos de una caja se excluyen localmente con motivo explícito. La primera ejecución detectó debilidades reales en el encuadre distante y la geometría global de sprites; se reforzaron tests y se sustituyó el ajuste iterativo por el cálculo geométrico.
- **Stryker, nuevos controles Angular:** **23/23 eliminados**, 0 supervivientes, con 5/5 tests. Ámbito: zoom/rueda/centrado, arrastre derecho y pérdida de foco; no certifica el resto del componente. Se reforzaron carga aún pendiente, distinción entre arrastre izquierdo/derecho y deltas sucesivos.
- **Build de producción:** correcto y dentro de budgets: inicial 337,56 kB, escena lazy 743,82 kB. Typecheck de aplicación y tests correcto; `git diff --check` correcto.
- **Navegador real:** 7/7, jefe visible, Q, tres correcciones, victoria 3/3, derrota y reintento conservando máquinas. Zoom por botones y rueda comprobado, así como cambio ES/EN y silencio. Se restauraron español, sonido y viewport normal después de la revisión. La ruta no emitió errores de consola en esa comprobación. En 1440×900 se completó otro reintento hasta la victoria; en 390×844 se verificaron progreso/aparición y se corrigió el solapamiento entre botones y barra. Arrastre derecho y pérdida de foco se verifican mediante eventos reales de DOM en TestBed; no se afirma una prueba manual del pellizco.
- **Límite de alcance de la suite:** no incluye `personalized-avatar.spec.ts`, cuyo fallo anterior por ausencia de `christian.glb` corresponde a R9 y se conserva. No se presenta la suite completa del repositorio como verde.

Comando Green:

```sh
npm test -- --watch=false --browsers=ChromeHeadless \
  '--include=src/app/features/world/logic/*.spec.ts' \
  '--include=src/app/features/world/scene/{build-*,prepare-asset,world-*,debt-monster-view,dispose-model}.spec.ts' \
  --include=src/app/features/world/world-canvas.spec.ts
```

La admisión automática de img2threejs sigue rechazada; `boss-reconstruction/state.json` conserva ese resultado. El modelo usado fue construido manualmente en Three.js. Los textos de abajo son el historial anterior a esta implementación y no sustituyen el estado actual.

## Historial de preparación y primeras iteraciones

## T4c — pruebas preparadas (2026-09-23)

Archivo: `src/app/features/world/scene/build-debt-monster.spec.ts`. **13 casos escritos, pendientes de aprobación**: volumen y escala de R10, geometría finita, apoyo de ambos pies, movimiento independiente de cada brazo y pierna, núcleo/pantallas unidos al torso, poses independientes entre instancias y destrucción sin duplicar liberaciones ni invalidar otro modelo. Se solicitaron para aprobación antes de Red y código.

Solo se comprobó sintaxis mediante `typescript.transpileModule` (cero diagnósticos). No se ejecutaron tests, no se comprobó resolución de módulos y no se creó implementación. Los módulos de producción todavía no existen.

La revisión visual está definida en `boss-reconstruction/image-analysis.md`; el estado de la skill se registra en `boss-reconstruction/state.json`. Análisis de imagen y adecuación condicional completados, pases de geometría/render aún no iniciados. La imagen readjuntada por Christian coincide visualmente y en dimensiones (1672×941) con la referencia guardada. No se generó otra imagen conceptual.

Admisión automática de la imagen completa: rechazada por `foreground coverage 0.991 > 0.97`, ya que el fondo es una escena y no permite aislar la silueta con ese método. Evidencia conservada en `boss-reconstruction/admission.json` y `probe.json`; el paso `reference-admission` **no** se marca aprobado. Antes de generar geometría con la skill se debe obtener una referencia aislada o máscara válida del jefe y volver a validar, conservando la imagen completa como autoridad visual. No interpretar el análisis humano condicional como aprobación de ese gate ni afirmar que hay modelo generado.

## T3 — cámara completada (2026-09-23)

Continuidad autorizada por Christian («si dale»). Tests escritos en `src/app/features/world/scene/world-camera.spec.ts` y aprobados explícitamente («Aprobar y continuar con R1»). Los 12 casos iniciales cubren encuadre, salto, resize, zoom, traslado a otras zonas y seguimiento en móvil, usando la proyección de una caja de referencia del avatar sin instanciar WebGLRenderer. Tras Stryker se añadió un caso de dirección visual de WASD/flechas para detectar una inversión de la cámara: 13 casos finales.

Revisión del estado actual en navegador: el personaje ocupa aproximadamente el 7 % de la altura jugable en escritorio y el 3 % en móvil (estimación visual de las capturas, no medición automatizada del modelo). Se observó la reducción adicional causada por el FOV vertical adaptable. Servidor de revisión propio: `http://127.0.0.1:4303/`; el puerto 4200 corresponde a otra aplicación y no se modifica.

### Evidencia T3

- Red: `npm test -- --watch=false --browsers=ChromeHeadless --include=src/app/features/world/scene/world-camera.spec.ts` falla con TS2307 porque aún no existe `world-camera`. Es fallo de compilación previo al módulo, no una ejecución de aserciones.
- Green: mismo comando, primero 12/12 y finalmente **13/13 tests correctos** tras reforzar la dirección visual de los controles.
- Stryker: primera ejecución 5/6 mutantes eliminados; sobrevive la inversión del lado de la cámara. El test añadido verifica que WASD/flechas se proyectan en la dirección esperada. Segunda ejecución: **6/6 eliminados, 0 supervivientes, 0 sin cobertura, 0 errores; score 100 %**. Misma API/configuración Karma de T4a, sustituyendo `mutate` por `src/app/features/world/scene/world-camera.ts` e `include` por su `.spec.ts`; `cleanTempDir: 'always'`.
- Typecheck: `node_modules/.bin/tsc --project tsconfig.spec.json --noEmit`, correcto.
- Build de producción: `npm run build`, correcto y dentro de budgets; inicial 334,96 kB, escena lazy 670,23 kB. No se modifica la carga diferida.
- Navegador real: capturas antes/después a 1440×900 y 390×844 y revisión final a 2525×841; cuerpo completo y aproximadamente 14 % del área jugable en el encuadre nuevo. Es una estimación visual complementaria a los tests de proyección. Verificados desplazamiento con arrastre, seguimiento, salto con botón móvil y apertura/cierre de «Quién soy». Zoom y cuatro proporciones, incluido 844×390, cubiertos por tests; gesto de pellizco no probado manualmente.
- La sobreexposición de materiales existentes sigue visible y corresponde a T12/R13. Esta tarea cambia cámara, no constituye la mejora gráfica completa ni la integración del jefe.
- Servidor de revisión: `http://127.0.0.1:4303/`; viewport del navegador restaurado al finalizar.

## T4a — pruebas preparadas (2026-09-23)

Archivo: `src/app/features/world/logic/activate-debt-encounter.spec.ts`. Deriva los casos de R2 y del plan aprobado. Tests aprobados por Christian el 2026-09-23 y ejecutados.

Casos: 0/7; cada posible máquina restante con un bug; id ausente; ids ajenos; lista vacía; 7/7; lista de tamaño distinto; corrección que aún viaja frente al impacto final; frames repetidos; todas las fases posteriores, incluida derrota; conservación del estado de arena.

### Evidencia T4a

- Red: `npm test -- --watch=false --browsers=ChromeHeadless --include=src/app/features/world/logic/activate-debt-encounter.spec.ts` falla por ausencia de `./activate-debt-encounter` (TS2307). Es un fallo de compilación previo a crear el módulo, no una ejecución de las 31 aserciones. La ejecución restringida abortó al compilar; la ejecución autorizada fuera del sandbox confirmó ese fallo esperado.
- Green: mismo comando después de crear función y tipo, **31/31 tests correctos** en Karma/ChromeHeadless.
- Typecheck: `node_modules/.bin/tsc --project tsconfig.spec.json --noEmit`, correcto.
- Stryker 9.6.1: misma configuración `stryker.config.json`, runner Karma/Angular CLI y cobertura por test; ejecución limitada a la función y su spec mediante la API instalada de Stryker. **13 mutantes eliminados, 0 supervivientes, 0 sin cobertura, 0 errores; score 100 %**. El alcance no certifica el resto del juego.
- Se añadió la función a la lista permanente `mutate` de la configuración existente. No se añadieron dependencias, runners ni configuraciones paralelas. Sandbox de mutación eliminado automáticamente con `cleanTempDir: 'always'`.
- `git diff --check`, correcto. Integración en escena, gráficos, compañeros y resto del combate siguen pendientes de sus tareas.

Reproducción de la ejecución de mutación acotada, reutilizando la configuración del proyecto:

```sh
node --input-type=module <<'NODE'
import { readFile } from 'node:fs/promises';
import { Stryker } from '@stryker-mutator/core';
const config = JSON.parse(await readFile('stryker.config.json', 'utf8'));
await new Stryker({
  configFile: 'stryker.config.json',
  mutate: ['src/app/features/world/logic/activate-debt-encounter.ts'],
  karma: {
    ...config.karma,
    ngConfig: {
      ...config.karma.ngConfig,
      testArguments: {
        ...config.karma.ngConfig.testArguments,
        include: 'src/app/features/world/logic/activate-debt-encounter.spec.ts',
      },
    },
  },
  ignorePatterns: ['.venv-avatar/**', '.img2/**', 'tmp/**', 'dist/**'],
  cleanTempDir: 'always',
}).runMutationTest();
NODE
```

## Ampliaciones R12/R13

Pulsos de apoyo de los perros y mejora de realismo de las máquinas solicitados/aceptados por Christian. Pendientes de preparación de tareas y tests propios tras completar la tarea activa; no están implementados ni deben confundirse con el desbloqueo de T4a.

## T2 — preparación

Pruebas propuestas en `src/app/features/world/scene/personalized-avatar.spec.ts`: carga real del GLB personal, geometría volumétrica, textura, esqueleto, clips compatibles, movimiento medido en el controlador actual, independencia del clon y detención al liberar. Pendientes de aprobación y ejecución Red. Estas comprobaciones no certifican parecido ni ausencia de deformaciones: se requieren renders de cara/manos y movimiento.

Probe offline de img2glb correcto; no se envió ninguna imagen. Christian autorizó expresamente enviar la referencia aprobada a `trellis-community/TRELLIS`. No se envía la foto original.

Bloqueo de entorno: ni Python del sistema ni el runtime de Codex incluyen `gradio_client` y `huggingface_hub`, requeridos por img2glb. No se instaló tooling ni se llamó al servicio. Se requiere autorización para un entorno Python local con esas dependencias según AGENTS.md. Typecheck de los tests: `tsc --project tsconfig.spec.json --noEmit`, correcto; Red/Green y Stryker aún no ejecutados.

## T2 — ejecución autorizada (2026-09-17)

Christian aprobó instalación y tests. Dependencias instaladas en `.venv-avatar`; versiones guardadas en `avatar-requirements.txt`. Red confirmado con Karma/ChromeHeadless: 7 tests fallan por HTTP 404 de `/models/character/christian.glb`. La primera ejecución restringida abortó; la ejecución con permisos ampliados completó los tests. Solicitud TRELLIS iniciada con referencia autorizada, textura 2048 y simplificación 0.95; resultado pendiente.

### Resultado de generación y bloqueo actual

Malla estática generada: 4.560.088 bytes, 15.403 triángulos, una malla/material, cero skins y clips. Integridad GLB correcta. Revisión en navegador de frente, espalda y rostro: fondo convertido en base, parecido facial insuficiente y picos en pelo. Suavizado de normales probado solo en visor; GLB original conservado. No aprobada para integración.

Segundo intento con la misma referencia autorizada, seed 21 y simplificación 0.90: proveedor deniega por cuota ZeroGPU, espera indicada 23:57:38. Sin reintentos adicionales ni otro proveedor. T2 sigue pendiente; juego sin cambios. Evidencia estructurada: `avatar-generation-report.json`. Visor local temporal: `http://127.0.0.1:8766/tmp/avatar-preview/`.

## T17 — R20 combate activo (implementado y verificado)
Solicitud directa: “no debería ser tan fácil … el monstruo debería tirar algo … los bugs deberían moverse”. Preparar pruebas de disparos anunciados, daño esquivable, resistencia a repetición de F, apoyo sin interrupción, movimiento de máquinas y colisión del jefe. Verificar Red → Green, mutación y navegador. Conservar pendientes de R15/R16 y no confundir tests de geometría con aceptación visual.

## Evidencia de R16–R20 y ajustes de cámara — 2026-09-23

- Red de R20: falla compilación por módulo `machine-motion` ausente y campo `projectiles` ausente; Red de colisión del jefe: `machineObstacles` todavía no admite estado del encuentro. Logs temporales `/tmp/world-r20-red.log`, `/tmp/world-r20-test.log`. No se atribuye una aprobación individual de tests que no se pidió; se continuó bajo las reiteradas instrucciones de implementación y corrección.
- Regresión final: **142/142 tests** Karma/ChromeHeadless del juego, más un caso de borde de desvío añadido después y verificado en el dry run de Stryker (9/9 en ese grupo). No es la suite completa del repositorio: el contrato previo de GLB personal R9 sigue sin su asset aprobado.
- Stryker conjunto: **97,69 %**, 507 eliminados, 1 timeout detectado, 12 supervivientes, cero sin cobertura; 522 instrumentados/520 evaluados. Tras reforzar los supervivientes de variantes y límites: máquinas **73/74 (98,65 %)**; seguimiento **59/61 (96,72 %)**; controles nuevos de cámara **20/20 (100 %)**. Cámara geométrica **60/60**, colisiones **18/18**, vuelo de proyectiles de compañeros **8/8**.
- Supervivientes finales revisados: la inversión de offsets del abanico solo cambia el orden de los mismos cinco proyectiles; multiplicación/división por signos ±1 en marcha y desvío son equivalentes; el predicado por defecto `false`/`undefined` da el mismo resultado en el `if` de bloqueo. No se declara 100 % del código ni se ocultan esos resultados.
- Prueba del ciclo completo: repetir F sin parar exige tres ataques del jefe antes de derrotarlo; al esquivar por altura es posible ganar, sin daño residual después de la victoria. Los perros solo amplían una recuperación existente, no cancelan ataques.
- Navegador real: órbita con arrastre izquierdo y C, robots móviles y disparos, reparaciones 0/7 → 7/7, aparición automática, derrota/checkpoint/reintento, análisis, descarga visible y contraataque 1/3. El jefe derrotó al jugador expuesto. La victoria con el nuevo patrón está cubierta por simulación automatizada; no se presenta como victoria manual.
- HUD comprobado a 1280×720 y 390×844, incluidos hallazgos individuales y controles en dos filas; viewport temporal restaurado.
- R18: actor y perros respetan máquinas activas/reparadas y jefe activo/caído. Las posiciones móviles se usan en colisiones, blancos, origen de disparos, modelos y radar.
- R19: tres modelos pequeños de la familia mecánica del jefe (puño, patas de araña y escudo), con extremidades animadas.
- R16/R17: mangas reducidas, manos con palma y dedos bajo las tapas, libro más compacto, perros suavizados; suelo hexagonal con textura de pizarra generada e inserciones discretas. Prompt y método en `visual-direction.md`. La fidelidad visual respecto al concepto **permanece abierta**; no se presenta como entrega idéntica.
- Audio conserva los efectos de eventos del trabajo anterior; esta ronda no certifica aceptación del timbre.

Reproducción de regresión:
```sh
npm test -- --watch=false --browsers=ChromeHeadless '--include=src/app/features/world/logic/*.spec.ts' '--include=src/app/features/world/scene/{build-*,prepare-asset,world-*,debt-monster-view,dispose-model}.spec.ts' --include=src/app/features/world/world-canvas.spec.ts
```
Mutación: misma API Stryker/config Karma documentada arriba, con scopes `debt-encounter`, `machine-motion`, `machine-obstacles`, `follow-companion`, `world-camera`, `pose-world-cast` y tramo de movimiento de `arena`; controles limitados a ramas de arrastre. Artefactos de Stryker excluidos y sandbox limpiado automáticamente.

Build final de producción (`npm run build`): correcto después de todos los cambios de escena. `git diff --check`: correcto. No se publicaron cambios ni se creó commit/PR. Servidor de revisión: `http://127.0.0.1:4303/`.
