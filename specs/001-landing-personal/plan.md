# Plan: Landing page personal (portafolio + blog)

> Fase **Plan** — el CÓMO. Deriva de `spec.md`. Pide aprobación antes de generar tareas.

## Enfoque técnico

SPA Angular 20 standalone con signals, arquitectura **Modular Feature-First** ya definida
(`core` / `shared` / `features`). Sin dependencias nuevas de UI: diseño editorial hecho a mano
con CSS plano (design tokens en `styles.css`), animaciones CSS disparadas por una directiva
compartida con `IntersectionObserver`, e i18n en runtime con un servicio propio basado en
signals que carga JSON de traducción desde `public/i18n/`. Todo el contenido (experiencia,
proyectos, posts) vive como JSON en `public/content/` — publicar una entrada del blog es
agregar un archivo y una línea al índice, sin tocar código (R11).

Dos features lazy: `home` (landing con secciones hero, experiencia, tecnologías, proyectos)
y `blog` (lista + detalle). Rutas con `loadChildren`/`loadComponent`.

## Arquitectura / Componentes

### Core (`src/app/core/i18n/`)
- `language.model.ts` — type `Language = 'es' | 'en'` y constantes de idiomas soportados.
- `translations/es.ts`, `translations/en.ts`, `translations/index.ts` — diccionarios de UI por idioma (mapa plano clave→texto).
- `translation.service.ts` — signal del idioma activo, diccionario activo, persistencia en `localStorage`, `t(key)` (R13, R14, R15).
- `translate.pipe.ts` — pipe impuro ligero que delega en el servicio para plantillas (R13).

### Shared (`src/app/shared/`)
- `directives/reveal-on-scroll.directive.ts` — aplica clase de animación cuando el host entra al viewport vía `IntersectionObserver`; se desactiva con `prefers-reduced-motion` (R4, R16, R17).
- `components/language-switcher/language-switcher.ts|html|css` — selector ES/EN (R13).

### Feature: home (`src/app/features/home/`)
- `home.routes.ts` — ruta lazy del feature.
- `home.ts|html|css` — página que compone las secciones.
- `models/experience-entry.ts` — interface de una posición laboral.
- `models/tech-category.ts` — interface de categoría de tecnologías.
- `models/project.ts` — interface de proyecto destacado.
- `services/profile-content.service.ts` — carga `public/content/profile.{es,en}.json` con `httpResource` según idioma activo (experiencia, tecnologías, proyectos).
- `sections/hero/hero.ts|html|css` — hero con animación de entrada (R1, R2).
- `sections/experience/experience.ts|html|css` — línea de tiempo editorial (R3, R4).
- `sections/tech/tech.ts|html|css` — tecnologías por categoría (R5).
- `sections/projects/projects.ts|html|css` — layout editorial alternado con imagen, fallback visual `onerror`, y enlace al perfil (R6, R7, R8).

### Feature: blog (`src/app/features/blog/`)
- `blog.routes.ts` — rutas lazy: lista y `:slug`.
- `models/blog-post-meta.ts` — interface de metadatos de entrada (slug, fechas, título/resumen por idioma, tags).
- `models/blog-post.ts` — interface de entrada completa (meta + cuerpo por idioma).
- `services/blog.service.ts` — carga `public/content/blog/index.json` (listado, orden descendente por fecha) y `public/content/blog/<slug>.json` (detalle) (R9, R10, R11).
- `pages/blog-list/blog-list.ts|html|css` — listado editorial (R9).
- `pages/blog-post/blog-post.ts|html|css` — detalle; estado "no encontrado" con enlace de vuelta (R10, R12).

### Raíz
- `app.routes.ts` — rutas lazy hacia `home` y `blog`.
- `app.ts|html|css` — shell: navegación, language-switcher, `<router-outlet>`.
- `src/styles.css` — design tokens (paleta, tipografía, espaciado), keyframes de animación globales, `@media (prefers-reduced-motion)` (R16, R17, R18).

