# Tasks: Landing page personal (portafolio + blog)

> Fase **Tasks** — tareas atómicas ordenadas, cada una trazada a un requisito.
> `[P]` = paralelizable dentro de su bloque. TDD estricto: test en Rojo antes de cada implementación.

## Bloque 1 — Core i18n (R13, R14, R15)

- [x] **T1** — `core/i18n/language.model.ts`: type `Language` + idiomas soportados + default. _(R13, R15)_
- [x] **T2** [P] — `core/i18n/translations/{es,en,index}.ts`: diccionarios de UI. _(R13)_
- [x] **T3** — Tests Rojo → `core/i18n/translation.service.ts`: idioma activo (signal), default `es`, persistencia `localStorage`, `t(key)` con fallback a la clave. _(R13, R14, R15)_
- [x] **T4** — Tests Rojo → `core/i18n/translate.pipe.ts`: pipe impuro que delega en el servicio. _(R13)_

## Bloque 2 — Shared (R4, R13, R16, R17)

- [x] **T5** — Tests Rojo → `shared/directives/reveal-on-scroll.directive.ts`: clase de revelado vía `IntersectionObserver`; visible de inmediato con `prefers-reduced-motion`. _(R4, R16, R17)_
- [x] **T6** — Tests Rojo → `shared/components/language-switcher/`: cambia idioma vía servicio, marca el activo. _(R13)_

## Bloque 3 — Contenido estático (R3, R5, R6, R9, R11)

- [x] **T7** [P] — `public/content/profile.es.json` + `profile.en.json` desde `content.md`. _(R3, R5, R6)_
- [x] **T8** [P] — `public/content/blog/index.json` + entrada de ejemplo `<slug>.json` (ES/EN). _(R9, R11)_
- [x] **T9** [P] — `public/images/projects/*.svg`: 6 ilustraciones SVG locales. _(R6, R8)_

## Bloque 4 — Feature home (R1–R8)

- [x] **T10** [P] — Modelos: `experience-entry.ts`, `tech-category.ts`, `project.ts`, `profile-content.ts`. _(R3, R5, R6)_
- [x] **T11** — Tests Rojo → `features/home/services/profile-content.service.ts`: carga perfil según idioma activo. _(R3, R5, R6, R13)_
- [x] **T12** — Tests Rojo → `sections/hero/`: nombre, tagline, enlaces GitHub/LinkedIn, animación de entrada. _(R1, R2)_
- [x] **T13** — Tests Rojo → `sections/experience/`: timeline editorial con reveal. _(R3, R4)_
- [x] **T14** — Tests Rojo → `sections/tech/`: categorías de tecnologías. _(R5)_
- [x] **T15** — Tests Rojo → `sections/projects/`: layout alternado, imagen con fallback, enlace al perfil. _(R6, R7, R8)_
- [x] **T16** — `features/home/home.ts` + `home.routes.ts`: composición de secciones y ruta lazy. _(R1)_

## Bloque 5 — Feature blog (R9–R12)

- [x] **T17** [P] — Modelos: `blog-post-meta.ts`, `blog-post.ts`. _(R9, R10)_
- [x] **T18** — Tests Rojo → `features/blog/services/blog.service.ts`: listado ordenado desc por fecha; detalle por slug; `undefined` si no existe. _(R9, R10, R11, R12)_
- [x] **T19** — Tests Rojo → `pages/blog-list/`: listado con título, fecha, resumen, tags en idioma activo. _(R9, R13)_
- [x] **T20** — Tests Rojo → `pages/blog-post/`: detalle + estado "no encontrado" con enlace de vuelta. _(R10, R12)_
- [x] **T21** — `blog.routes.ts`: rutas lazy lista y `:slug`. _(R10)_

## Bloque 6 — Shell y estilos (R2, R13, R16, R17, R18)

- [x] **T22** — `app.routes.ts` + shell `app.ts|html|css`: navegación, language-switcher, outlet; test de shell actualizado. _(R13, R18)_
- [x] **T23** — `styles.css`: design tokens, tipografía editorial, keyframes, `prefers-reduced-motion`, responsive. _(R2, R16, R17, R18)_
- [x] **T24** — `index.html`: lang, título y meta description.

## Bloque 8 — Identidad visual viva (R19–R23, enmienda)

- [x] **T27** — Tests Rojo → `sections/hero/typewriter.ts`: reducer puro del efecto máquina de escribir + integración en hero. _(R19, R23)_
- [x] **T28** — Marquee de tecnologías en `sections/tech/`. _(R20, R23)_
- [x] **T29** — Paleta vívida + fondo animado (gradientes/retícula) + barra de progreso de scroll. _(R21, R23)_
- [x] **T30** — Piezas gráficas del hero (stats), timeline/proyectos/blog con glow y micro-animaciones, SVGs de proyectos animados. _(R22, R4, R16)_
- [x] **T31** — Suite en verde + mutation testing incluyendo `typewriter.ts` (score 100%, 87/87) + build. _(Artículo 7)_

## Bloque 9 — Ajustes de dirección visual (R24–R25, enmienda b)

