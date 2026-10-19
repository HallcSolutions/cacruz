# Spec: Entrada profesional de cacruz.com

## Contexto / Problema
La raíz del sitio abre el mundo 3D antes de explicar la propuesta profesional. Una visita desde LinkedIn necesita comprender el trabajo de Christian, comprobarlo en proyectos reales y encontrar contacto sin tener que jugar.

## Objetivo
Mostrar primero ingeniería de software con IA, tres casos verificables y contacto; conservar el juego como experiencia opcional.

## Historias de usuario
- Como visitante profesional quiero comprender qué construye Christian y cómo trabaja para decidir qué explorar.
- Como visitante quiero consultar ejemplos reales y su código para evaluar el trabajo.
- Como visitante quiero contactar directamente o elegir explorar el juego.

## Requisitos (EARS)
- **R1** — WHEN una persona abre `/` THE SYSTEM SHALL presentar el inicio editorial sin montar ni exigir el mundo 3D.
- **R2** — WHEN se presenta el primer bloque THE SYSTEM SHALL mostrar el nombre de Christian, una propuesta de ingeniería de software con IA centrada en especificaciones, agentes y calidad, y accesos visibles al recorrido de Chalc y al contacto.
- **R3** — WHEN una persona consulta los casos THE SYSTEM SHALL mostrar exactamente tres ejemplos reales (Chalc, RAG contratos y Cacode), explicando el problema, la solución y una evidencia accesible en su repositorio, sin métricas inventadas.
- **R4** — WHEN una persona activa el contacto del primer bloque o del cierre THE SYSTEM SHALL abrir el modal de contacto existente y permitir cerrarlo.
- **R5** — WHEN una persona elige la experiencia 3D THE SYSTEM SHALL abrir el juego existente en `/world`, manteniendo la navegación de vuelta al inicio y las demás rutas actuales.
- **R6** — WHEN una persona cambia entre español e inglés THE SYSTEM SHALL traducir toda la nueva propuesta, casos, acciones y acceso al juego sin modificar los nombres propios.
- **R7** — WHILE se usa el inicio con teclado, pantalla estrecha o movimiento reducido THE SYSTEM SHALL conservar el contenido legible, acciones con foco visible, orden semántico y acceso a los casos sin depender de animaciones.
- **R8** — WHEN se comparte o indexa la raíz THE SYSTEM SHALL describir a Christian y su enfoque de ingeniería de software con IA mediante título, descripción y metadatos de vista previa compartida alineados con esa propuesta. No se añade una canónica global que afecte las demás rutas.

## Ampliación: Chalc como relato principal
El usuario solicita mostrar en el centro de la web, con un recorrido dinámico comprensible, cómo trabaja diariamente con Chalc. Es una explicación del método, no una ejecución del CLI ni un resultado comercial.

- **R9** — WHEN se consulta el inicio THE SYSTEM SHALL mostrar después del Hero y antes de los tres casos una sección protagonista de Chalc con siete etapas: preparar contexto, especificar/planificar, pruebas primero, implementar con agentes, controles de calidad, revisión/aprobación y evidencia/memoria. Cada etapa explicará qué sucede, qué deja y qué permite continuar, y enlazará a la documentación real. La introducción indicará la autoría de Christian («Creé Chalc») y la sección tendrá un destino directo desde Hero.
- **R10** — WHEN una persona abre el recorrido THE SYSTEM SHALL mantenerlo estático hasta pulsar Reproducir; ofrecer Pausar, anterior, siguiente y selección directa; avanzar cada seis segundos al reproducir; detenerse al final después de seis segundos también en la última etapa y al intervenir manualmente; permitir volver a reproducir desde el principio al llegar al final.
- **R11** — WHILE se solicita movimiento reducido THE SYSTEM SHALL permitir recorrer todos los pasos manualmente sin temporizador ni desplazamientos animados. WHEN cambia esa preferencia a reducido THE SYSTEM SHALL pausar. WHEN se desmonta la sección THE SYSTEM SHALL limpiar temporizador y listener. Los cambios de teclado/manuales son instantáneos y no se anima el texto de lectura.
- **R12** — WHEN se cambia el idioma THE SYSTEM SHALL traducir etapas, explicaciones, evidencias, condiciones y controles; mantener la etapa seleccionada y nombres/comandos propios; identificar siempre la sección como demostración del método, sin logs simulados ni métricas inventadas.
- **R13** — WHEN se muestra el Máster en Desarrollo con IA de Universidad Isabel I THE SYSTEM SHALL indicar que está finalizado en español e inglés, sin inventar fechas.