### Contenido (`public/`)
- `public/content/profile.es.json`, `profile.en.json` — experiencia, tecnologías, proyectos (desde `content.md`).
- `public/content/blog/index.json` + `public/content/blog/<slug>.json` — entradas del blog.
- `public/images/projects/*.svg` — imagen ilustrativa por proyecto (SVG propios, sin assets externos).

## Modelo de datos

| Entidad | Campos | Notas |
|---|---|---|
| ExperienceEntry | company, role, period, location, summary | textos ya localizados por archivo de idioma |
| TechCategory | name, items[] | agrupación frontend/backend/móvil/datos/IA/DevOps |
| Project | name, description, language, imageUrl, repoUrl | los 6 confirmados |
| BlogPostMeta | slug, date, title, summary, tags[] | title/summary localizados |
| BlogPost | meta + body | body en markdown-lite (párrafos) por idioma |
| Language | 'es' \| 'en' | default 'es' (R15) |

## Contratos / Interfaces

- `TranslationService.language: Signal<Language>`, `setLanguage(lang)`, `t(key): string`.
- `ProfileContentService.content: Resource<ProfileContent>` reactivo al idioma.
- `BlogService.posts(): Resource<BlogPostMeta[]>`, `post(slug): Resource<BlogPost | undefined>`.
- JSON de traducción: mapa plano `{ "nav.blog": "Blog", ... }`.

## Decisiones

- **CSS plano, sin Tailwind ni librerías de animación** — el proyecto ya compila `styles.css`; un diseño editorial a medida con tokens y keyframes propios cumple R2/R16 sin dependencias (implementación mínima).
- **i18n runtime propio (no @angular/localize, no ngx-translate)** — @angular/localize es build-time (rompería R13: cambio sin recarga); ngx-translate es una dependencia evitable: el servicio son ~40 líneas con signals (cubre R13–R15).
- **Diccionarios de UI en TypeScript (no JSON por HTTP)** — _enmienda aprobada en fase Plan_: el cambio de idioma queda síncrono e instantáneo (sin flash de claves sin traducir), sin estados de carga ni mocks HTTP en tests; los textos de UI cambian con el código, a diferencia del contenido del blog/perfil que sí es JSON runtime (R11).
- **Contenido como JSON en `public/`** — publicar = agregar archivo + línea de índice, sin recompilar lógica (R11); mantiene el sitio sin backend (fuera de alcance).
- **Imágenes de proyectos como SVG locales** — GitHub no ofrece screenshots; SVG propios por proyecto garantizan estética consistente y R8 sin dependencia externa.
- **`IntersectionObserver` en directiva compartida** — una sola implementación de reveal reutilizada por todas las secciones (R4, R16), apagable por `prefers-reduced-motion` (R17).
- **Presupuesto de estilos** — subir `anyComponentStyle` en `angular.json` (4kB→12kB warning) si el diseño editorial lo exige; los keyframes globales van en `styles.css` para no repetirlos.

## Riesgos / Dudas

- **Mutation testing (Artículo 7):** Stryker no está instalado. Se requiere agregar `@stryker-mutator/core` + `@stryker-mutator/karma-runner` como devDependencies en la fase Implement. ⚠️ Blocker si el registro npm está restringido — confirmar al aprobar el plan.
- Los tests con Karma requieren Chrome disponible en la máquina (ya se usa Chrome).

## Trazabilidad

- R1, R2 → `sections/hero/*` + tokens/keyframes en `styles.css`
- R3, R4 → `sections/experience/*` + `reveal-on-scroll.directive.ts`
- R5 → `sections/tech/*`
- R6, R7, R8 → `sections/projects/*` + `public/images/projects/*` + `profile.*.json`
- R9 → `blog.service.ts` + `pages/blog-list/*`
- R10, R12 → `pages/blog-post/*` + `blog.routes.ts`
- R11 → estructura `public/content/blog/` + `blog.service.ts`
- R13 → `translation.service.ts` + `translate.pipe.ts` + `language-switcher/*`
- R14, R15 → `translation.service.ts` (persistencia y default)
- R16, R17 → `reveal-on-scroll.directive.ts` + `styles.css`
- R18 → CSS responsive en secciones + `styles.css`

