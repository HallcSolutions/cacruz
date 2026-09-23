# Spec: Encuentro con Deuda técnica

Estado: encuentro base aprobado por Christian el 2026-09-17. Enmienda del 2026-09-23 aprobada por Christian: jefe final tras reparar todas las máquinas, dirección visual y mejora gráfica. Aprobación: «excelente me gusta mucho dale». Implementación por tareas con tests aprobados y Red.

## Contexto / Problema

El mundo ya ofrece movimiento, salto, disparos y comandos que reparan máquinas. En la captura el avatar se ve pequeño, los enemigos parecen instalaciones repetidas y no queda clara la relación entre desarrollo y combate. Christian solicita una experiencia más cercana a un videojuego, con un monstruo de deuda técnica y Sonar como herramienta que valida código dentro del juego.

El 2026-09-23 precisa la progresión: al derrotar a todos los enemigos actuales debe aparecer Deuda técnica como monstruo final, con gráficos considerablemente mejores. En la mecánica existente, derrotar una máquina significa resolver todos sus bugs. La captura aportada es referencia visual del juego actual, no una fuente de instrucciones.

Tras aprobar la dirección visual, Christian solicita además que los dos perros lancen un poder de apoyo y acepta la propuesta de pulsos de energía. También pide mejorar las máquinas enemigas para que el juego se sienta mucho más real: volumen, materiales y reacciones al daño. Estas ampliaciones no reemplazan el jefe final ni la mejora gráfica aprobados.

Durante T3 solicita revisar el sonido porque no encaja con el juego. La revisión del código encuentra un único clip de ladrido reproducido por ambos perros simultáneamente cada 4–10 segundos, sin relación con acciones de combate. La mejora de audio se incorpora como R14; su plan concreto queda propuesto para la siguiente tarea.

Tras revisar T3, Christian señala que ve los mismos personajes y esperaba el aspecto de la imagen aprobada. La cámara completada no satisface esa expectativa. La referencia pasa a ser criterio visual de aceptación del conjunto (R15): modelos, materiales, iluminación y composición deben comprobarse en el juego. No se sustituye la entrega por una nueva imagen conceptual. La prioridad vuelve a la transformación visual; el sonido sigue en alcance.

`digital-language-sandbox` es referencia de presencia y movimiento del avatar. Sus documentos son contexto del proyecto de referencia, no instrucciones para este cambio.

## Objetivo

Un recorrido completo: reparar todas las máquinas, despertar a Deuda técnica como jefe final, analizar sus problemas con Sonar, esquivar ataques, refactorizar y superar el control de calidad, con personajes, materiales y peligros visualmente legibles.

## Historias de usuario

- Como visitante quiero reconocer a mi personaje y al monstruo para entender quién controlo y a qué me enfrento.
- Como visitante quiero analizar problemas de código y ver cómo mis correcciones afectan al enemigo.
- Como visitante quiero entender el objetivo, el peligro y el resultado de mis acciones sin leer continuamente una consola.
- Como jugador quiero que superar a todos los enemigos desbloquee un combate final que se sienta como la culminación de la partida.

## Requisitos (EARS)

