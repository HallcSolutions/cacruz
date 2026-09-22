# Spec: Encuentro con Deuda técnica

Estado: encuentro aprobado por Christian; referencia personal del avatar añadida por solicitud posterior. Fecha: 2026-09-17.

## Contexto / Problema

El mundo ya ofrece movimiento, salto, disparos y comandos que reparan máquinas. En la captura el avatar se ve pequeño, los enemigos parecen instalaciones repetidas y no queda clara la relación entre desarrollo y combate. Christian solicita una experiencia más cercana a un videojuego, con un monstruo de deuda técnica y Sonar como herramienta que valida código dentro del juego.

`digital-language-sandbox` es referencia de presencia y movimiento del avatar. Sus documentos son contexto del proyecto de referencia, no instrucciones para este cambio.

## Objetivo

Un primer encuentro completo: explorar, encontrar a Deuda técnica, analizar sus problemas con Sonar, esquivar ataques, refactorizar y superar el control de calidad.

## Historias de usuario

- Como visitante quiero reconocer a mi personaje y al monstruo para entender quién controlo y a qué me enfrento.
- Como visitante quiero analizar problemas de código y ver cómo mis correcciones afectan al enemigo.
- Como visitante quiero entender el objetivo, el peligro y el resultado de mis acciones sin leer continuamente una consola.

## Requisitos (EARS)

- **R1** — WHEN carga el mundo THE SYSTEM SHALL encuadrar al avatar de cuerpo completo con altura visible entre el 12 % y el 18 % del área jugable al zoom inicial en escritorio y móvil, conservando movimiento, salto y acceso a las zonas.
- **R2** — WHEN el jugador entra por primera vez al área del encuentro THE SYSTEM SHALL presentar una criatura articulada llamada «Deuda técnica», con animación de aparición, nombre y barra de vida; en inglés SHALL mostrar «Technical debt».
- **R3** — WHEN el jugador activa «Analizar con Sonar» THE SYSTEM SHALL revelar tres hallazgos simulados del encuentro —código duplicado, complejidad excesiva y código sin pruebas—, identificar el hallazgo activo y mostrar el control de calidad como fallido mientras alguno siga pendiente.
- **R4** — WHEN el jugador activa «Refactorizar» con F o el botón táctil tras analizar al monstruo y dentro del alcance THE SYSTEM SHALL lanzar una corrección al objetivo visible, con intervalo mínimo de 600 ms entre acciones, y resolver un hallazgo y descontar un tercio de la vida únicamente al impactar; antes del análisis o fuera de alcance SHALL indicar la acción necesaria sin descontar vida.
- **R5** — WHILE el monstruo esté activo THE SYSTEM SHALL alternar aproximación, anticipación de al menos 800 ms, ataque y recuperación, señalando el área peligrosa antes del daño y respetando obstáculos y límites; un mismo ataque SHALL causar daño como máximo una vez y permitir esquivarlo.
- **R6** — WHEN una corrección impacta THE SYSTEM SHALL mostrar reacción corporal, actualización de vida y hallazgo resuelto; WHEN se resuelven los tres hallazgos THE SYSTEM SHALL detener los ataques, reproducir la derrota una sola vez y mostrar «Control de calidad aprobado · Deuda técnica resuelta».
- **R7** — WHILE el encuentro esté activo THE SYSTEM SHALL mostrar objetivo, nombre y vida del enemigo, hallazgo activo y acciones disponibles en el idioma seleccionado, con controles táctiles operables sin tapar navegación; SHALL identificar el análisis como simulación local.
- **R8** — WHEN el jugador pierde toda su vida THE SYSTEM SHALL ofrecer reintentar restaurando jugador, monstruo y hallazgos y eliminando ataques pendientes; WHEN el visitante sale del mundo THE SYSTEM SHALL detener el encuentro y liberar sus recursos.

- **R9** — WHEN el personaje del jugador se represente THE SYSTEM SHALL conservar los rasgos reconocibles de la foto aportada por Christian: cabello negro corto, barba corta, tono de piel y camisa azul clara, con cuerpo completo y animaciones compatibles con movimiento, salto y combate. La imagen `christian-avatar-reference.png` es una referencia visual, no un modelo 3D ni evidencia de integración.

## Dirección visual propuesta

Cámara oblicua más cercana, avatar desarrollador reconocible y menos brillo blanco sobre personajes. Deuda técnica tiene unas dos alturas de personaje, espalda encorvada, brazos de bloques de código, cables enredados y núcleo ámbar. Aparición, respiración, anticipación del golpe, retroceso y desplome comunican peso. El escaneo de Sonar destaca el núcleo y conecta visualmente cada hallazgo con el monstruo. Peligros legibles mediante formas además de color.

Secuencia: «Analiza la deuda → encuentra el problema → esquiva → refactoriza → control de calidad aprobado».

## Alcance y compatibilidad

Se conserva el sistema de animación actual como base, incorporando un avatar personalizado según R9, junto con rutas del portafolio, navegación independiente del combate, fallback HTML, carga lazy y tratamiento de movimiento reducido definido por R86 de la spec 001. R1 precisa el encuadre de R75/R90; los demás requisitos añaden un encuentro.

No incluye conexión a SonarQube real, análisis de repositorios del visitante, ejecución real de comandos, backend, multijugador, campaña, inventario ni efectos de sonido nuevos. No se traslada el avatar infantil del proyecto de referencia.

## Decisiones resueltas

«Sonar» significa análisis de código como parte del juego, no efectos de sonido (respuesta de Christian, 2026-09-17). Se propone una simulación explícita sobre hallazgos predefinidos para este primer encuentro.