## Enmienda v — El mundo voxel en la raíz (R72–R87)

### Enfoque

`three@0.185.1` se carga con `import()` dinámico **dentro** del feature, para que su chunk no
bloquee el primer pintado (R85). Toda la lógica de juego —movimiento, límites, proximidad,
cámara y generación del terreno— vive en **funciones puras sin three.js**: así se testea con
Karma sin GPU y Stryker puede mutarla (Artículo 7 y skill `angular-threejs`). three.js
únicamente dibuja lo que esas funciones deciden.

### Feature: world (`src/app/features/world/`)

- `world.routes.ts` — ruta lazy montada en `''`.
- `world-page.ts|html|css` — compone la capa accesible en HTML y el canvas encima (R82, R83, R84).
- `world-canvas.ts` — componente del canvas: `afterNextRender`, `runOutsideAngular`, guarda `destroyed`, `dispose()` completo.
- `scene/world-scene.ts` — la escena three.js; no conoce Angular.
- `scene/scene-handle.ts` — contrato `dispose()`.
- `scene/build-terrain.ts` — suelo voxel con `InstancedMesh` (un draw call).
- `scene/build-character.ts` — el muñeco: cabeza con el avatar en la cara frontal, torso, brazos y piernas que se balancean según la velocidad.
- `scene/build-zone.ts` — la construcción voxel de una zona y su cartel.
- `model/` — un tipo por archivo (Artículo 4): `vector2.ts`, `character-state.ts`, `move-input.ts`, `world-zone.ts`, `world-bounds.ts`.
- `logic/step-character.ts` — aceleración, rozamiento, velocidad máxima, orientación y recorte a los límites (R74, R76).
- `logic/follow-camera.ts` — interpolación de la cámara con retardo (R75).
- `logic/nearest-zone.ts` — zona activa por proximidad (R78).
- `logic/world-zones.ts` — las ocho zonas: posición, clave de traducción y destino (R77, R79, R80, R81).
- `logic/terrain-blocks.ts` — generación determinista del suelo (sin `Math.random`, para que sea testeable).
- `logic/read-move-input.ts` — teclas y arrastre táctil a vector de dirección (R74, R87).

### Reutilización y borrado

`sections/hero/` y `sections/education/` se **mueven** de `features/home/` a `features/world/` y
alimentan el panel de presentación (R81); `features/home/` desaparece con la landing (R72). El
modal de contacto se reutiliza sin tocarlo desde `shared/` (R80). Las páginas de destino no se
modifican (R79).

### Decisiones

- **`InstancedMesh` para el terreno** — miles de cubos en un solo draw call; sin esto el móvil no aguanta.
- **Sin motor de físicas** — el mundo es plano con límites rectangulares: `step-character` resuelve el movimiento y el recorte con aritmética. Una dependencia menos.
- **Cara del avatar** — `images/avatar.png` como textura de la cara frontal de la cabeza; el resto del muñeco usa la paleta del sitio.
- **Calidad adaptativa (R87)** — `setPixelRatio(min(dpr, 2))` y menos bloques decorativos en pantallas angostas.
- **Movimiento reducido (R86)** — se apagan el orbitado de cámara y la oscilación decorativa; el personaje sigue siendo controlable.

### Riesgos

- El chunk de `world` rondará los 700 kB en crudo. **No rompe el budget** (solo se mide `initial`, hoy en 329 kB), pero obliga a pintar la capa HTML antes de cargar three.js (R85).
- Sin WebGL (R83) el constructor del renderer lanza: se envuelve en `try/catch` y se cae a la capa HTML.
- La escena no es testeable en Karma (ChromeHeadless sin GPU). Se cubre la lógica pura; el canvas se verifica con `ng build` y a ojo.

### Trazabilidad