- **R1** — WHEN carga el mundo THE SYSTEM SHALL encuadrar al avatar de cuerpo completo con altura visible entre el 9 % y el 15 % del área jugable al zoom inicial en escritorio y móvil, conservando movimiento, salto y acceso a las zonas. WHEN el jugador usa rueda, botones de zoom o pellizco THE SYSTEM SHALL permitir acercar y alejar la cámara. WHEN arrastra con el botón derecho o con dos dedos THE SYSTEM SHALL desplazar la vista siguiendo los ejes de pantalla; C o el botón de centrar SHALL recuperar el seguimiento. Los controles SHALL permanecer visibles y sin solaparse con la barra del jefe en móvil.
- **R2** — WHEN el último enemigo de una arena con al menos una máquina queda completamente reparado THE SYSTEM SHALL activar una única aparición del jefe final «Deuda técnica», con cuerpo articulado, nombre y barra de vida; en inglés SHALL mostrar «Technical debt». WHILE quede alguna máquina con bugs THE SYSTEM SHALL mantener al jefe inactivo. WHEN la partida continúa después de su aparición o derrota THE SYSTEM SHALL conservar ese estado sin generar otro jefe; entrar a una zona por sí solo SHALL NOT activarlo.
- **R3** — WHEN el jugador activa «Analizar con Sonar» THE SYSTEM SHALL revelar tres hallazgos simulados del encuentro —código duplicado, complejidad excesiva y código sin pruebas—, identificar el hallazgo activo y mostrar el control de calidad como fallido mientras alguno siga pendiente.
- **R4** — WHEN el jugador activa «Refactorizar» con F o el botón táctil tras analizar al monstruo y dentro del alcance THE SYSTEM SHALL lanzar una corrección al objetivo visible, con intervalo mínimo de 600 ms entre acciones, y resolver un hallazgo y descontar un tercio de la vida únicamente al impactar; antes del análisis o fuera de alcance SHALL indicar la acción necesaria sin descontar vida.
- **R5** — WHILE el monstruo esté activo THE SYSTEM SHALL alternar aproximación, anticipación de al menos 800 ms, ataque y recuperación, señalando el área peligrosa antes del daño y respetando obstáculos y límites; un mismo ataque SHALL causar daño como máximo una vez y permitir esquivarlo.
- **R6** — WHEN una corrección impacta THE SYSTEM SHALL mostrar reacción corporal, actualización de vida y hallazgo resuelto; WHEN se resuelven los tres hallazgos THE SYSTEM SHALL detener los ataques, reproducir la derrota una sola vez y mostrar «Control de calidad aprobado · Deuda técnica resuelta».
- **R7** — WHILE queden máquinas por reparar THE SYSTEM SHALL mostrar el objetivo y el progreso «Máquinas X/N», contando cada máquina una sola vez al resolver todos sus bugs. WHILE el encuentro final esté activo THE SYSTEM SHALL mostrar objetivo, nombre y vida del enemigo, hallazgo activo y acciones disponibles en el idioma seleccionado, con controles táctiles operables sin tapar navegación; SHALL identificar el análisis como simulación local e indicar la ubicación del jefe cuando esté fuera de pantalla.
- **R8** — WHEN el jugador pierde toda su vida durante el combate final THE SYSTEM SHALL ofrecer reintentar restaurando jugador, monstruo y hallazgos y eliminando ataques pendientes, conservando las máquinas ya reparadas. WHEN el visitante sale del mundo THE SYSTEM SHALL detener el encuentro y liberar sus recursos; WHEN vuelve a entrar THE SYSTEM SHALL iniciar una partida nueva.

- **R9** — WHEN el personaje del jugador se represente THE SYSTEM SHALL conservar los rasgos reconocibles de la foto aportada por Christian: cabello negro corto, barba corta, tono de piel y camisa azul clara, con cuerpo completo y animaciones compatibles con movimiento, salto y combate. La imagen `christian-avatar-reference.png` es una referencia visual, no un modelo 3D ni evidencia de integración.

