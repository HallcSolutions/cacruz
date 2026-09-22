# Tasks: Encuentro con Deuda técnica

Plan del encuentro aprobado por Christian. Una tarea a la vez; cada tarea de código requiere tests aprobados, Red, Green y refactor. Validar mutaciones en la lógica crítica con Stryker existente (≥80 %), reforzando supervivientes críticos.

- [x] **T1 (R9)** — Crear y guardar referencia visual del avatar desde la fotografía de Christian. Resultado: `christian-avatar-reference.png`. Referencia visual aprobada por Christian; no constituye modelo integrado.
- [ ] **T2 (R9)** — Definir contratos y tests de carga, animaciones y limpieza del avatar; presentar para aprobación, confirmar Red e integrar el modelo personal con el flujo de modelado elegido. Verificar parecido y locomoción en navegador.
- [ ] **T3 (R1)** — Tests de encuadre responsive y seguimiento; Red → ajustar cámara → Green y capturas.
- [ ] **T4 (R2)** — Tests de activación y aparición única; Red → estado y criatura articulada → Green y revisión visual.
- [ ] **T5 (R3)** — Tests de escaneo, hallazgos y control fallido; Red → análisis Sonar simulado → Green.
- [ ] **T6 (R4)** — Tests de alcance, análisis previo, cooldown, reserva e impacto; Red → refactorización → Green.
- [ ] **T7 (R5)** — Tests de anticipación, colisiones, esquiva y daño único; Red → comportamiento del monstruo → Green.
- [ ] **T8 (R6)** — Tests de resolución y victoria única; Red → reacciones y derrota → Green.
- [ ] **T9 (R7)** — Tests de HUD, idioma y controles; Red → presentación accesible → Green.
- [ ] **T10 (R8)** — Tests de reinicio y limpieza; Red → ciclo completo → Green.
- [ ] **T11 (R1–R9)** — Build, comprobación de carga lazy, verificación visual escritorio/móvil, navegación, teclado/táctil y evidencias de Stryker. No cerrar el encuentro antes de completar estas comprobaciones.

## T2 — preparación

Pruebas propuestas en `src/app/features/world/scene/personalized-avatar.spec.ts`: carga real del GLB personal, geometría volumétrica, textura, esqueleto, clips compatibles, movimiento medido en el controlador actual, independencia del clon y detención al liberar. Pendientes de aprobación y ejecución Red. Estas comprobaciones no certifican parecido ni ausencia de deformaciones: se requieren renders de cara/manos y movimiento.

Probe offline de img2glb correcto; no se envió ninguna imagen. Christian autorizó expresamente enviar la referencia aprobada a `trellis-community/TRELLIS`. No se envía la foto original.

Bloqueo de entorno: ni Python del sistema ni el runtime de Codex incluyen `gradio_client` y `huggingface_hub`, requeridos por img2glb. No se instaló tooling ni se llamó al servicio. Se requiere autorización para un entorno Python local con esas dependencias según AGENTS.md. Typecheck de los tests: `tsc --project tsconfig.spec.json --noEmit`, correcto; Red/Green y Stryker aún no ejecutados.

## T2 — ejecución autorizada (2026-09-17)

Christian aprobó instalación y tests. Dependencias instaladas en `.venv-avatar`; versiones guardadas en `avatar-requirements.txt`. Red confirmado con Karma/ChromeHeadless: 7 tests fallan por HTTP 404 de `/models/character/christian.glb`. La primera ejecución restringida abortó; la ejecución con permisos ampliados completó los tests. Solicitud TRELLIS iniciada con referencia autorizada, textura 2048 y simplificación 0.95; resultado pendiente.

### Resultado de generación y bloqueo actual

Malla estática generada: 4.560.088 bytes, 15.403 triángulos, una malla/material, cero skins y clips. Integridad GLB correcta. Revisión en navegador de frente, espalda y rostro: fondo convertido en base, parecido facial insuficiente y picos en pelo. Suavizado de normales probado solo en visor; GLB original conservado. No aprobada para integración.

Segundo intento con la misma referencia autorizada, seed 21 y simplificación 0.90: proveedor deniega por cuota ZeroGPU, espera indicada 23:57:38. Sin reintentos adicionales ni otro proveedor. T2 sigue pendiente; juego sin cambios. Evidencia estructurada: `avatar-generation-report.json`. Visor local temporal: `http://127.0.0.1:8766/tmp/avatar-preview/`.
