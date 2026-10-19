# Tasks: Entrada profesional

- [x] **T1** (R1, R5) — Tests Red del contrato de rutas. Revisar Red; cambiar raíz y añadir `/world`; Green.
- [x] **T2** (R2, R4, R6) — Tests Red de propuesta y contacto visible ES/EN. Revisar; actualizar Hero y conectar el modal único; Green.
- [x] **T3** (R3, R6) — Tests Red de tres casos, fuentes y traducciones. Revisar; mínimo catálogo y sección editorial en Home; Green.
- [x] **T4** (R5, R7, R8) — Tests Red de acceso al juego en navegación; implementar acceso, foco/responsive/reduced-motion y metadatos; Green y QA visual/build.
- [x] **T5** (R9–R12) — Tests Red de ubicación del recorrido, siete pasos y artefactos/condiciones; reproducción explícita, pausas, límites, limpieza, reduced-motion e idioma. Revisar antes del componente mínimo y su CSS explicativo; Green.
- [x] **T6** (R13) — Test Red sobre JSON servido para el máster terminado ES/EN; cambiar únicamente el estado y comprobar Green.
- [x] **T7** (R14–R17) — Tests Red de escena activa, tres roles seleccionables, artefactos de entrada/salida y devolución de hallazgos, controles concretos, pausa del único reloj y del movimiento CSS, reduced-motion e idioma. Revisar antes del bloque mínimo; Green.
- [x] **T8** (R1–R17) — Suite, build y mutation testing de lógica cambiada con score ≥80%; revisar diff, QA visual y evidencias. Sin despliegue. Excluir solo personalized-avatar.spec.ts del runner de mutation por su asset christian.glb previo inexistente, aprobado por coordinador.

- [x] **T9** (R18) — Extender pruebas existentes de calidad/revisión/idioma, confirmar Red y revisar; añadir OWASP Top 10 y ciclo de evidencia/corrección/aprobación en traducciones ES/EN; Green y QA puntual, sin lógica ni mutation nueva.

- [x] **T10** (R19) — Extender pruebas del catálogo real ES/EN/icono y del guion para destinos solo-tienda y su prioridad; confirmar Red y revisar; añadir Chranta/icono y mínimo fallback del guion; Green, mutation acotada, build y QA de Software. No modificar Flutter.

## Evidencia
- T1: Red aprobado por coordinador; 2 fallos esperados (`/tmp/cacruz-professional-home-routes-red.log`). Green: ruta raíz editorial y mundo opcional.
- T2: Red aprobado (`/tmp/cacruz-professional-home-hero-red.log`); Green 6/6 (`/tmp/cacruz-professional-home-hero-green.log`).
- T3: Red aprobado con 3 fallos de criterios y 3 tests previos verdes; Green 6/6 (`/tmp/cacruz-professional-home-cases-green.log`).
- T4: ajuste SEO y acceso Home/footer aprobado por coordinador antes de los tests.
- T4: Green 14/14 y metadatos comprobados. Build pasa. Suite amplia: 325/332; siete fallos anteriores por `models/character/christian.glb` ausente (spec 002), sin modificar ese trabajo. QA inicial del coordinador: escritorio y móvil preliminar (ancho CSS final pendiente), ES/EN, modal y /world/Inicio correctos.
- T5: Red 8/8 fallos esperados aprobado; Green 8/8 (`/tmp/cacruz-professional-home-chalc-green.log`). Recorrido con etapas/artefacto/condición, autoplay opt-in y preferencia de movimiento; pendiente QA final y mutation.
- T6: Red factual 2 fallos revisados; Green 2/2.
- Primera validación antes de R14+: suite335 verde, build verde; mutation80% global con huecos identificados (preferencia MQL, casos de entorno/equivalentes y pathMatch), pendientes de fortalecer y repetir tras la ampliación.
- T7 y refinamiento: Red revisado antes de código; Green18/18 (`/tmp/cacruz-professional-home-scene-refinement-green.log`). Estado manual estático/pausa, personajes y objetos CSS con play-state computado, retorno visible, CTA y autoría, última etapa42s.

## Validación final de implementación y QA aprobado
- Regresión del proyecto: **343/343** tests verdes con Karma/ChromeHeadless. Única exclusión aprobada: `src/app/features/world/scene/personalized-avatar.spec.ts`, cuyas 7 pruebas previas fallan porque `public/models/character/christian.glb` no existe. No se alteran esas pruebas ni el trabajo del avatar.
- Build de producción: correcto, sin errores de presupuesto; initial 362.18 kB. Comprobados metadatos y JSON ES/EN del máster terminado en `dist/cacruz/browser`.
- Mutation: **84.72%**, 61/72 mutantes muertos; workflow 81.40%, escena 88.89%, Home/Hero 100%. Reporte local ignorado `reports/mutation/professional-home.json`.
- Se reutilizó `stryker.config.json` y su runner Karma vía API, acotando fuentes nuevas/líneas cambiadas. Solo se excluye la prueba previa del GLB; `dist`/`.angular` se omiten de la copia de sandbox como outputs generados. La ejecución final fue secuencial después de una colisión de copia de `dist/test-out` al solapar procesos. No se añadió runner/config/dependencia persistente. No quedan sandboxes `.stryker-tmp`.
- Supervivientes clasificados: optional chaining/defaultView/MQL ausente y fallback de entorno (app actual de navegador, sin SSR); defaults de inputs que el padre siempre enlaza; guardia de reduced-motion inaccesible con botón deshabilitado; limpiar timeout indefinido y pausar al restaurar preferencia son equivalentes en el flujo alcanzable. `pathMatch: ''` conserva navegación real a raíz/proyectos verificada con RouterTestingHarness. No se quitaron defensas ni se falseó evidencia para subir el score. Las mutaciones funcionales de reloj, preferencia real query/evento, estado estático/pausado y selección de escena se detectan.
- Logs: `/tmp/cacruz-professional-home-suite-final.log`, `/tmp/cacruz-professional-home-build-final.log`, `/tmp/cacruz-professional-home-mutation-final.log`. Red/Green de refinamiento: `/tmp/cacruz-professional-home-scene-refinement-{red,green}.log`.
- `git diff --check`: limpio. `.gitignore`, `CLAUDE.md` y `.img2/` previos conservados. Sin commit, push o despliegue. Preview local `http://127.0.0.1:4207/` activo para QA.

