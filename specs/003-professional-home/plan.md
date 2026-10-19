# Plan: Entrada profesional

## Enfoque técnico
Reactivar `features/home` en `/` y mover la ruta lazy del mundo a `/world`. Reorientar el Hero existente a una propuesta clara; renderizar tres casos editoriales en Home antes de la formación. Reutilizar ContactModal, TranslatePipe, señales y tokens actuales; no importar otros features ni añadir dependencias.

## Arquitectura y archivos previstos
- `src/app/app.routes.ts` y `app.routes.spec.ts`: contrato de entrada lazy y ruta del juego.
- `src/app/app.html`, `app.css`, `app.spec.ts`: acceso secundario al mundo desde el footer; la cabecera conserva los destinos actuales y el retorno al inicio.
- `src/app/features/home/home.{ts,html,css,spec.ts}`: orquestar Hero, tres casos, contenido existente y un único modal de contacto.
- `src/app/features/home/featured-cases.ts`: catálogo corto de tres casos, claves de traducción y URLs de repositorios existentes.
- `src/app/features/home/sections/hero/hero.{ts,html,css,spec.ts}`: propuesta visible, acceso a casos y evento de contacto para el modal que posee Home; conservar identidad visual propia.
- `src/app/core/i18n/translations/{es,en}.ts`: nuevo contenido ES/EN. No alterar credenciales.
- `src/index.html`: título, descripción y metadatos de compartir alineados; sin canónica global.
- `specs/003-professional-home/{spec,plan,tasks}.md`: trazabilidad y evidencia.

## Decisiones
- Entrada explícita a `/world`, no detección de referrer: funciona también con enlaces copiados o referencias bloqueadas (R1/R5).
- Chalc, RAG contratos y Cacode: son casos documentados actualmente; no se inventan capacidades o resultados (R3).
- El juego aparece como invitación secundaria en Home y footer, sin saturar la cabecera con otro destino (R5/R7).
- Los metadatos de index son compartidos por la SPA; se alinean a la propuesta sin canónica global o nuevo servicio de SEO (R8).
- Casos estáticos pequeños: se muestran sin depender de cargar el JSON completo del perfil, y los textos se localizan por el servicio existente (R3/R6).
- Una señal de contacto en Home y un output en Hero: un solo modal, sin servicio o wrapper adicional (R4).
- Mantener paleta carbón/lavanda, tipografía editorial, monoespaciada y avatar propios; reducir el bloque de consola y animaciones que retrasan la comprensión (R2/R7).
- Test runner: Karma/Jasmine existente; mutation runner: Stryker Karma existente, acotado a la lógica de Home/Hero, sin configuración paralela.

## Ampliación Chalc (R9–R13)
- `features/home/sections/chalc-workflow/chalc-workflow.{ts,html,css,spec.ts}`: componente cohesivo que presenta el recorrido y posee únicamente índice, reproducción y temporizador. Pruebas del contrato observable montan Home para poder comprobar el primer Red sin crear código previo.
- `features/home/sections/chalc-workflow/chalc-workflow-steps.ts`: siete ids de etapa y artefactos/comandos documentados; textos mediante traducciones existentes, sin cliente API o ejecución de comandos.
- `features/home/sections/chalc-workflow/README.md`: responsabilidad y límites de esta sección.
- `home.{ts,html}`: integrar una sola sección después de Hero, antes de casos. `translations/{es,en}.ts`: relato y controles.
- `public/content/profile.{es,en}.json` y un test de contenido servido: marcar únicamente Universidad Isabel I como Finalizado/Completed, preservando fechas y demás datos.

### Movimiento
Skill animate aplicada: uso ocasional de marketing con propósito de explicación. CSS sobre transform/opacity, curva `cubic-bezier(0.23, 1, 0.32, 1)`, transición de progreso de 240ms y lectura estable seis segundos por etapa. No nuevas librerías. El avance manual es instantáneo. `matchMedia` mantiene el recorrido manual sin timer bajo reduced-motion; cambio de preferencia, interacción y destrucción limpian el timer. No se animan los párrafos ni se simulan logs. La línea de avance y el panel de artefacto hacen visible la relación entre pasos y resultados.

## Ampliación escena ilustrativa (R14–R17)
- `sections/chalc-workflow/scene/chalc-agent-scene.{ts,html,css,spec.ts}`: escena hija sin timer; recibe índice, reproducción y preferencia de movimiento del recorrido principal. Emite únicamente selección de etapa. Tres personajes SVG/code-native propios, entrada/salida de documentos, gate, devolución al desarrollador y destino humano.
- `scene/chalc-agent-scenes.ts` y `scene/chalc-agent-roles.ts`: correspondencia de las siete etapas, roles/destinos y objetos del método. Textos mediante traducciones existentes; no API o CLI ejecutándose.
- `scene/README.md`: responsabilidad y límites. `chalc-workflow` integra la escena y reutiliza selección/pausa/único reloj de seis segundos.
- Reproducir/Pausar controla `animation-play-state` de avatares/documentos además del timer. Animación transform/opacity, trayecto de entrada→trabajo→salida, sin mover narración. Revisión representa hallazgo→desarrollador→nueva comprobación; si falta evidencia, vuelve a corrección. El lector puede seleccionar directamente un rol y leer sin movimiento.
- Reduced-motion mantiene composición estática, artefactos y controles legibles; selección de teclado instantánea. No avatares Disney, assets descargados, 3D o librerías nuevas.
- Reemplaza el bloque manual de equipo/ciclo antes de implementarlo. Se retiran sus tests Red aún sin implementación y se añaden pruebas de la escena observable.