- [x] **T32** — Paleta sin azul: acentos dorado/violeta/coral en tokens, glows, aurora y SVGs azulados. _(R24)_
- [x] **T33** — Tests Rojo → trayectoria serpenteante: items alternados con rotación de entrada tipo rueda + fallback móvil. _(R25)_
- [x] **T34** — Tests Rojo → tecnologías vivas: ícono por categoría + cascada escalonada (`--i`) + flotación continua. _(R26)_
- [x] **T35** — Tests Rojo → proyectos numerados (01, 02…) con arte flotante y brillo al hover. _(R27)_
- [x] **T36** — Refactor: modelos + servicio de contenido a `core/content/`; features `experience/` y `proyectos/` con rutas propias; nav actualizada. _(R29)_
- [x] **T37** — Formación académica: modelo, contenido ES/EN y sección con tests. _(R28)_
- [x] **T38** — Gráfico orbital de apertura en el hero (SVG inline autodibujado). _(R30)_
- [x] **T39** — Suite en verde + mutation + build. _(Artículo 7)_

## Bloque 7 — Calidad

- [x] **T25** — Suite completa en verde + `ng build` sin errores. _(todos)_
- [x] **T26** — Stryker instalado y configurado; mutation testing sobre lógica crítica (i18n, blog, profile, directiva) con score 100% (52/52 mutantes muertos). _(Artículo 7)_

## Bloque 12 — El mundo voxel en la raíz (R72–R87, enmienda v)

- [ ] **T40** — Tests Rojo → `world/model/*` + `world/logic/step-character.ts`: aceleración, rozamiento, tope de velocidad, orientación de avance y recorte a los límites. _(R74, R76)_
- [ ] **T41** — Tests Rojo → `world/logic/follow-camera.ts`: la cámara persigue al personaje con retardo y sin sobrepasarlo. _(R75)_
- [ ] **T42** — Tests Rojo → `world/logic/world-zones.ts`: las ocho zonas con posición, clave i18n y destino; sin destinos duplicados. _(R77, R79, R80, R81)_
- [ ] **T43** — Tests Rojo → `world/logic/nearest-zone.ts`: zona activa por proximidad dentro del radio, la más cercana si hay varias. _(R78)_
- [ ] **T44** — Tests Rojo → `world/logic/read-move-input.ts`: teclas y arrastre a vector normalizado. _(R74, R87)_
- [ ] **T45** — Tests Rojo → `world/logic/terrain-blocks.ts`: generación determinista del suelo. _(R72)_
- [ ] **T46** — `world/scene/*`: terreno instanciado, muñeco con el avatar, zonas y luces. Sin Angular. _(R72, R73, R77)_
- [ ] **T47** — `world/world-canvas.ts`: `afterNextRender`, `import()` dinámico, `runOutsideAngular`, guarda `destroyed` y `dispose()` completo. _(R85, skill `angular-threejs`)_
- [ ] **T48** — `world/world-page.*`: capa accesible en HTML siempre presente + canvas encima + fallback sin WebGL. _(R82, R83, R84)_
- [ ] **T49** — Mover `sections/hero/` y `sections/education/` a `world/`, borrar `features/home/`, montar `world.routes.ts` en `''`. _(R72, R81)_
- [ ] **T50** — Traducciones ES/EN de los nombres de zona y de los controles. _(R78)_
- [ ] **T51** — Suite en verde + mutation testing sobre `world/logic/*` (score ≥ 80%) + `ng build`. _(Artículo 7)_

## Bloque 13 — El mundo continuo del desarrollador (R88–R94, enmienda w)

- [ ] **T52** — Tests Rojo → `logic/terrain-height.ts`: determinista, acotada, `isInsideWorld` falso fuera del radio. _(R88, R94)_
- [ ] **T53** — Tests Rojo → `logic/step-character.ts` vertical: gravedad, salto solo desde el suelo, aterrizaje sobre `terrainHeightAt`, sin salir del mundo. _(R89, R94)_
- [ ] **T54** — Tests Rojo → `logic/follow-camera.ts` 3D + `recenter()`. _(R90)_
- [ ] **T55** — Tests Rojo → `logic/read-move-input.ts`: espacio → salto, `c` → centrar. _(R89, R90)_
- [ ] **T56** — `logic/world-zones.ts`: ocho zonas sobre el terreno con huella y entrada. _(R91, R92)_
- [ ] **T57** — `scene/build-terrain.ts` + `scene/build-decor.ts` adaptado. _(R88)_
- [ ] **T58** — `scene/build-landmarks.ts`: construcciones con piezas glTF reales + cartel de madera. _(R91, R92)_
- [ ] **T59** — `scene/character-animator.ts` con salto; `scene/world-scene.ts` con cámara en perspectiva, terreno, salto y recentrado. _(R89, R90, R93)_
- [ ] **T60** — `world-canvas.ts`: teclas espacio y `c`, botón de salto táctil. _(R87, R89, R90)_
- [ ] **T61** — Borrar `platforms.ts`, `build-portals.ts`, `build-platforms.ts`; suite en verde; Stryker sobre `logic/*` ≥ 80%; `ng build`. _(Artículo 7)_
