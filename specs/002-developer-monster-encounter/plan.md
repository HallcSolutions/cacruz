# Plan: Encuentro con Deuda técnica

Continuación del 2026-09-23: Christian ordena «entonces qué esperas para arreglarlo» y precisa que el juego completo debe seguir la imagen. Se continúa la implementación solicitada con validación Red/Green y revisión real; las 13 pruebas del jefe ya estaban escritas y presentadas al dar esa orden. El flujo automático img2threejs queda como análisis incompleto: no admite la escena entera para segmentación. La construcción se realiza directamente con Three.js en el proyecto, sin atribuirle aprobación de los gates de ese generador. Se conserva la comparación visual y la evidencia del intento, y no se presenta ningún modelo como reconstrucción automática certificada.

Estado: plan base aprobado por Christian el 2026-09-17. Enmienda del 2026-09-23 aprobada: progresión máquinas → jefe final, dirección visual y mejora gráfica. Aprobación de Christian: «excelente me gusta mucho dale». Implementación por tareas, con aprobación de los tests escritos y Red antes del código.

## Enfoque técnico

Construir un solo encuentro completo en `features/world`. Reutilizar movimiento, colisiones, salud, controles, cámara y render. Criatura procedural articulada con primitivas de Three.js y materiales compartidos; sin servicios de generación ni nuevas dependencias.

La imagen conceptual se generó con `imagegen` únicamente como referencia de diseño. El jefe jugable será geometría 3D articulada dentro del render actual; la imagen no se incorpora como sustituto del modelo ni como fondo del juego.

La referencia `digital-language-sandbox/frontend/src/app/game-runtime/three/exploration` separa personaje, marcha y disposición. Se toma su criterio de presencia y movimiento, sin importar su runtime ni su modelo infantil. El GLB y los clips de cacruz permiten comenzar ajustando encuadre e iluminación.

## Arquitectura / Componentes

- `world/logic/`: transición determinista del encuentro, análisis, alcance, temporizadores, impactos y reinicio. Reutilizar `arena.ts` para el estado de las máquinas, `health.ts`, colisiones y `follow-camera.ts`.
- `world/model/`: estado, fases y eventos, cada tipo requerido en archivo propio.
- `world/scene/`: construcción y animación del monstruo, señal del ataque y escaneo. `world-scene.ts` compone estas piezas.
- `world-canvas.ts` y `scene-handle.ts`: acciones y notificaciones discretas; conservar import dinámico, bucle fuera de Angular y limpieza.
- `world-page.ts`, `.html`, `.css` y traducciones existentes: objetivo, hallazgos, vida, control de calidad y reintento accesibles.

No crear capacidades compartidas con un solo consumidor ni reorganizar otros features.

## Modelo de datos

| Entidad | Datos | Responsabilidad |
| --- | --- | --- |
| Encuentro | Fase, posición, vida, tiempo restante, análisis realizado | Estado de la simulación |
| Hallazgo | Identificador, etiqueta traducible, resuelto | Diagnóstico de Sonar |
| Corrección pendiente | Objetivo, hallazgo reservado, progreso | Resolver una sola vez al impactar |
| Evento | Tipo e identificador del objetivo | Comunicar cambios a presentación |

Fases: inactivo mientras queden máquinas, aparición, persecución, anticipación, ataque, recuperación, derrota y jugador derrotado. Configuración local de velocidad, alcance, daño y duración, sin catálogo genérico. El progreso se deriva de las máquinas registradas y sus bugs; no se mantiene un contador mutable independiente.

## Contratos / Interfaces

Una función pura recibe estado, acción, jugador, delta de tiempo y consulta de colisión; devuelve estado y eventos. La escena interpreta eventos, no calcula daño. Angular recibe solo cambios relevantes, no cada frame. Definir cada contrato en su archivo al escribir los tests.

F y el botón contextual ejecutan refactorización durante el encuentro y los comandos existentes fuera de él. «Analizar con Sonar» es una acción independiente del HUD, operable con teclado y táctil. Cada corrección reserva un hallazgo para impedir que varias resuelvan el mismo o resten vida de más. Victoria y daño se emiten una sola vez por transición/ataque.