- **R10** — WHEN se representa el escenario y el combate final en escritorio o móvil THE SYSTEM SHALL mostrar al monstruo con una altura de entre dos y tres veces la del avatar, silueta asimétrica, extremidades articuladas, cables y núcleo ámbar; las superficies del cuerpo, suelo y máquinas SHALL conservar volumen y detalle distinguibles sin quedar ocultos por el brillo. Las máquinas reparadas SHALL distinguirse por su estado visual y etiqueta, y el suelo SHALL separar el espacio de combate de la decoración. WHEN se usa el modo de bajo consumo THE SYSTEM SHALL mantener legibles jugador, jefe y señales de ataque aunque reduzca los efectos decorativos.
- **R11** — WHEN comienza la aparición del jefe THE SYSTEM SHALL retirar los ataques y correcciones pendientes de las máquinas, mostrar su aparición en un espacio libre y evitar daño durante esa entrada; SHALL conservar el control del jugador y comenzar el primer ataque solo después de la anticipación de R5.
- **R12** — WHEN el jugador ataca a un enemigo válido y un perro tiene disponible su poder y está dentro de alcance THE SYSTEM SHALL lanzar desde ese compañero un pulso de energía hacia el mismo objetivo, sin requerir botones adicionales. WHILE el poder se recarga THE SYSTEM SHALL mostrar su disponibilidad e impedir nuevos pulsos de ese perro. WHEN el pulso impacta THE SYSTEM SHALL mostrar una reacción y aplicar su ayuda una sola vez; SHALL respetar la aparición, el análisis previo y la derrota del jefe, sin resolver automáticamente los hallazgos reservados a las acciones del jugador. WHEN la partida se pausa, termina o reinicia THE SYSTEM SHALL pausar o limpiar los poderes pendientes junto con el combate.
- **R13** — WHEN se muestran las máquinas enemigas THE SYSTEM SHALL representar carcasas, articulaciones y emisores distinguibles, materiales metálicos con variación de superficie y contacto visual con el suelo. WHEN una máquina dispara o recibe un impacto THE SYSTEM SHALL mostrar una reacción mecánica y un efecto localizado que correspondan a esa acción. WHEN queda reparada THE SYSTEM SHALL mostrar una transición final única hacia un estado inofensivo y conservar la lectura de su silueta, evitando que el brillo tape el cuerpo; SHALL mantener esa lectura en bajo consumo.
- **R14** — WHILE el jugador permanece sin realizar acciones THE SYSTEM SHALL evitar la repetición automática de ladridos. WHEN se produce un disparo, una corrección, un impacto o una reparación completa THE SYSTEM SHALL reproducir un efecto breve y distinguible, sincronizado con el evento y coherente con el entorno de ciencia ficción. WHEN un compañero utiliza su poder THE SYSTEM SHALL acompañarlo con un efecto propio sin superponer ladridos idénticos. WHEN el usuario silencia el juego, abre un modal, oculta la pestaña o sale del mundo THE SYSTEM SHALL detener el audio activo; al reanudar SHALL descartar sonidos anteriores en lugar de reproducirlos acumulados. BEFORE el primer gesto del usuario THE SYSTEM SHALL permanecer en silencio; la falta de soporte de audio SHALL NOT impedir jugar. La valoración del timbre requiere escucha y aceptación, además de los tests de comportamiento.
- **R15** — WHEN se revisa la entrega gráfica THE SYSTEM SHALL representar mediante modelos 3D jugables los rasgos principales de la referencia aprobada: protagonista de camisa azul, cabello oscuro y rostro legible; dos perros diferenciados en tamaño y pelaje, con collares cian; jefe de placas grafito, brazos desiguales, pantallas de código, cables gruesos y núcleo ámbar; suelo de placas con juntas y vetas cian discretas; sombras de contacto y volúmenes sin sobreexposición. La comparación SHALL usar capturas reales del juego en un encuadre equivalente y mostrar también movimiento y vistas laterales; un cambio de cámara, una imagen de fondo o tests correctos por sí solos SHALL NOT considerarse cumplimiento de esta entrega. El HUD SHALL reflejar el estado real del combate.

## Dirección visual propuesta

Ciencia ficción estilizada, cámara oblicua más cercana y superficies de metal grafito con bordes y volúmenes claros. Suelo de placas oscuras con vetas cian discretas y decoración periférica. Deuda técnica tiene entre dos y tres alturas de personaje, espalda encorvada, hombros asimétricos, brazos de bloques de código, cables enredados y núcleo ámbar. Aparición, respiración, anticipación del golpe, retroceso y desplome comunican peso. El escaneo de Sonar destaca el núcleo y conecta visualmente cada hallazgo con el monstruo. Peligros legibles mediante contornos, segmentos y flechas además de color.

Secuencia: «Repara todas las máquinas → aparece Deuda técnica → analiza → esquiva → refactoriza → control de calidad aprobado».

Referencia propuesta: [concepto del jefe final](technical-debt-boss-concept.png). Es una imagen generada para revisar dirección artística, no una captura de una implementación. [Registro y prompt](visual-direction.md). El aspecto final se acredita con capturas y juego real en navegador.

