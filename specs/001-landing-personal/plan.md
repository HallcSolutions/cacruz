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