Al aplicar los impactos de `stepArena`, contar máquinas completas con `isPatched`/`bugsOf` sobre `TURRETS`, no sobre las claves presentes en `arena.bugs`: un id ausente aún tiene tres bugs. Activar únicamente con lista no vacía, todas reparadas y fase inactiva. Evaluar la transición en ese mismo paso, descartar balas y agentes restantes de la fase anterior y no aplicar daño de máquina durante la entrada del jefe. La fase impide repeticiones por frames o impactos sobrantes. El total del HUD deriva de `TURRETS.length` (hoy siete).

Exponer un resumen discreto de progreso y encuentro mediante el handle/callbacks existentes y actualizar signals solo cuando cambie. El combate final intercepta la derrota antes del respawn automático actual de `health.ts`; el reintento restaura vida y encuentro sin deshacer las máquinas reparadas. Fuera del combate final se conserva el respawn existente.

## Decisiones

- R1: acercar cámara conservando seguimiento y zoom existentes; revisar tamaño visible y oclusión en escritorio y móvil.
- R2/R5/R11: activar el jefe al completar todas las máquinas. Reservar un espacio en la plaza separado del escritorio central y comprobarlo contra límites y sólidos, considerando el tamaño completo del monstruo. Si el jugador ocupa el punto de aparición, presentar la advertencia y esperar a que se despeje antes de materializarlo, sin empujarlo ni dañarlo. Si está fuera de pantalla, el HUD indica la dirección hacia el jefe. Anticipación antes del impacto; salto y desplazamiento permiten esquivar.
- R3/R4: Sonar revela hallazgos predefinidos. La refactorización es una mecánica del juego; no ejecuta código ni promete un diagnóstico real.
- R6/R7: vincular impacto, reacción del cuerpo, hallazgo resuelto, vida y control de calidad. Textos traducidos en HTML y marcador sobre el objetivo.
- R8: reutilizar salud, reiniciar el combate final sin recargar y eliminar ataques y correcciones pendientes. Mantener las máquinas reparadas como checkpoint de esa visita. Pausar el encuentro con modal abierto o pestaña oculta; al volver no acumular delta de tiempo.
- Mantener navegación independiente, fallback y R86 para cámara y movimiento decorativo.

## Enmienda gráfica (R1, R10)

- **Cámara:** conservar la vista oblicua, acercar el encuadre inicial al objetivo de R1 y comprobarlo en escritorio, móvil y la proporción ancha de la captura. Durante el combate mantener legibles avatar, jefe y anticipación; evitar cortes, sacudidas o zoom cinematográfico obligatorio.
- **Iluminación:** ajustar conjuntamente luz del personaje, emisivos de modelos y bloom existentes. Conservar el tono oscuro con luz de contorno fría y acentos ámbar en el jefe. El detalle del cuerpo no depende del bloom.
- **Materiales:** reutilizar `MeshStandardMaterial`, con contraste de rugosidad entre placas y cables. Separar visualmente núcleo, carcasa y articulaciones. Compartir materiales estables; clonar únicamente donde una reacción individual requiera modificar el material, sin recolorear otros props que comparten una instancia.
- **Escenario:** refinar las texturas procedurales de `build-floor.ts` con placas legibles y vetas menos dominantes; reservar una zona libre de decoración para el jefe con la misma exclusión en render y colisiones de `decor-layout.ts`. Mantener accesos a estaciones y el escritorio.
- **Criatura:** ensamblar torso, pelvis, cabeza, hombros, brazos y piernas con pivotes propios. Hombros desiguales, placas de servidores, cables y núcleo ámbar, altura orientativa de 4,5 unidades frente al avatar actual de 1,8. Reutilizar geometrías; priorizar silueta y articulación sobre microdetalle. La animación interpreta las fases de lógica; nunca decide daño.
- **Efectos:** anillo segmentado y flechas antes del ataque, respuesta corporal al impacto y un desplome final. Partículas acotadas y reutilizadas. No añadir pases de desenfoque ni efectos que oculten señales de combate.
- **Bajo consumo:** conservar la degradación existente de sombras/bloom y el límite de pixel ratio. Peligros, núcleo y estado de máquinas deben leerse también sin esos efectos. Verificar rendimiento comparando la misma escena y dispositivo antes y después.

