# Plan: Encuentro con Deuda técnica

Estado: plan del encuentro aprobado por Christian. Se incorpora su solicitud de avatar basado en fotografía; implementación pendiente de tests aprobados y Red.

## Enfoque técnico

Construir un solo encuentro completo en `features/world`. Reutilizar movimiento, colisiones, salud, controles, cámara y render. Criatura procedural articulada con primitivas de Three.js y materiales compartidos; sin servicios de generación ni nuevas dependencias.

La referencia `digital-language-sandbox/frontend/src/app/game-runtime/three/exploration` separa personaje, marcha y disposición. Se toma su criterio de presencia y movimiento, sin importar su runtime ni su modelo infantil. El GLB y los clips de cacruz permiten comenzar ajustando encuadre e iluminación.

## Arquitectura / Componentes

- `world/logic/`: transición determinista del encuentro, análisis, alcance, temporizadores, impactos y reinicio. Reutilizar `health.ts`, colisiones y `follow-camera.ts`.
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

Fases: inactivo, aparición, persecución, anticipación, ataque, recuperación, derrota y jugador derrotado. Configuración local de velocidad, alcance, daño y duración, sin catálogo genérico.

## Contratos / Interfaces

Una función pura recibe estado, acción, jugador, delta de tiempo y consulta de colisión; devuelve estado y eventos. La escena interpreta eventos, no calcula daño. Angular recibe solo cambios relevantes, no cada frame. Definir cada contrato en su archivo al escribir los tests.

F y el botón contextual ejecutan refactorización durante el encuentro y los comandos existentes fuera de él. «Analizar con Sonar» es una acción independiente del HUD, operable con teclado y táctil. Cada corrección reserva un hallazgo para impedir que varias resuelvan el mismo o resten vida de más. Victoria y daño se emiten una sola vez por transición/ataque.

## Decisiones

- R1: acercar cámara conservando seguimiento y zoom existentes; revisar tamaño visible y oclusión en escritorio y móvil.
- R2/R5: criatura articulada y señal de ataque sobre el suelo, colocada en área despejada. Anticipación antes del impacto; salto y desplazamiento permiten esquivar.
- R3/R4: Sonar revela hallazgos predefinidos. La refactorización es una mecánica del juego; no ejecuta código ni promete un diagnóstico real.
- R6/R7: vincular impacto, reacción del cuerpo, hallazgo resuelto, vida y control de calidad. Textos traducidos en HTML y marcador sobre el objetivo.
- R8: reutilizar salud, reiniciar sin recargar y eliminar correcciones pendientes. Pausar el encuentro con modal abierto o pestaña oculta.
- Mantener navegación independiente, fallback y R86 para cámara y movimiento decorativo.

## Validación

Tras aprobar el plan, redactar tareas atómicas trazadas. Por bloque: tests Jasmine aprobados → Red confirmado → implementación mínima → Green → Stryker usando Karma y configuración existentes, con score mínimo del 80 % y sin supervivientes críticos. No introducir runners nuevos.

Tests: aparición única; escaneo sin daño; control fallido con hallazgos pendientes; refactorización antes de analizar/fuera de alcance; cooldown; reserva de hallazgos; impacto único; anticipación sin daño; esquiva; colisiones; victoria única; reinicio y cierre. Tests de componentes para HUD, idioma y controles, sin instanciar WebGLRenderer.

Revisión visual en navegador a 1440×900 y 390×844: cuerpo completo del avatar, monstruo distinguible de torretas, nombre y vida legibles, escaneo visible, anticipación del ataque, reacción y derrota. Probar teclado, táctil, navegación de ida/vuelta y movimiento reducido. Ejecutar build y verificar carga lazy y budgets existentes.

## Riesgos / Dudas

La sensación de peso requiere revisión en movimiento; los tests de lógica no acreditan calidad visual. Las construcciones pueden ocultar al personaje: ajustar área y encuadre antes de introducir sistemas de transparencia. La geometría procedural permite una primera criatura jugable, cuya calidad se evaluará antes de ampliar enemigos.

## Trazabilidad

| Requisito | Responsable | Evidencia |
| --- | --- | --- |
| R1 | Cámara y avatar | Capturas responsive y regresión de movimiento |
| R2 | Estado y representación | Aparición única y revisión visual |
| R3 | Análisis y hallazgos | Escaneo, etiquetas y control fallido |
| R4 | Corrección | Alcance, requisito previo, cooldown e impacto |
| R5 | Ataque y señal | Tiempos, obstáculos, daño único y esquiva |
| R6 | Eventos y resultado | Vida, hallazgos y victoria única |
| R7 | Página y traducciones | HUD, teclado y táctil |
| R8 | Reinicio y ciclo de vida | Restauración y limpieza |

## Enmienda: avatar personal (R9)

Referencia creada con imagegen desde `/Users/christiancruz/Documents/Christian_Cruz_Arango.png`, guardada como `christian-avatar-reference.png`. Conserva rasgos faciales, camisa azul clara, pantalón oscuro y zapatos oscuros. Es una imagen de diseño; todavía se requiere modelado, rig y validación de animaciones para representarla en el juego. Revisar la referencia visual antes de producir el modelo, y seleccionar el flujo de modelado mediante la skill pertinente. No considerar una textura de retrato sobre el modelo genérico equivalente a este requisito.