## Alcance y compatibilidad

Se conserva el sistema de animación actual como base, incorporando un avatar personalizado según R9, junto con rutas del portafolio, navegación independiente del combate, fallback HTML, carga lazy y tratamiento de movimiento reducido definido por R86 de la spec 001. R1 precisa el encuadre de R75/R90; los demás requisitos añaden un encuentro.

La mejora del escenario y el jefe pueden implementarse con el avatar jugable actual; R9 mantiene su estado pendiente y no bloquea esas entregas. No se considerará completada toda la spec mientras R9 siga pendiente.

No incluye conexión a SonarQube real, análisis de repositorios del visitante, ejecución real de comandos, backend, multijugador, campaña ni inventario. R14 incorpora efectos de sonido; no incluye música de fondo. No se traslada el avatar infantil del proyecto de referencia.

## Decisiones resueltas

«Sonar» significa análisis de código como parte del juego, no efectos de sonido (respuesta de Christian, 2026-09-17). Se propone una simulación explícita sobre hallazgos predefinidos para este primer encuentro.

«Al matar todos» se corresponde con reparar todas las máquinas de la arena; actualmente son siete. El nuevo disparador sustituye la entrada por proximidad de la versión del 2026-09-17. Sonar y la refactorización del encuentro aprobado se conservan.

«Mucho más real» amplía el tratamiento visual a las máquinas enemigas: materiales, volumen y respuesta física perceptible dentro de la dirección de ciencia ficción ya aprobada. Los valores de alcance/recarga y el efecto exacto de apoyo de los perros se concretarán en el plan y sus tests antes de implementar R12.

### Precisión visual solicitada el 2026-09-23

Christian compara el recorte de los modelos actuales con el de la referencia: no acepta extremidades y torso construidos como bloques rectangulares. R15 exige contornos de hombros/cintura, brazos flexionados, piernas estrechas articuladas, manos con agarre y herramienta visible, postura de combate y perros con hombros/cuello/hocico definidos. La evidencia es el recorte del juego real frente al recorte aprobado; no basta cambiar color o iluminación.

### Corrección de cámara y progresión solicitada el 2026-09-23

Christian informa que la cámara está demasiado cerca y no puede moverla, y que no aparece el monstruo tras derrotar las máquinas. R1 amplía la distancia inicial y hace explícitos zoom, desplazamiento y recuperación de la cámara. R2 se verifica recorriendo las siete máquinas en el juego real y comprobando la aparición visible del jefe. WHILE queden máquinas pendientes THE SYSTEM SHALL indicar su posición en un radar, diferenciándolas del jugador, para que una máquina fuera del encuadre no parezca una arena completada.

### Corrección de siluetas y agarre — R15, 2026-09-23

WHEN el protagonista esté en reposo de combate THE SYSTEM SHALL mantener ambos pies apoyados, separados hacia el exterior de las caderas y escalonados, el brazo de la herramienta flexionado por delante del cuerpo y la hoja visible hacia arriba y delante de la mano, sin atravesar torso ni cabeza. WHEN camine, salte o se siente THE SYSTEM SHALL conservar la herramienta dentro del agarre de la mano y transicionar las articulaciones sin desplazar la raíz de la simulación. La camisa tendrá cintura estrecha y hombros inclinados; cabeza, antebrazos y pantalones tendrán secciones facetadas con cambios de volumen. Los perros tendrán lomo recto, vientre recogido, cuatro apoyos distinguibles, cuello inclinado, hocico corto, orejas erectas y cola hacia atrás. Se compara con el recorte aportado de nuevo por Christian, en tres cuartos posterior y también de frente/lateral.

### R16 — Protagonista lector (elección explícita de Christian, 2026-09-23)