Archivos existentes responsables: `scene/world-scene.ts`, `build-floor.ts`, `build-city.ts`, `load-assets.ts`, `palette.ts` y `logic/decor-layout.ts`. Añadir construcción/animación del jefe, estado y transición en archivos propios de `world` solo cuando su tarea y tests lo requieran; no ampliar `world-scene.ts` con toda la lógica de combate.

La integración sigue las skills `angular-threejs` y `threejs-materials` de `.claude/skills/`. Para movimiento reducido prevalece R86 de la spec 001, que matiza R38; no aplicar los ejemplos contradictorios de la skill como sustituto de la spec.

### Fidelidad a la referencia y siguiente tarea (R10, R15)

La aclaración de Christian tras T3 prioriza los modelos y la escena sobre el audio. La referencia aprobada se evalúa como un conjunto: el encuadre de R1 es solo una base. T4c prepara primero el modelo del jefe; T12, T2 y la diferenciación de compañeros completan entorno y protagonistas antes de presentar la transformación visual como terminada. R9 no se elimina ni se considera resuelto por conservar el avatar genérico. El audio R14 continúa pendiente, sin sustituir este objetivo.

T4c utiliza el flujo `img2threejs` para el ensamblaje mecánico. Análisis y estado de reconstrucción en `specs/002-developer-monster-encounter/boss-reconstruction/`. La referencia contiene una escena; se toma el jefe central como objeto de reconstrucción, conservando el resto solo para escala y contexto. Volúmenes, estructura, detalle, materiales y luz se revisan por pases; cada pase necesita evidencia visual. No generar otra imagen como prueba de avance.

Contrato de la pieza para T4c: `buildDebtMonster()` en `scene/build-debt-monster.ts` devuelve un `Group` autónomo, con pivotes y anclajes de nombres estables para el animador posterior. Geometría de altura entre 3,6 y 5,4 unidades frente al jugador de 1,8, apoyada en y=0. Los brazos y piernas tienen articulaciones independientes; núcleo y pantallas acompañan al torso. `disposeDebtMonster(root)` en `scene/dispose-debt-monster.ts` libera una vez los recursos propios y retira el objeto de su padre. Crear dos jefes para revisión no debe compartir estado de pose/material mutable ni invalidar recursos al destruir uno.

Anclajes públicos de los tests: `torso`, `left-shoulder`, `right-shoulder`, `left-hand`, `right-hand`, `left-hip`, `right-hip`, `left-foot`, `right-foot`, `amber-core`, `left-code-screen`, `right-code-screen`. `left`/`right` son lados propios del modelo, no posiciones en la imagen. La jerarquía conserva la libertad de añadir codos, rodillas y ensamblajes internos según el sculpt spec; no exponerlos como API antes de necesitarlo.

Los tests de contrato comprueban volumen, apoyo, jerarquía articulable, independencia y limpieza sin renderer. No certifican parecido: además se requieren render de tres cuartos comparable a la referencia, frontal, ambos laterales y posterior; revisar hombros/pantallas, masa desigual de brazos, núcleo encajado, cables curvos y detalle de placas. Hasta integrar T4b, mostrar el modelo como revisión de T4c y no afirmar que el jefe ya aparece en la partida.

## Validación

Tareas actualizadas para avanzar con gráficos y jefe mientras R9 permanece pendiente. Por bloque: tests Jasmine aprobados → Red confirmado → implementación mínima → Green → Stryker usando Karma y configuración existentes, con score mínimo del 80 % y sin supervivientes críticos. No introducir runners nuevos. `stryker.config.json` aún no incluye la lógica de `world`: ampliar su lista de archivos mutados al implementar la lógica nueva, conservando runner y umbrales.