- QA final aprobado por coordinador: anchos DOM **1440 y 390** sin overflow; escena/roles/artefactos legibles; reproducción mueve personaje, brazo y paquetes y Pausar congela todos (estado computado); paso final se detiene; selección manual pausa y actualiza; ES/EN conserva etapa y muestra Completed; CTA lleva al recorrido. Teclado/foco, contacto/Escape y juego/Inicio también comprobados. Sin cambios funcionales posteriores a estos checks.

- T9 (R18): Red revisado por coordinador con 3 fallos esperados/3 verdes (`/tmp/cacruz-professional-home-owasp-red.log`); Green **6/6** (`/tmp/cacruz-professional-home-owasp-green.log`). Solo seis strings ES/EN, sin HTML/lógica/animación. No se repite mutation por este copy.

## Ampliaciones posteriores: OWASP y Chranta
- T9 (R18): QA puntual del coordinador aprobado: badge ES de OWASP y revisión EN explican documentación/corrección/aprobación humana. No cambios de lógica o animación.
- T10 (R19): Red aprobado por coordinador: **6 fallos esperados/6 verdes** (`/tmp/cacruz-professional-home-chranta-red.log`). Green **21/21**, incluyendo catálogo servido ES/EN/icono, guion, SoftwarePage y DeployConsole (`/tmp/cacruz-professional-home-chranta-green.log`).
- Build de producción con ambas ampliaciones correcto (`/tmp/cacruz-professional-home-chranta-build.log`). Los cuatro productos anteriores permanecen idénticos a HEAD; JSON servido y construido coincide; icono en fuente/build idéntico byte a byte al original de Chranta. El repositorio Flutter no se modifica.
- Mutation acotada de R19: **100%**, 4/4 muertos, 0 supervivientes/sin cobertura. Se detectan ambas mutaciones del fallback `??` a `&&` y las salidas públicas; scope `deploy-script.ts:11-11` y `:22-22`, con Stryker/Karma/config existentes y la prueba del guion. Reporte `reports/mutation/chranta.json`; log `/tmp/cacruz-professional-home-chranta-mutation.log`. No hay configuración nueva o sandbox restante. No se repite mutation global por el copy/datos.
- `git diff --check -- src public specs` limpio; preview4207 activo. QA final del coordinador de Chranta en Software aprobado.

- T10 (R19), QA final aprobado por coordinador: Chranta es el quinto producto en ES/EN; iconos originales 1024×1024 cargados, descripción/highlights/stack correctos, enlace exacto de App Store y salida `LIVE → apps.apple.com`. Vista móvil con ancho DOM390 y scrollWidth390, sin overflow y con tarjeta legible. Se restauró el viewport y quedó la ficha ES expandida en el preview4207.
- Capturas del coordinador en outputs de la tarea: `chranta-software.jpg` (R19) y `chalc-owasp-top10.jpg` (R18). Logs Green/build/mutation comprobados por coordinador. No se hicieron cambios funcionales ni se repitieron pruebas después de esta aprobación; solo cierre de evidencia.

- [x] **T11** (R20) — Añadir el destino público de CraftDish en ES/EN; validar JSON y ausencia de otros cambios de catálogo, verificar LIVE y acceso web. Sin cambios de lógica ni despliegue.

- T11 (R20): JSON ES/EN válido; comparación estructural confirma que solo se añadió `url` a CraftDish. Web pública verificada en Chrome. QA local ES/EN: `LIVE → crafdish.com`, enlace exacto `https://crafdish.com/`, target `_blank`/rel `noopener`, sin aviso de próximo lanzamiento. Captura `outputs/craftdish-enlace-publico.jpg`. `git diff --check` limpio. Sin cambios de lógica, pruebas nuevas ni despliegue.

- [x] **T12** (R21) — Riverpod confirmado en el repositorio. Ampliación visual cancelada por la petición posterior R22 antes de cambiar datos; se restaura la aserción del catálogo.

- [x] **T13** (R22) — Actualizar el test existente de ficha sin tecnologías, comprobar Red y retirar el bloque compartido/estilos/traducciones; Green y QA ES/EN de los cinco productos.

- T13 (R22): test existente adaptado y Red confirmado (1 fallo esperado / 7 verdes, `/tmp/cacruz-software-no-stack-red.log`) antes de retirar el bloque compartido. Green Software completo: **23/23**, `/tmp/cacruz-software-no-stack-green.log`. Eliminados template del stack, sus estilos y traducciones sin uso. QA navegador ES/EN: cinco fichas desplegadas, cero bloques/etiquetas de tecnologías, cinco descripciones y nueve enlaces públicos conservados. Evidencia `outputs/software-sin-tecnologias.jpg`. Diff check limpio; no cambia lógica, datos Flutter ni despliegue.