## Ajuste OWASP (R18)
Actualizar únicamente tres traducciones ES/EN del chip de seguridad y del propósito/handoff del revisor. Reutilizar el chip y los nodos existentes: no añadir HTML, lógica, animación, dependencia o servicio. Extender las pruebas existentes de controles/revisión/idioma con aserciones de OWASP y del ciclo de evidencia/aprobación humana. Red revisado antes del texto; Green de la escena y comprobación visual del coordinador. No repetir mutation completa porque no cambia lógica mutada.

## Chranta en Software (R19)
- Añadir un producto `chranta` al final de `public/content/software.{es,en}.json`, conservando los cuatro existentes. Propuesta ES/EN: finanzas personales con IA local/on-device AI; cuatro highlights de capacidades verificadas. Stack: Flutter, Dart, Qwen3-0.6B, SQLCipher. Solo `appStoreUrl`, sin `url` ni `playStoreUrl` inventadas.
- Copiar byte a byte `saldo_claro/assets/icon/app_icon.png` a `public/images/software/chranta.png`. El proyecto Flutter se consulta y copia en lectura; no se modifica.
- Reutilizar Product y DeployConsole actuales. En `deploy-script.ts`, resolver el destino público mediante `url ?? appStoreUrl ?? playStoreUrl`; mantener el resto del guion. Actualizar únicamente el comentario de Product para reconocer tiendas como destinos públicos.
- Extender tests existentes de contenido con catálogo real servido ES/EN e icono; y los del guion con App Store/Google Play sin web y prioridad de destinos. Red revisado antes de datos/código. Green de Software, comparación exacta del icono, build y QA puntual del coordinador.
- Mutation acotada a `deploy-script.ts` con Stryker/Karma y configuración existente, sin runner/config/dependencia persistente. No repetir la mutation del recorrido por cambios de texto/datos.

## Validación
Tests desde criterios EARS, evidencia Red revisada antes de implementación, Green y refactor; Stryker con umbral 80%; suite y build del proyecto; QA visual local a escritorio y móvil, idioma, foco, modal y navegación. Metadatos y enlaces comprobados en el artefacto de build. No desplegar.

## Trazabilidad
R1/R5 → rutas y shell. R2/R4 → Hero y Home. R3 → Home y catálogo. R6 → traducciones y tests de cambio de idioma. R7 → HTML/CSS y QA responsive/teclado. R8 → index y build. R9–R12 → recorrido Chalc, integración Home, pruebas de reloj/control/idioma y QA. R13 → contenido servido de educación. R14–R17 → equipo/ciclo, pruebas de selección/handoff/pausa/idioma y QA de comprensión visual.

R18 → traducciones de seguridad/revisor y pruebas existentes de escena ES/EN. R19 → catálogo Software, icono, prioridad de destino público y pruebas existentes.

## Riesgos
El proyecto tiene cambios previos del usuario en `.gitignore`, `CLAUDE.md` y `.img2/`; se conservan. El juego sigue siendo una ruta pesada, pero no se carga al entrar en `/`. Las demás rutas y el contacto actual se conservan.

## Aprobación
Plan aprobado por coordinador el 2026-10-19. Se envía el primer Red para revisión antes del mínimo código.

## Enlace público de CraftDish (R20)
Añadir únicamente `url: https://crafdish.com/` al producto `craftdish` en ambos catálogos. Reutilizar el guion y enlace existentes sin cambiar código, presentación ni descripción. Cambio de dato estático autorizado directamente por el usuario; comprobar JSON y preservación del resto del catálogo, y verificar LIVE/enlace en navegador ES/EN. No añadir pruebas que dupliquen un dato ni repetir mutation: no cambia lógica.

## Riverpod en Chranta (R21)
Actualizar la aserción de stack existente para incluir Riverpod; comprobar el fallo de contenido antes del cambio. Añadir únicamente Riverpod al stack de Chranta en ambos JSON, preservando los demás datos. Validar con las pruebas existentes de contenido y QA de la ficha. Sin cambios en lógica ni Flutter; no repetir mutation por un dato estático. Alcance solicitado directamente por el usuario.

## Retirar tecnologías de todas las fichas (R22)
Retirar el único bloque de stack del template compartido DeployConsole, los estilos exclusivos de ese bloque y sus dos traducciones sin uso. Conservar los metadatos de catálogo y la interfaz Product para no ampliar el cambio a datos internos. Revertir la aserción pendiente de Riverpod porque su ampliación visual fue sustituida por el usuario. Actualizar el test existente de logo/ficha para comprobar la ausencia de tecnologías; Red antes del template, Green de Software y QA ES/EN de los cinco productos. No añadir tests ni repetir mutation por esta retirada de presentación sin lógica nueva.