Primer contrato, T4a: `activateDebtEncounter(phase, arena, turrets)` determina la transición de `inactive` a `appearing` usando las máquinas reparadas; devuelve cualquier fase ya iniciada sin modificarla. La función vive en `logic/activate-debt-encounter.ts`, y el tipo de fase en `model/debt-phase.ts`. No conoce al jugador, la cámara ni Angular: la proximidad no participa en el desbloqueo. La limpieza de proyectiles y la integración en escena corresponden a T4b; esta primera tarea no presenta por sí sola al monstruo en pantalla.

T3: extraer la creación y colocación de la cámara a `scene/world-camera.ts`, con `createWorldCamera(aspect)` y `positionWorldCamera(camera, focus, zoom)`. La escena conserva `ResizeObserver`, límites de zoom, seguimiento y controles; la proyección del avatar se puede comprobar sin renderer con `Vector3.project`. Acercar la cámara y conservar un campo vertical estable al cambiar la relación de aspecto para evitar que el personaje se reduzca en móvil. El arrastre se convierte a unidades de mundo usando la distancia de la cámara colocada a su foco. Comprobar cuerpo completo, proporción de altura, salto, desplazamiento por el mundo, resize y funcionamiento del zoom; los tests no fijan coordenadas de cámara solo por coincidir con la implementación.

Tests: sin aparición con 0/7 o 6/7 máquinas reparadas, lista vacía o estado parcial con ids ausentes; aparición con el impacto que completa 7/7; aparición única ante frames/impactos repetidos; ausencia de activación por proximidad; contador sin duplicados; descarte de ataques anteriores; entrada segura; escaneo sin daño; control fallido con hallazgos pendientes; refactorización antes de analizar/fuera de alcance; cooldown; reserva de hallazgos; impacto único; anticipación sin daño; esquiva; colisiones; victoria única; reintento con máquinas completas y cierre con partida nueva. Tests de componentes para HUD, idioma y controles, sin instanciar WebGLRenderer.

Revisión visual en navegador a 1440×900, 390×844 y 2525×841 (captura aportada): cuerpo completo del avatar, monstruo distinguible de torretas, nombre y vida legibles, escaneo visible, anticipación del ataque, reacción y derrota. Comparar antes/después con cámara y luz equivalentes; revisar carcasa/núcleo sin superficies quemadas, suelo menos ruidoso y ausencia de obstáculos en el espacio de aparición. Probar teclado, táctil, navegación de ida/vuelta, bajo consumo y movimiento reducido. Ejecutar build y verificar carga lazy y budgets existentes. Los tests de valores de materiales no sustituyen esta revisión visual.

## Riesgos / Dudas

La sensación de peso requiere revisión en movimiento; los tests de lógica no acreditan calidad visual. Las construcciones pueden ocultar al personaje: ajustar área y encuadre antes de introducir sistemas de transparencia. La geometría procedural permite una primera criatura jugable, cuya calidad se evaluará antes de ampliar enemigos.

Ampliaciones aceptadas el 2026-09-23 (R12/R13): pulsos de energía de los perros contra el objetivo del jugador, con recarga visible y sin botones extra; máquinas enemigas con más volumen, materiales metálicos y reacciones mecánicas. R12 requiere concretar alcance, recarga y efecto de apoyo antes de su tarea. El pulso debe ayudar sin resolver por sí solo los hallazgos que R4 reserva al jugador. Reutilizar seguimiento y modelos de compañeros actuales. Para R13, ampliar los rigs de `build-city.ts` y animar disparo/impacto/fin desde eventos reales de arena, conservando sus posiciones y reglas de reparación; compartir geometrías y materiales estables, limitar partículas y evitar efectos que oculten el cuerpo. Estos cambios se prepararán con sus tests al llegar a su tarea.

## Trazabilidad

