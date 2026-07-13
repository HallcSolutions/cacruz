# Decisión arquitectónica inicial

> Stack: Angular (TypeScript)

## Principios obligatorios (siempre)

- implementación mínima
- Clean Code
- SOLID
- arquitectura modular
- alta cohesión y bajo acoplamiento
- código testeable desde el diseño
- responsabilidades explícitas por carpeta, archivo y símbolo

## Lectura de la propuesta

- Tipo detectado: aplicación
- Complejidad estimada: baja
- Señales: auth
- Pendiente por confirmar: data

## Arquitectura seleccionada

- Angular Modular Feature-First
- Encaja cuando: MVPs, dashboards y productos que necesitan velocidad sin perder orden.
- Tradeoff: Menos ceremonia inicial; cuida los boundaries para no degradarse al crecer.

## Mapa de carpetas (qué va en cada una)

### `src/app/core` — Core
Guards, interceptors HTTP, configuración global, providers de raíz y servicios de arranque.
Skills que aplican: `angular-di`, `angular-routing`, `angular-http`

### `src/app/shared` — Shared
Componentes de presentación reutilizables, pipes, directivas, utilidades y tipos compartidos.
Skills que aplican: `angular-component`, `angular-directives`, `responsive-design`, `tailwind-best-practices`

### `src/app/features` — Features
Una carpeta por feature (p. ej. `tickets/`, `users/`) con sus componentes, rutas, estado y servicios.
Skills que aplican: `angular-component`, `angular-signals`, `angular-forms`, `angular-routing`

## Reglas de dependencia

Cada feature depende de `shared` y `core`, **nunca de otro feature**. `core` se carga una sola vez; `shared` no conoce a las features.

## Cómo agregar un feature

1. Crea `features/<feature>/` con su ruta lazy.
2. Pon sus componentes, estado y servicios dentro de esa carpeta.
3. Lo reutilizable sube a `shared`; lo transversal a `core`.
4. Test-First; el feature no importa a otro feature.

## Preguntas resueltas con el usuario

- ¿Incluye funcionalidades como autenticación o áreas protegidas?
  → no
- ¿Se espera que el sitio crezca con mucho contenido o múltiples secciones complejas?
  → si

## Regla de gobierno

Chalc sugiere y prepara, pero no es autoridad. La arquitectura seleccionada es una decisión del usuario: revisa tradeoffs, ajusta cuando aprendas más del dominio y cambia esta decisión si el contexto real lo exige.
