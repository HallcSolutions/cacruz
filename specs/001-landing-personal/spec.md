# Spec: Landing page personal (portafolio + blog)

> Fase **Specify** — el QUÉ y el PORQUÉ. Sin detalles de implementación.

## Contexto / Problema

Christian necesita una presencia web personal que hoy no existe. Su trabajo está disperso:
57 repositorios públicos en GitHub (https://github.com/ChristianCruzArango) sin vitrina,
experiencia laboral solo visible en LinkedIn (https://www.linkedin.com/in/christian-alexis-cruz-arango/),
y ningún espacio propio donde publicar contenido sobre su día a día como desarrollador.

Quiere una página **personal y con carácter editorial** — explícitamente **sin cards** —
con animaciones de alto impacto ("que digan buff") y **multilenguaje**.

## Objetivo

Una landing page personal multilenguaje que presente quién es Christian, su experiencia,
sus tecnologías, sus proyectos de GitHub con imágenes y un blog sobre su día a día,
con un diseño editorial (sin cards) y animaciones memorables.

## Historias de usuario

- Como **visitante** quiero ver de inmediato quién es Christian, qué hace y cómo contactarlo (GitHub/LinkedIn) para decidir si me interesa su perfil.
- Como **visitante** quiero recorrer su experiencia laboral y tecnologías para evaluar su trayectoria.
- Como **visitante** quiero explorar sus proyectos de GitHub destacados con imágenes y contexto para conocer su trabajo real.
- Como **lector** quiero leer publicaciones del blog sobre su día a día para aprender de su experiencia.
- Como **visitante hispano o angloparlante** quiero cambiar el idioma de todo el sitio para leerlo en mi lengua.
- Como **Christian (autor)** quiero publicar una nueva entrada del blog agregando su contenido al proyecto para compartir mi día a día sin depender de un backend.
- Como **usuario sensible al movimiento** quiero que el sitio respete mi preferencia de movimiento reducido para navegar sin molestias.

## Requisitos (criterios de aceptación, notación EARS)

### Hero / presentación
- **R1** — WHEN un visitante entra a la ruta raíz THE SYSTEM SHALL mostrar una sección hero con nombre, rol/tagline y enlaces a GitHub y LinkedIn.
- **R2** — WHEN se renderiza el hero THE SYSTEM SHALL presentar una animación de entrada de alto impacto (una sola vez por carga).

### Experiencia laboral
- **R3** — WHEN el visitante llega a la sección de experiencia THE SYSTEM SHALL mostrar la trayectoria laboral en formato línea de tiempo editorial (empresa, rol, periodo, resumen), sin tarjetas.
- **R4** — WHEN un elemento de la línea de tiempo entra en el viewport THE SYSTEM SHALL revelarlo con animación de aparición.

### Tecnologías / lenguajes
- **R5** — WHEN el visitante llega a la sección de tecnologías THE SYSTEM SHALL mostrar los lenguajes y tecnologías dominados agrupados por categoría (frontend, backend, móvil, herramientas).

### Proyectos de GitHub
- **R6** — WHEN el visitante llega a la sección de proyectos THE SYSTEM SHALL mostrar una selección curada de repositorios destacados con nombre, descripción, lenguaje principal, imagen ilustrativa y enlace al repositorio, en un layout editorial alternado (sin cards).
- **R7** — WHEN se muestra la sección de proyectos THE SYSTEM SHALL incluir un enlace al perfil completo de GitHub.
- **R8** — IF la imagen de un proyecto no está disponible THEN THE SYSTEM SHALL mostrar un elemento visual de reemplazo sin romper el layout.

### Blog
- **R9** — WHEN el visitante navega a la sección de blog THE SYSTEM SHALL listar las entradas publicadas ordenadas de más reciente a más antigua, mostrando título, fecha, resumen y etiquetas.
- **R10** — WHEN el visitante selecciona una entrada THE SYSTEM SHALL navegar a una vista de detalle con el contenido completo de la entrada en el idioma activo.
- **R11** — WHEN el autor agrega una nueva entrada al contenido del proyecto y se publica el sitio THE SYSTEM SHALL incluirla en el listado sin cambios de código adicionales.
- **R12** — IF se navega a una entrada inexistente THEN THE SYSTEM SHALL mostrar un estado de "no encontrado" con enlace de vuelta al blog.

### Multilenguaje
- **R13** — WHEN el visitante usa el selector de idioma THE SYSTEM SHALL traducir todo el contenido visible (navegación, secciones, blog) al idioma elegido sin recargar la página.
- **R14** — WHEN el visitante regresa al sitio THE SYSTEM SHALL recordar el último idioma seleccionado.
- **R15** — WHEN un visitante entra por primera vez THE SYSTEM SHALL mostrar el sitio en español por defecto.

### Animaciones y accesibilidad
- **R16** — WHEN una sección entra en el viewport durante el scroll THE SYSTEM SHALL animar su aparición de forma fluida y consistente en todo el sitio.
- **R17** — WHILE el usuario tiene activada la preferencia de movimiento reducido THE SYSTEM SHALL desactivar las animaciones decorativas y mostrar el contenido directamente.

### Responsive
- **R18** — WHEN el sitio se visualiza en móvil, tablet o escritorio THE SYSTEM SHALL adaptar el layout sin pérdida de contenido ni scroll horizontal.

### Identidad visual viva _(enmienda 2026-07-13: feedback "muy estático/opaco, más animación y dibujo, menos texto")_
- **R19** — WHILE el hero está visible THE SYSTEM SHALL rotar nombres de tecnologías con efecto de máquina de escribir (escribe, sostiene, borra, pasa a la siguiente en bucle).
- **R20** — WHEN el visitante llega a la sección de tecnologías THE SYSTEM SHALL mostrar una cinta continua en movimiento (marquee) con las tecnologías.
- **R21** — WHILE el sitio está en pantalla THE SYSTEM SHALL mostrar un fondo vivo (gradientes de color en movimiento y retícula) sin comprometer la legibilidad del contenido.
- **R22** — WHEN el hero se muestra THE SYSTEM SHALL presentar indicadores visuales de trayectoria (años de experiencia, repos públicos, tecnologías) como piezas gráficas, no como párrafos.
- **R23** — WHILE el usuario tiene activada la preferencia de movimiento reducido THE SYSTEM SHALL detener typewriter, marquee y fondo animado mostrando su estado estático (extiende R17).

### Ajustes de dirección visual _(enmienda 2026-07-13 b: feedback "no me gusta lo azul; trayectoria tipo rueda, no recta")_
- **R24** — WHERE la paleta del sitio esté definida THE SYSTEM SHALL usar acentos cálidos (dorado/violeta/coral) sin tonos azules/cian dominantes.
- **R25** — WHEN los elementos de la trayectoria entran al viewport THE SYSTEM SHALL presentarlos alternados a ambos lados de una línea central (serpenteante) con rotación de entrada tipo rueda; en pantallas angostas THE SYSTEM SHALL volver a una sola columna legible.
- **R26** — WHEN la sección de tecnologías se revela THE SYSTEM SHALL presentar cada categoría con un ícono flotante y sus tecnologías apareciendo en cascada escalonada, con flotación continua y glow al pasar el cursor (sin tarjetas).
- **R27** — WHEN la sección de proyectos se muestra THE SYSTEM SHALL numerar editorialmente cada proyecto (01, 02, …) con numeral gráfico en gradiente, flotación sutil del arte y barrido de brillo al pasar el cursor.

### Estructura de páginas y formación _(enmienda 2026-07-13 c: feedback "agregar ingeniero/maestrías; trayectoria y proyectos en su propia hoja; gráfico de apertura en el inicio")_
- **R28** — WHEN el visitante consulta la trayectoria THE SYSTEM SHALL mostrar también la formación académica (institución, título, periodo): Ingeniería de Sistemas (UNAD), maestrías en IA (Universidad Isabel I, Founderz) y SENA.
- **R29** — WHEN el visitante usa la navegación THE SYSTEM SHALL ofrecer Trayectoria y Proyectos como páginas propias (rutas dedicadas, carga lazy), manteniendo Inicio y Blog.
- **R30** — WHEN el inicio se abre THE SYSTEM SHALL desplegar un gráfico animado de apertura (ilustración orbital que se dibuja y despliega por completo al cargar), estático con movimiento reducido.

### Naming y rutas _(enmienda 2026-07-13 d: feedback "paths en inglés; el blog con nombre más bonito y único")_
- **R31** — WHERE existan rutas de navegación THE SYSTEM SHALL usar paths en inglés (`/experience`, `/projects`, `/logbook`).
- **R32** — WHERE se muestre la sección de publicaciones THE SYSTEM SHALL llamarla "Bitácora" en español y "Logbook" en inglés (sustituye la marca "Blog").

### Identidad monocroma y avatar _(enmienda 2026-07-13 e: feedback "inicio feo, más dev; mi avatar; sin letras amarillas, solo blanco y negro")_
- **R33** — WHERE la paleta esté definida THE SYSTEM SHALL usar exclusivamente blanco, negro y grises (sin acentos amarillos ni de color en textos).
- **R34** — WHEN el inicio se abre THE SYSTEM SHALL mostrar el avatar de Christian como pieza central del hero, desplegándose con animación de apertura y anillos orbitales monocromos (redefine el gráfico de R30).
- **R35** — WHEN el hero se muestra THE SYSTEM SHALL incluir una ventana de terminal de desarrollador con líneas que aparecen animadas (whoami / stack / status).

### Fuente de contenido: hoja de vida _(enmienda 2026-07-13 f: "F:\CV_Christian_Cruz_Arango — saca todo de ahí")_
- **R36** — WHERE exista contenido de perfil THE SYSTEM SHALL reflejar la hoja de vida oficial: 12+ años de experiencia, rol "Senior Full-Stack Developer · Arquitecto de Software", las 10 posiciones del CV (incluye Constructora Bolívar y Carvajal) y el stack completo del CV.
- **R37** — WHEN se muestra la formación THE SYSTEM SHALL incluir también los cursos complementarios del CV como piezas compactas.

### Animaciones siempre activas _(enmienda 2026-07-13 g: el typewriter y las animaciones no se veían — el SO del dueño reporta prefers-reduced-motion)_
- **R38** — WHILE el sitio esté en pantalla THE SYSTEM SHALL reproducir todas las animaciones (typewriter, reveals, marquee, fondo) sin importar la preferencia de movimiento reducido del sistema. _Deroga R17 y R23 por decisión del dueño._

### Página Stack _(enmienda 2026-07-13 h: "tecnologías en página aparte, bonito, que se note desarrollador, basado en la hoja de vida")_
- **R39** — WHEN el visitante navega a `/stack` THE SYSTEM SHALL mostrar el stack del CV como una ventana de editor de código (archivo `stack.ts` con numeración de líneas, sintaxis coloreada y líneas que aparecen en cascada), además del marquee y las categorías; la sección de tecnologías sale del inicio.
- **R40** — WHEN la página Stack se revela THE SYSTEM SHALL mostrar medidores de dominio principal (tecnología + nivel) con barras que se llenan animadas. _(Derogado en enmienda i.)_

### Depuración del Stack y constelación en el inicio _(enmienda 2026-07-13 i: "retira Dominio principal; el marquee va-y-viene es feo; las categorías sobran — ya están en el JSON del editor")_
- **R41** — WHEN el visitante navega a `/stack` THE SYSTEM SHALL mostrar únicamente la ventana de editor `stack.ts` como pieza central (deroga R20 marquee y R26 categorías; R5 queda cubierto por el editor y la constelación).
- **R42** — WHEN el inicio se muestra THE SYSTEM SHALL exhibir una constelación de tecnologías flotantes (piezas que levitan con ritmos distintos, sin desplazamiento tipo marquee).
- **R43** — WHEN el inicio se muestra THE SYSTEM SHALL presentar la formación académica (con sus cursos) como sección propia del inicio con revelado en cascada y piezas animadas; la página de trayectoria queda solo con la línea de tiempo laboral. _(Reubica R28/R37.)_

### Renombre del diario y página para empresas _(enmienda 2026-07-13 j)_
- **R44** — WHERE se muestre la sección de publicaciones THE SYSTEM SHALL llamarla "Mi día a día" (EN: "My day to day") con ruta `/daily`. _(Sustituye R32 y el path de R31.)_
- **R45** — WHEN una empresa visita `/for-companies` THE SYSTEM SHALL presentar la propuesta de valor de Christian (casos con acción, resultado y empresas donde se hizo) en formato editorial animado sin cards, cerrando con un llamado a la acción de contacto (LinkedIn, email, GitHub).

### Modal de contacto _(enmienda 2026-07-13 k: "que 'Escríbeme' abra un modal tipo terminal con avatar, nombre, correo y descripción, y que llegue a christiancruzarango@gmail.com")_
- **R46** — WHEN el visitante activa "Escríbeme" THE SYSTEM SHALL abrir un modal con estética de terminal de desarrollador (avatar + campos nombre, correo y mensaje) y cerrarse con Escape, con el botón de cierre o al pulsar fuera.
- **R47** — IF el nombre, el correo o el mensaje están vacíos, o el correo no tiene formato válido, THEN THE SYSTEM SHALL impedir el envío y señalar el campo inválido.
- **R48** — WHEN el formulario válido se envía THE SYSTEM SHALL abrir el correo dirigido a `christiancruzarango@gmail.com` con el asunto y el cuerpo prellenados con los datos del formulario. _(Sin backend: envío vía `mailto:`.)_
- **R49** — WHILE el formulario no esté completo y válido THE SYSTEM SHALL mantener el botón de envío deshabilitado.
- **R50** — WHILE el visitante escribe en el modal THE SYSTEM SHALL reflejar lo escrito en una consola en vivo, línea por línea, y anunciar cuándo el mensaje queda listo para enviar.

### Envío real por servicio propio _(enmienda 2026-07-13 l: "que se envíe de verdad desde Railway, no por el correo del visitante, con animación de un agente entregándome el mensaje")_
- **R51** — WHEN el visitante envía el formulario válido THE SYSTEM SHALL enviar el mensaje a `christiancruzarango@gmail.com` mediante una petición HTTP al servicio propio, sin abrir el cliente de correo del visitante. _(Deroga R48; requiere backend — enmienda al alcance original "sin backend".)_
- **R52** — WHILE el envío está en curso THE SYSTEM SHALL mostrar una animación de un agente mensajero que lleva el sobre hasta el avatar de Christian, con estado de éxito o error al terminar.
- **R53** — IF el envío falla THEN THE SYSTEM SHALL informarlo y permitir reintentar sin perder lo escrito.

### Entradas ricas en "Mi día a día" _(enmienda 2026-07-13 m: relatar el flujo de chalc — equipar un proyecto y crear una spec — con gráficos, pasos y comandos)_
- **R54** — WHERE una entrada del blog lo requiera THE SYSTEM SHALL renderizar bloques de contenido: párrafos, subtítulos, listas de pasos numerados, comandos de terminal, citas e imágenes con pie de foto.
- **R55** — WHEN un párrafo contiene un enlace en formato `[texto](url)` THE SYSTEM SHALL renderizarlo como enlace navegable, abriendo los externos en una pestaña nueva.
- **R56** — WHEN el lector abre la entrada sobre chalc THE SYSTEM SHALL mostrar un diagrama de cómo se construye una especificación (idea → spec → plan → tareas → tests → código), en el idioma activo.

### Navegación responsive _(enmienda 2026-07-13 n)_
- **R57** — WHEN el sitio se ve en una pantalla angosta THE SYSTEM SHALL ofrecer la navegación tras un botón de menú, que abre y cierra el panel de enlaces y se cierra al elegir un destino.

### Citas con autoría _(enmienda 2026-07-13 o: "citar quién lo dijo")_
- **R58** — WHERE una cita tenga fuente THE SYSTEM SHALL mostrar la autoría bajo el texto, enlazada a la referencia original cuando exista.

### Vista previa al compartir un enlace _(enmienda 2026-07-14 p: "cuando comparto el link debería salir mi avatar y la noticia, no la presentación del portafolio")_
- **R59** — WHEN se comparte la URL de una nota THE SYSTEM SHALL entregar en el HTML servido las etiquetas Open Graph con el título y el resumen **de esa nota**, en el idioma de la ruta, para que la vista previa muestre la nota y no la presentación del sitio.
- **R60** — WHEN se comparte cualquier URL del sitio THE SYSTEM SHALL declarar como imagen de vista previa una portada apaisada (1200×630) con el avatar de Christian, en URL absoluta derivada del host de la petición.
- **R61** — WHERE la ruta no corresponda a una nota conocida THE SYSTEM SHALL usar el título y la descripción del sitio, sin fallar.

### Página Software: consola de despliegue de productos _(enmienda 2026-07-15 q: "una nueva ruta con el software que he elaborado, tipo juego: el usuario hace click y se va mostrando cada uno, bien explicado y con su link; algo diferente, como de código")_
- **R62** — WHEN el visitante navega a `/software` THE SYSTEM SHALL mostrar una consola de despliegue con los productos reales de Christian como servicios fuera de línea (`○ nombre [deploy]`) y un contador de estado `X/N en línea`, con contenido bilingüe versionado en `public/content`.
- **R63** — WHEN el visitante activa el despliegue de un producto THE SYSTEM SHALL reproducir en una terminal la secuencia de despliegue tecleada línea a línea (clone → install → build → tests → deploy) y, al terminar, revelar la ficha del producto: qué es, funcionalidades destacadas, stack y enlace a su URL pública.
- **R64** — WHERE un producto aún no tenga URL pública THE SYSTEM SHALL mostrarlo desplegado con estado "próximamente" en lugar de enlace.
- **R65** — WHEN todos los productos quedan en línea THE SYSTEM SHALL celebrarlo mostrando el contador completo (`N/N en producción`) con una animación de logro.
- **R66** — WHERE se muestre la navegación THE SYSTEM SHALL incluir la entrada "Software" hacia `/software` en ambos idiomas.

### Logos reales en la consola _(enmienda 2026-07-16 r: "coloca el logo de cada uno al lado del texto; retírale los tags de con qué está hecho")_
- **R67** — WHEN la consola lista o revela un producto THE SYSTEM SHALL mostrar el logo real del producto junto a su nombre, y la ficha prescinde de los chips de stack. _(Ajusta R62 y R63.)_

### Ficha con imagen, tecnologías y botones etiqueta _(enmienda 2026-07-16 s: "la imagen también al lado del texto; sí decir en qué se realizó; botones con <>; FutGol Pro en realidad se llama CraftBall")_
- **R68** — WHEN la ficha de un producto se revela THE SYSTEM SHALL mostrar el logo en grande junto al texto y las tecnologías reales como insignias amigables, y los botones de la consola se visten como etiquetas de código (`<desplegar/>`, `<visitar/>`). _(Matiza la enmienda r: las tecnologías vuelven, con estética cuidada.)_

### Cierre animado y descarga de las apps _(enmienda 2026-07-16 t: "si abro el contenedor no lo puedo cerrar, debería tener animación; Craftiva y CraftBall tienen app móvil con enlace de descarga")_
- **R69** — WHEN un producto está en línea THE SYSTEM SHALL permitir plegar y volver a abrir su detalle con una transición suave, sin apagar el servicio ni alterar el contador.
- **R70** — WHERE un producto tenga app publicada THE SYSTEM SHALL mostrar en su ficha los enlaces de descarga reales (App Store y Google Play).

### Vídeo reproducible dentro de una nota _(enmienda 2026-07-30 u: "coloca este vídeo en la nota que se vea para que la gente pueda dar play")_
- **R71** — WHERE una entrada del blog incluya un bloque de vídeo THE SYSTEM SHALL mostrarlo como reproductor incrustado dentro de la nota, con su pie de foto, para que el lector le dé play sin salir de la página. _(Amplía R54.)_

### El mundo voxel sustituye la landing _(enmienda 2026-08-25 v: "quiero como yo en muñeco y que se vaya moviendo... algo bien chevere como el mundo de desarrollador de Christian"; "la landing page ya no existiría, sería el mundo que vas a crear y que cada uno vaya a lo que tenemos en el menú")_

**Alcance de la enmienda:** la ruta raíz deja de ser una página editorial y pasa a ser un mundo 3D
navegable. Las páginas de destino (`/experience`, `/stack`, `/projects`, `/software`,
`/for-companies`, `/daily`) **no cambian**: el mundo es la nueva puerta de entrada, no un reemplazo
del sitio. El contenido que hoy vive solo en el inicio (hero, constelación, formación) se reubica
como zona del mundo y no se pierde.

**El mundo**
- **R72** — WHEN un visitante entra a la ruta raíz THE SYSTEM SHALL mostrar un mundo 3D de estilo voxel a pantalla completa, construido con la paleta del sitio, en lugar de la landing editorial. _(Deroga R1, R2, R22, R34, R35, R42 y R43 como sección editorial de la raíz; su contenido se reubica según R81.)_
- **R73** — WHEN el mundo se muestra THE SYSTEM SHALL representar a Christian como un personaje voxel con su avatar como rostro, bajo control del visitante.
- **R74** — WHEN el visitante pulsa WASD o las flechas, o arrastra en una pantalla táctil, THE SYSTEM SHALL desplazar al personaje con aceleración y frenado progresivos, orientándolo hacia su dirección de avance.
- **R75** — WHILE el personaje se desplaza THE SYSTEM SHALL seguirlo con una cámara que acompaña con retardo, sin saltos ni giros bruscos.
- **R76** — IF el personaje alcanza el límite del mundo THEN THE SYSTEM SHALL frenarlo dentro de los límites sin detenerlo en seco ni dejarlo caer.

**Las zonas**
- **R77** — WHEN el mundo se muestra THE SYSTEM SHALL construir una zona reconocible por cada destino del menú (trayectoria, stack, proyectos, software, para empresas, día a día), más una zona de presentación y una de contacto.
- **R78** — WHEN el personaje se aproxima a una zona THE SYSTEM SHALL destacarla visualmente y anunciar su nombre en el idioma activo.
- **R79** — WHEN el visitante activa la zona en la que está THE SYSTEM SHALL navegar a la ruta correspondiente del sitio, que se conserva sin cambios.
- **R80** — WHEN el visitante activa la zona de contacto THE SYSTEM SHALL abrir el modal de contacto existente (R46-R53) sin abandonar el mundo.
- **R81** — WHEN el visitante activa la zona de presentación THE SYSTEM SHALL mostrar quién es Christian —nombre, rol, años de experiencia, repositorios, formación académica y redes—, que es el contenido hoy repartido entre el hero y la sección de formación del inicio.

**Que nadie se quede fuera**
- **R82** — WHERE la raíz se muestre THE SYSTEM SHALL mantener visible la navegación del sitio sobre el mundo, operable con teclado y lectores de pantalla, de modo que todo destino sea alcanzable sin jugar.
- **R83** — IF el navegador no soporta WebGL THEN THE SYSTEM SHALL mostrar en la raíz la presentación y la navegación en HTML, sin errores ni pantalla en negro.
- **R84** — WHEN se sirve el HTML de la raíz THE SYSTEM SHALL incluir en el DOM el texto de presentación (nombre, rol y descripción) y conservar las etiquetas Open Graph del sitio, para que el enlace se indexe y se comparta como hoy. _(Extiende R59-R61.)_

**Rendimiento y movimiento**
- **R85** — WHILE el mundo se está cargando THE SYSTEM SHALL mostrar un estado de carga y no bloquear el primer pintado de la página.
- **R86** — WHILE el visitante tenga activada la preferencia de movimiento reducido THE SYSTEM SHALL mantener el mundo jugable pero sin movimientos automáticos de cámara ni oscilaciones decorativas. _(Matiza R38 solo para el mundo 3D: R38 sigue vigente para fades, typewriter, marquee y fondo.)_
- **R87** — WHEN el mundo se muestra en una pantalla angosta THE SYSTEM SHALL ofrecer controles táctiles y ajustar la carga de render para mantener el movimiento fluido.

### El mundo continuo del desarrollador _(enmienda 2026-08-25 w: "un mundo de un desarrollador, que se pueda navegar en todo lado, saltar, centrarse; esos cuadros cámbialos por algo más bonito y que sea un mundo completo")_

**Alcance:** sustituye el archipiélago de islas de la enmienda v por **un solo terreno continuo**.
R72–R87 siguen vigentes salvo lo que aquí se redefine. Los modelos 3D son CC0 reales
(Quaternius, Kenney), ya instalados en `public/models/`.

- **R88** — WHEN el visitante entra a la raíz THE SYSTEM SHALL mostrar un único terreno continuo con relieve y vegetación, recorrible en toda su extensión, ambientado como el mundo de un desarrollador. _(Deroga las islas y puentes de la enmienda v.)_
- **R89** — WHEN el visitante pulsa espacio (o el botón de salto en pantalla táctil) THE SYSTEM SHALL hacer saltar al personaje con su animación de salto y devolverlo al suelo por gravedad, sin poder encadenar un segundo salto en el aire.
- **R90** — WHILE el personaje se desplaza THE SYSTEM SHALL seguirlo con la cámara manteniéndolo centrado en el encuadre; WHEN el visitante pulsa la tecla de centrar THE SYSTEM SHALL recolocar la cámara tras el personaje de inmediato.
- **R91** — WHERE haya una zona THE SYSTEM SHALL representarla con una construcción reconocible de un mundo de desarrollador (oficina, sala de servidores, taller, biblioteca, buzón…), levantada con modelos reales, sin letreros de neón cuadrados. _(Deroga los portales de la enmienda v.)_
- **R92** — WHEN el personaje llega a la entrada de una construcción THE SYSTEM SHALL mostrar su nombre en el idioma activo y permitir entrar. _(Mantiene R78–R81.)_
- **R93** — WHILE el personaje está quieto, camina, corre, salta o se sienta THE SYSTEM SHALL reproducir la animación esquelética correspondiente del modelo, con transición suave entre estados.
- **R94** — WHERE el terreno termine THE SYSTEM SHALL impedir que el personaje caiga fuera del mundo. _(Mantiene R76.)_

### Formación como pipeline de CI _(enmienda 2026-08-26 x: "en el navbar crear un apartado donde sea lo que estudié, maestría, etc. — como el despliegue, algo llamativo")_

**Alcance:** la formación (R28, R37) ya no vive en el inicio —la raíz es el mundo 3D— y pasa a una página propia, presentada con la misma mecánica jugable que el software (R62–R69).

- **R95** — WHEN el visitante abre el menú THE SYSTEM SHALL ofrecer un destino "Formación" (`/education`) junto a Trayectoria, con página propia y carga perezosa.
- **R96** — WHEN la página de formación se muestra THE SYSTEM SHALL listar cada título (máster, ingeniería, tecnólogo) como un *job* de pipeline pendiente, con institución, título y periodo visibles, y un contador `0/N` de jobs superados.
- **R97** — WHEN el visitante ejecuta un job THE SYSTEM SHALL teclear línea a línea un guion de build en inglés (rama de estudio, `npm run learn`, exámenes en verde, merge a la carrera) y marcar el job como superado al terminar, incrementando el contador.
- **R98** — WHEN la página de formación se muestra THE SYSTEM SHALL presentar los cursos complementarios como paquetes instalados (`npm ls`), uno por línea.
- **R100** — WHEN el visitante pulsa el pliegue de un job superado THE SYSTEM SHALL ocultar su log sin deshacer el job, y volver a mostrarlo al pulsar de nuevo (como R69).
- **R99** — WHEN todos los jobs están superados THE SYSTEM SHALL mostrar un logro desbloqueado, como en R66.

### Énfasis y código en el texto de las notas _(enmienda 2026-09-01 y: los `**` y las comillas invertidas se muestran en crudo en las notas publicadas)_

**Problema:** el motor de bloques solo reconoce enlaces (R55). Las notas escriben `**texto**` para destacar
y `` `texto` `` para nombrar comandos, archivos y símbolos, pero ambos llegan al lector como asteriscos y
comillas literales. Afecta a las entradas ya publicadas, no solo a las nuevas.

- **R101** — WHEN un texto de una nota contiene un fragmento entre dobles asteriscos (`**texto**`) THE SYSTEM SHALL renderizarlo como texto destacado, sin mostrar los asteriscos. _(Amplía R55.)_
- **R102** — WHEN un texto de una nota contiene un fragmento entre comillas invertidas (`` `texto` ``) THE SYSTEM SHALL renderizarlo como código en línea, sin mostrar las comillas. _(Amplía R55.)_
- **R103** — WHERE un fragmento no cierre su marca, o esté vacío, THE SYSTEM SHALL dejar el texto tal cual lo escribió el autor, sin perder caracteres.
- **R104** — WHEN un fragmento destacado contiene a su vez código en línea (`` **`texto`** ``) THE SYSTEM SHALL renderizar las dos marcas, sin mostrar ninguna de las dos. Dentro de un fragmento de código no se interpreta ninguna otra marca. _(Amplía R101 y R102; el caso se da hoy en notas ya publicadas.)_

Aplica en los textos que hoy admiten enlaces: párrafos y elementos de lista. Los pies de foto
no los admiten y quedan fuera de esta enmienda.
Los enlaces de R55 siguen funcionando igual y pueden convivir con las marcas nuevas en el mismo texto.

## Fuera de alcance

- Backend, base de datos, autenticación o panel de administración (el contenido del blog vive versionado en el proyecto).
- Comentarios, likes o métricas en el blog.
- Consumo en vivo de la API de GitHub o LinkedIn en runtime (los datos de proyectos y experiencia son contenido curado del sitio).
- Newsletter / formulario de contacto.

## Decisiones resueltas

- **Idiomas:** Español (por defecto) e Inglés. _(confirmado por Christian)_
- **Proyectos destacados:** cc-form-engine, cacode, cc-dynamic-voice-forms, whatsapp-openai-bot-service, angular-modularize-skill, mcp-postgres-claude. _(confirmado por Christian)_
- **Experiencia laboral:** obtenida del perfil de LinkedIn con la sesión de Christian (10 posiciones, 2016 → actualidad). El contenido curado vive en `content.md` de esta spec.
- **Blog inicial:** 1 entrada de ejemplo (ES/EN) que sirve de plantilla para futuras entradas. _(confirmado por Christian)_