- R72 → `app.routes.ts` + `world.routes.ts` + borrado de `features/home/`
- R73 → `scene/build-character.ts`
- R74, R76 → `logic/step-character.ts` + `logic/read-move-input.ts`
- R75 → `logic/follow-camera.ts`
- R77, R79 → `logic/world-zones.ts` + `scene/build-zone.ts`
- R78 → `logic/nearest-zone.ts` + traducciones
- R80 → reutilización de `shared/components/contact-modal/`
- R81 → `sections/hero/` + `sections/education/` movidos al feature
- R82, R83, R84 → `world-page.html` (capa accesible siempre en el DOM)
- R85 → `import()` dinámico + estado de carga en `world-canvas.ts`
- R86, R87 → `world-scene.ts` (calidad y movimiento adaptativos)

## Enmienda w — El mundo continuo del desarrollador (R88–R94)

### Enfoque

Un solo terreno: `PlaneGeometry` desplazada por **ruido de valor determinista** (sin `Math.random`).
La altura del suelo en cualquier punto sale de una función pura `terrainHeightAt(x, z)`, que es la
misma que usa la geometría: así el personaje pisa exactamente lo que se dibuja. Desaparecen
`platforms.ts` (islas y puentes) y `build-portals.ts` (letreros de neón).

El salto entra en `step-character.ts` como eje vertical con gravedad: lógica pura, testeable y
mutable. La cámara pasa a **perspectiva en tercera persona** que persigue con retardo (R90); una
tecla la recoloca detrás del personaje al instante.

Las zonas son **construcciones montadas con las piezas reales** de la aldea de Quaternius
(muros, tejados, puertas, suelos) y vestidas con la naturaleza de Kenney (R91). Cada una tiene un
cartel de madera pequeño con su nombre, solo visible de cerca (R92). Las animaciones del modelo
cubren todos los estados (Idle, Walk, Jog, Jump_Start/Loop/Land, Sitting) (R93).

### Archivos

**Lógica pura (`world/logic/`) — con tests y mutation testing**
- `terrain-height.ts` — ruido de valor + límite exterior: altura del suelo y `isInsideWorld` (R88, R94).
- `step-character.ts` — se añade eje vertical: `y`, `verticalSpeed`, `grounded`; gravedad, `jump()` solo desde el suelo (R89).
- `follow-camera.ts` — se extiende a 3D con un `recenter()` que anula el retardo (R90).
- `world-zones.ts` — las ocho zonas como posiciones sobre el terreno, con su huella y su entrada.
- `read-move-input.ts` — se añaden espacio (salto) y `c` (centrar).

**Escena (`world/scene/`) — sin Angular**
- `build-terrain.ts` — la malla del suelo desde `terrainHeightAt`, con `flatShading`.
- `build-landmarks.ts` — una construcción por zona a partir de piezas glTF reales + cartel de madera.
- `build-decor.ts` — se adapta al terreno continuo (bosques, rocas, caminos).
- `character-animator.ts` — se añade el estado de salto.
- `world-scene.ts` — cámara en perspectiva, terreno, salto, recentrado.

**Angular**
- `world-canvas.ts` — espacio y `c`; botón de salto táctil (R87, R89).

### Decisiones
- **Perspectiva y no ortográfica.** Un mundo que se recorre entero se entiende mejor desde detrás del personaje que desde una maqueta cenital.
- **Terreno finito con borde.** Radio ~48. Fuera del borde `isInsideWorld` es falso y el paso se recorta (R94). Sin muros invisibles que se noten: el terreno cae en acantilado.
- **Construcciones ensambladas, no modeladas.** Las piezas modulares de la aldea encajan en rejilla de 2 unidades; una oficina son 4 muros, 1 puerta, 1 tejado, 1 suelo.

### Riesgos
- El chunk `world-scene` ronda 138 kB comprimidos y los modelos 8 MB: se cargan tras el primer pintado, con porcentaje (R85). Aceptable para la raíz porque no bloquea nada.
- La textura del maniquí no existe (viene sin mapas): se tiñe por material. Un personaje con tu cara sigue requiriendo un modelo propio.

### Trazabilidad
- R88, R94 → `terrain-height.ts` + `build-terrain.ts`
- R89 → `step-character.ts` (vertical) + `read-move-input.ts` + `character-animator.ts`
- R90 → `follow-camera.ts` + `world-scene.ts`
- R91, R92 → `world-zones.ts` + `build-landmarks.ts`
- R93 → `character-animator.ts`
