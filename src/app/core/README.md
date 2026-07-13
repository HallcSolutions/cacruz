# Core  ·  Angular Modular Feature-First

> Servicios singleton y configuración transversal, cargados una sola vez.

## Qué va aquí
Guards, interceptors HTTP, configuración global, providers de raíz y servicios de arranque.

## Buenas prácticas
- Sin UI ni reglas de negocio aquí.
- Se importa solo desde el root; nunca desde un feature.
- Una responsabilidad por servicio/provider.

## Skills que aplican
- Siempre: `minimal-implementation`, `clean-code`, `solid-principles`, `modular-architecture`.
- `angular-di`, `angular-routing`, `angular-http`

_Visión completa de la arquitectura: `docs/architecture.md`. Generado por chalc init — no borres esta guía._
