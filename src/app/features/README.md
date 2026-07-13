# Features  ·  Angular Modular Feature-First

> Cada feature es un módulo vertical y autocontenido del producto.

## Qué va aquí
Una carpeta por feature (p. ej. `tickets/`, `users/`) con sus componentes, rutas, estado y servicios.

## Buenas prácticas
- Un feature no importa a otro feature: comparte vía `shared`/`core`.
- Rutas lazy por feature.
- El estado vive dentro del feature salvo que sea realmente global.

## Skills que aplican
- Siempre: `minimal-implementation`, `clean-code`, `solid-principles`, `modular-architecture`.
- `angular-component`, `angular-signals`, `angular-forms`, `angular-routing`

_Visión completa de la arquitectura: `docs/architecture.md`. Generado por chalc init — no borres esta guía._