## Ampliación: escena ilustrativa de agentes y artefactos
El usuario pide ver trabajar a los agentes mediante personajes propios y objetos que entran/salen. Sustituye la propuesta de un bloque manual separado: se integra en el recorrido y usa su único reproductor.
- **R14** — WHEN se selecciona una etapa o un rol THE SYSTEM SHALL mostrar la escena de trabajo con personajes propios para líder, desarrollador y revisor, destacando quién interviene y explicando su responsabilidad y entregable. Los tres roles serán seleccionables y llevarán a su etapa correspondiente.
- **R15** — WHILE se reproduce el recorrido THE SYSTEM SHALL ilustrar la entrada y salida de Necesidad, Especificación, Prueba, Cambio, Hallazgo y Evidencia según la etapa. En revisión mostrará el Hallazgo que vuelve al desarrollador y la necesidad de corregir y volver a comprobar antes de la aceptación humana. Los artefactos se mueven; la narración queda quieta.
- **R16** — WHEN se consulta la fase de controles THE SYSTEM SHALL mostrar pruebas, mutation, duplicación/claridad, arquitectura y revisión/análisis estático de seguridad disponible. Gate, asesor y memoria serán herramientas deterministas diferenciadas de agentes; la aceptación será humana. La escena será un recorrido ilustrativo, sin resultados/puntuaciones reales o promesas de código perfecto.
- **R17** — WHEN se pausa THE SYSTEM SHALL pausar el reloj y la animación CSS de documentos/personajes. WHEN se selecciona manualmente una etapa o rol THE SYSTEM SHALL pausar y actualizar la escena. WHILE se solicita movimiento reducido THE SYSTEM SHALL mostrar escena estática y legible, sin perder roles/artefactos/controles. Los textos y nombres de controles se traducirán ES/EN, sin un segundo timer.

## Ampliación: OWASP visible (R18)
- **R18** — WHEN una persona explora los controles de calidad o el papel del revisor THE SYSTEM SHALL mostrar explícitamente OWASP Top 10 en español e inglés, conservar la revisión/análisis de seguridad disponible y explicar que los hallazgos se documentan, se corrigen y se vuelven a comprobar antes de la aprobación humana. La mención describe el método usado por Christian, confirmado por el usuario y su publicación propia; no afirma certificación ni cobertura total.

## Ampliación: Chranta en Software (R19)
- **R19** — WHEN una persona consulta Software en español o inglés THE SYSTEM SHALL incluir Chranta con su icono original, una propuesta de finanzas personales con IA en el dispositivo y capacidades verificadas (ingresos/gastos/deudas, presupuestos/metas, borradores con confirmación y datos locales cifrados sin cuenta); ofrecer la ficha pública verificada de App Store sin inventar otros enlaces. WHEN se reproduce la consola de un producto publicado solo en una tienda THE SYSTEM SHALL terminar como LIVE con su host público, priorizando web, App Store y Google Play en ese orden; solo un producto sin ninguno de esos destinos se mostrará como próximo lanzamiento.

## Fuentes de los casos
`public/content/profile.es.json` y `profile.en.json`: `chalc-cli-adapter`, `rag-contratos`, `cacode`. Erre no aparece en el contenido del proyecto inspeccionado; se usa Cacode para conservar evidencia existente.

## Fuente de Chranta
README y `assets/icon/README.md` del proyecto local autorizado `saldo_claro`, consultado sin modificarlo; icono activo `assets/icon/app_icon.png`. App Store verificada por el coordinador: `https://apps.apple.com/co/app/chranta/id6819862051`. La ficha pública confirma IA en el dispositivo, SQLCipher y confirmación de borradores. No se hacen afirmaciones de rendimiento o resultados financieros.

## Relación con la especificación inicial
La entrada profesional sustituye el hero de tecnologías, su terminal/typewriter y la apertura obligatoria del mundo de `001-landing-personal`; se mantienen los contenidos, las credenciales y la experiencia 3D opcional.

## Fuera de alcance
Desplegar, publicar, push, nuevas dependencias, backend o formulario alternativo, rediseñar el juego, modificar credenciales, métricas de conversión o contenido histórico de otras páginas.

## Fuente del recorrido
README público de `ChristianCruzArango/chalc-cli-adapter` (`develop`, contrastado por coordinador en commit d15fef6): contexto/equipamiento determinista; IA opt-in; SDD/TDD; gate y advisor; equipo líder/desarrollador/revisor; memoria y evidencias. El recorrido se presenta como la manera de trabajar de Christian con Chalc, no como una ejecución autónoma de todos los comandos.

## Aprobación
Alcance y plan aprobados por el agente coordinador dentro de la delegación explícita del usuario (2026-10-19). La revisión de los tests Red precede al código.

## Enlace público de CraftDish (R20)
- **R20** — WHEN una persona despliega la ficha de CraftDish en español o inglés THE SYSTEM SHALL mostrar su destino público `https://crafdish.com/`, terminar como `LIVE → crafdish.com` y ofrecer el enlace de acceso en lugar de próximo lanzamiento. URL proporcionada por el usuario y verificada en el navegador.

## Stack de Chranta: Riverpod (R21)
- **R21** — WHEN se presenta la ficha de Chranta en español o inglés THE SYSTEM SHALL incluir Riverpod junto con Flutter, Dart, Qwen3-0.6B y SQLCipher. Fuente: `saldo_claro/pubspec.yaml` declara flutter_riverpod 3.4.3; `lib/app/chranta_app.dart` y `lib/finance/presentation/finance_provider.dart` muestran ProviderScope y NotifierProvider activos.

## Fichas sin etiquetas de tecnologías (R22)
- **R22** — WHEN una persona abre cualquier producto de Software en español o inglés THE SYSTEM SHALL mostrar su logo, descripción, funciones y enlaces sin la línea «hecho con / built with» ni etiquetas de tecnologías. La petición más reciente sustituye el bloque tecnológico de R68 de la spec inicial y la ampliación visual de Riverpod de R21.