Esta elección sustituye la vara de R15; se mantiene el protagonista humano, los dos perros y los robots actuales.
- WHEN se representa al protagonista THE SYSTEM SHALL mostrar un libro abierto sostenido con ambas manos, tapas, lomo, hojas impresas y marcapáginas, compatible con caminar, saltar y sentarse.
- WHEN se ejecuta F contra una máquina o el jefe THE SYSTEM SHALL animar el libro y lanzar hojas visibles hacia ese objetivo, conservando las reglas actuales de alcance, impacto y recarga. Los perros SHALL conservar sus propios pulsos cian y su recarga.
- WHEN se ejecuta Q contra el jefe THE SYSTEM SHALL representar una lectura y mostrar hallazgos de copia y pega, código sin pruebas y complejidad; las páginas de F SHALL resolverlos mediante el combate existente. Los textos SHALL describir la mecánica como una simulación del juego.
- WHEN termina un lanzamiento o lectura THE SYSTEM SHALL volver a la pose de transporte, sin dejar páginas sueltas activas ni modificar la raíz física del personaje.

Aclaración posterior de R16: Christian pide que el humano esté leyendo y que los poderes parezcan neuronas. El lanzamiento representa un núcleo con nodos y ramificaciones cian/ámbar que emerge de las páginas, acompañado por hojas flotantes. Las páginas siguen presentes en el libro, mientras el proyectil principal es una red neuronal estilizada.

### R17 — Suelo de la biblioteca tecnológica
WHEN se juega en la plaza THE SYSTEM SHALL mostrar un pavimento de placas oscuras biseladas con juntas finas, inserciones luminosas discretas y conexiones geométricas, sustituyendo las vetas dibujadas irregulares. La superficie SHALL conservar altura, área y colisiones transitables.

Corrección de R1 solicitada tras probar el libro: WHEN se arrastre con el botón izquierdo del mouse THE SYSTEM SHALL girar la cámara alrededor del personaje (horizontal y vertical); el botón derecho SHALL desplazar el encuadre, la rueda SHALL cambiar zoom y C SHALL restaurar el encuadre inicial. El arrastre táctil con un dedo SHALL seguir moviendo al personaje. La orientación manual SHALL conservarse durante el movimiento y el encuentro final.

### R18 — Evitar atravesar máquinas
WHEN el personaje o uno de sus perros avance hacia una máquina, activa o reparada, THE SYSTEM SHALL mantener su cuerpo fuera de la huella de la máquina y permitir deslizarse alrededor. El libro SHALL conservar espacio frente al torso sin entrar en esa huella. Los robots SHALL seguir pudiendo disparar desde su propia posición.

### R19 — Bugs de la familia del jefe
WHEN se muestran las máquinas enemigas THE SYSTEM SHALL representarlas como criaturas mecánicas pequeñas emparentadas visualmente con Deuda técnica, con placas, cables y un núcleo. SHALL existir siluetas diferenciadas de puño pesado, arácnido y blindado; las siete máquinas conservarán sus posiciones y reglas de reparación.

R20 sustituye el permiso anterior de corregir al jefe en cualquier fase activa: ahora la vulnerabilidad está limitada a recuperación.

### R20 — Combate activo y resistencia del jefe (2026-09-23)
- WHEN una máquina no reparada está en el campo THE SYSTEM SHALL patrullar o aproximarse al jugador, conservar distancia para disparar y animar sus extremidades; las reparadas permanecerán inmóviles.
- WHEN el jefe detecta al jugador a distancia THE SYSTEM SHALL anunciar durante al menos 0,8 s una descarga dirigida antes de lanzar proyectiles esquivables; en su última fase añadirá una descarga radial.
- WHEN el jugador corrige al jefe THE SYSTEM SHALL aceptar una sola corrección por recuperación, después del ataque; pulsar F repetidamente o recibir apoyo canino no cancelará la preparación del ataque.
- WHEN los proyectiles alcanzan al jugador THE SYSTEM SHALL aplicar las mismas reglas de salto e invulnerabilidad del combate normal y detener el peligro al terminar el encuentro.
- WHEN el jugador o los perros se aproximan al jefe activo o caído THE SYSTEM SHALL impedir que atraviesen su volumen.

Ajuste visual R16/R15: reducir mangas abultadas, dar una silueta continua al cuello/cabeza, manos abiertas sosteniendo el libro por debajo y perros con volumen suavizado conservando sus siluetas y colores. La aceptación visual sigue pendiente de revisión dentro del juego.