| Requisito | Responsable | Evidencia |
| --- | --- | --- |
| R1 | Cámara y avatar | Capturas responsive y regresión de movimiento |
| R2 | Arena, estado y representación | 7/7, ausencia de activación prematura y aparición única |
| R3 | Análisis y hallazgos | Escaneo, etiquetas y control fallido |
| R4 | Corrección | Alcance, requisito previo, cooldown e impacto |
| R5 | Ataque y señal | Tiempos, obstáculos, daño único y esquiva |
| R6 | Eventos y resultado | Vida, hallazgos y victoria única |
| R7 | Página y traducciones | Progreso, HUD, teclado y táctil |
| R8 | Reinicio y ciclo de vida | Checkpoint del jefe, restauración y limpieza |
| R9 | Avatar personal | Trabajo previo pendiente, validación independiente |
| R10 | Materiales, suelo, luces y criatura | Comparativa visual responsive y bajo consumo |
| R11 | Transición de arena a encuentro | Limpieza de proyectiles y entrada segura |
| R12 | Compañeros y pulsos | Objetivo compartido, recarga, ayuda única y limpieza |
| R13 | Máquinas y eventos de arena | Volumen y reacción visual a disparo, impacto y reparación |
| R14 | Audio y eventos del juego | Ausencia de repetición, sincronía, silencio, pausa y escucha |
| R15 | Protagonista, compañeros, jefe y escena | Comparación en navegador contra la referencia y revisión en movimiento |

## Enmienda de audio propuesta (R14, 2026-09-23)

Petición de Christian: revisar un sonido que no encaja con el juego. Auditoría del código: `BarkAudio` clona `public/audio/bark.wav` (mono, 44,1 kHz, duración 2,039 s) sin registrar voces activas; `runDogs` dispara dos copias simultáneas cada 4–10 s, a volumen 0,45 y velocidades 0,95/1,35. No hay efectos de combate ni limpieza del audio al destruir la escena. Esta auditoría no equivale a una evaluación auditiva del timbre.

Propuesta en dos tareas acotadas, antes de retomar T12 si Christian la aprueba:

- T13a: retirar la repetición periódica de ladridos y controlar voces activas para detenerlas al pausar o salir. Conservar el punto de activación por gesto existente. Tests de silencio en reposo, ausencia de voces duplicadas, pausa y liberación. No sustituir el problema por un bucle ambiental.
- T13b: efectos breves de energía, impacto metálico y reparación, derivados de eventos reales de arena, con distinta identidad para acción del jugador y máquina. Reutilizar Web Audio nativo, sin dependencias ni servicios externos: transitorios de ruido filtrado y envolventes suaves, evitando tonos agudos sostenidos. Mantener un máximo de cuatro voces, ganancia general conservadora y atenuación por distancia; añadir control de silencio accesible y traducido. Reservar el efecto de compañero y las señales del jefe para su integración en R12 y T4b–T8. El cierre global de R14 requiere verificar esos eventos cuando existan.

La selección de eventos vive en `world/logic/` y la reproducción en `world/scene/`, fuera de Angular por frame; los controles usan los contratos existentes del canvas/handle. Los contratos concretos y tests se escribirán para aprobación antes de implementar cada tarea. Stryker valida la selección y el ciclo de vida; una escucha en el juego valida volumen, timbre y mezcla. No se da por mejorado el sonido solo por pasar tests.

## Enmienda: avatar personal (R9)

Referencia creada con imagegen desde `/Users/christiancruz/Documents/Christian_Cruz_Arango.png`, guardada como `christian-avatar-reference.png`. Conserva rasgos faciales, camisa azul clara, pantalón oscuro y zapatos oscuros. Es una imagen de diseño; todavía se requiere modelado, rig y validación de animaciones para representarla en el juego. Revisar la referencia visual antes de producir el modelo, y seleccionar el flujo de modelado mediante la skill pertinente. No considerar una textura de retrato sobre el modelo genérico equivalente a este requisito.


## Corrección de cámara y progresión (2026-09-23)

La petición de Christian de alejar y permitir mover la cámara reemplaza el acercamiento inicial de T3. Zoom inicial 1,3, límites 0,6–3,2; rueda y botones en escritorio, pellizco en táctil. Arrastre derecho o centroide de dos dedos trasladan el foco según la base de la cámara; perder foco cancela gestos. El HUD explica estos controles y los separa de la barra del jefe en pantallas estrechas.

