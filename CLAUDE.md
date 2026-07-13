<!-- chalc:start -->
## ⚙️ Chalc

### ✅ Principios obligatorios (SIEMPRE)
Implementación mínima, Clean Code, SOLID y **arquitectura modular** aplican a **todo** el código de este proyecto, sin excepción:
alta cohesión y bajo acoplamiento, unidades pequeñas, nombres explícitos, una responsabilidad por
archivo/carpeta/símbolo, código testeable desde el diseño y el cambio más pequeño que satisface el
requisito aprobado o test fallando actual. Reutiliza código existente y APIs del framework antes de crear
archivos, wrappers, abstracciones, dependencias, tooling o capas. Las skills `minimal-implementation`,
`clean-code`, `solid-principles` y `modular-architecture` definen el detalle — **ábrelas y aplícalas por defecto**, no solo cuando se pidan.

### 🏛️ Arquitectura
Arquitectura acordada: **Angular Modular Feature-First**.
Antes de crear o mover CUALQUIER archivo, lee `docs/architecture.md` — define las capas, qué va en cada carpeta, las reglas de dependencia y cómo agregar un feature. Cada carpeta tiene además su propio `README.md` con su rol. Mantén todo el código dentro de esos límites.

### Skills activas
- `angular-component`
- `angular-di`
- `angular-directives`
- `angular-forms`
- `angular-http`
- `angular-routing`
- `angular-signals`
- `angular-ssr`
- `angular-testing`
- `angular-tooling`
- `tailwind-best-practices`
- `responsive-design`
- `interface-design`
- `angular-migration`
- `clean-code`
- `minimal-implementation`
- `solid-principles`
- `modular-architecture`
- `mutation-testing`
- `dev-note` — cómo redactar y publicar una nota de `/daily` (formato de bloques tipo `.md`, tono, gráficos SVG)

### Servidores MCP
- `angular-cli` — Servidor MCP oficial del Angular CLI (on-demand, no requiere instalar nada).

## ⚙️ Método: Spec-Driven Development (SDD)

Este proyecto trabaja **por especificación**. La spec es la **fuente de verdad**, no el código.
El orden es **innegociable**: **especificación → pruebas → código**. Nunca escribas código antes
de tener tests que **fallen** (Red).

### Flujo obligatorio (5 fases, en orden)
1. **Constitución** — lee `specs/constitution.md` antes de nada. Son principios no negociables (incluye Test-First).
2. **Specify** → `specs/NNN-feature/spec.md` — el **QUÉ** y el **PORQUÉ**. Historias de usuario + criterios de aceptación en **notación EARS** (`WHEN … THE SYSTEM SHALL …`). Sin detalles de implementación.
3. **Plan** → `plan.md` — el **CÓMO**: arquitectura, modelo de datos, contratos/interfaces, decisiones. Pide aprobación antes de seguir.
4. **Tasks** → `tasks.md` — tareas atómicas y ordenadas, cada una **trazada a un requisito** (`R1`, `R2`…). `[P]` marca las paralelizables.
5. **Implement (TDD estricto)** — por cada tarea:
   1. Escribe los **tests** desde los criterios de aceptación.
   2. Confírmalos en **FALLO** (Red).
   3. Escribe el **mínimo código** para pasarlos (Green).
   4. Refactoriza sin romper tests.
   5. Corre **mutation testing** apoyándote en la skill `mutation-testing` del proyecto; si sobreviven mutantes, refuerza los tests hasta matarlos (score ≥ 80%).

### Reglas duras
- **Test-First:** ningún código de implementación antes de un test que falla y esté aprobado.
- **Trazabilidad:** toda tarea y todo test apunta a un requisito de la spec.
- **Spec viva:** si el código o el alcance cambia, actualiza la spec primero.
- **Una cosa por archivo:** interfaces, DTOs y types en su propio archivo, nunca dentro de servicios/componentes.

### Cómo trabajar (mantén el foco)
- **Una tarea a la vez:** antes de cada tarea di qué `R#` implementa; al terminarla, párate y espera OK.
- **Skills bajo demanda:** abre solo la skill que la tarea activa necesita (`.claude/skills` o `.chalc/skills`); no las pre-cargues todas.
- **Lectura acotada:** lee la constitución, esta spec/plan/tasks y los archivos que toca la tarea; no explores todo el repo.
- **Herramientas del proyecto:** usa el framework de pruebas y la config que el proyecto **ya** tiene; no inventes config. Si falta tooling, el registro es privado o algo no compila, repórtalo como blocker y pregunta — no improvises ni cambies de herramienta por tu cuenta.

Plantillas en `specs/_template/`. Para una feature nueva: copia `_template/` a `specs/NNN-nombre/`.
La carpeta oficial siempre es `specs/` en plural. Si está disponible, usa `chalc spec` solo para preparar la carpeta y archivos vacíos; no redacta la spec.
<!-- chalc:end -->