Al completar 7/7 se encuadran las cajas completas del jugador y del jefe. La distancia se calcula con el campo de visión y las proyecciones de sus extremos, sin límite de iteraciones que pueda cortar un actor lejano. Se mantiene el ángulo y el zoom manual puede alejar más. El radar de pendientes deriva de las mismas máquinas que el disparador; no hay un contador independiente.

Se integra un modelo procedural Three.js propio, construido manualmente según la referencia. El gate automático de admisión de img2threejs quedó rechazado y no se presenta como superado. La limpieza común es `disposeModel` (también partículas y sprites), no un segundo destructor específico del jefe. El montaje jugable y sus pruebas no certifican igualdad visual con el concepto ni parecido fotográfico de R9.

## Corrección actual del elenco (R15)

La orden reiterada de corregir los personajes y el nuevo recorte autorizan continuar esta tarea. Se conservan las jerarquías de articulaciones actuales y su integración física. `ModelParts` construirá superficies facetadas a partir de secciones, reutilizadas por torso, cabeza, extremidades y cuerpos caninos; se eliminan los bloques de los hombros y el vientre esférico. La pose corrige la apertura de caderas y orienta muñeca/vara hacia delante; la geometría sigue siendo 3D jugable. Antes de implementación se comprueban fallos de apoyo/separación de pies y de dirección/despeje de herramienta. Las medidas de apoyo/jerarquía son contratos, mientras que el parecido se revisa en render real y no se deduce de las pruebas.

## R16 — Libro abierto y poder de páginas

Christian eligió expresamente al humano con libro, manteniendo perros y robots. El libro es geometría 3D articulada unida al torso, con ambas manos en sus bordes; sustituye la vara. Se reutilizan la simulación de proyectiles y el encuentro. La marca opcional `source: companion` conserva la distinción visual durante el vuelo: hojas para el jugador, energía cian para perros. Una hoja reutilizable sirve para superficies impresas del libro y proyectiles; animación local de lectura/lanzamiento a partir de eventos aceptados. UI ES/EN actualizada y tres hallazgos visibles vinculados al HP existente. Tests previos de agarre de vara se reemplazan por los contratos del libro; se añaden conservación de fuente y vuelo de páginas antes del código.

La aclaración de R16 cambia el proyectil a una red de nodos conectados con una hoja central. La pose inclina la cabeza hacia el libro y pasa páginas. R17 reutiliza `buildDeck`, sus texturas y sus instancias; placas hexagonales biseladas, iluminación de juntas por tramos y grafismos de orientación alrededor de la plaza. No cambia la física del terreno.

La corrección de mouse añade giro horizontal/vertical a `world-camera` y `SceneHandle`, conservando el ajuste geométrico del jefe con ese ángulo. `WorldCanvas` distingue mouse de touch; no consume el arrastre izquierdo de mouse como joystick. La dirección WASD se rota con el azimut del visor. Se comprueba mediante eventos DOM y proyección de actores tras girar la cámara.

R18 añade huellas de las siete máquinas al conjunto de colisiones de actores, conservando los sólidos de decoración usados por proyectiles para no bloquear los disparos en su propio origen. Los compañeros reciben los mismos obstáculos y resuelven su seguimiento fuera de esos volúmenes.

R19 amplía `buildMachine(variant)` conservando `machine-head` y `status-light` usados por impactos, reparación y tests. Las variaciones añaden extremidades y masas distintas dentro de la huella nueva de R18. Se reutilizan `ModelParts`, la animación y los materiales, sin cambiar la lógica de combate.

## Ampliación R20 solicitada por Christian
Reutilizar Bullet/stepArena para las descargas, con puntería fijada al comenzar la señal y trayectoria sin persecución. Mantener tres hallazgos, pero resolver como máximo uno por recuperación (1,45 s); apoyo de los perros prolonga solo una recuperación existente hasta un máximo de 1,8 s. Movimiento puro de máquinas, con posiciones usadas por disparos, radar, modelos y colisiones. El jefe y sus restos se añaden a los sólidos de actores, conservando libres los proyectiles de su emisor. Pruebas de ciclos completos, evasión, recuperación, patrulla y bloqueo antes de implementación.
