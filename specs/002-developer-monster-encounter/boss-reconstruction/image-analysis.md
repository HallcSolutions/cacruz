# Deuda técnica — análisis de la referencia

Referencia: `../technical-debt-boss-concept.png`. Petición: aproximar el aspecto aprobado mediante un modelo 3D de juego. Este documento analiza la imagen; no acredita un modelo construido.

## Identificación y adecuación

Objeto objetivo: ensamblaje mecánico bípedo de placas y cables, ubicado en el centro de la escena. Dominio de construcción: objeto mecánico articulado de superficies duras, no anatomía humana ni malla orgánica con piel. Confianza en identificación: alta. La imagen completa es una escena; el objeto seleccionado tiene contorno completo y resolución suficiente para reconocer sus ensamblajes. Adecuación condicional para reconstrucción estilizada; no extracción exacta de malla.

## Forma y proporciones observadas

Torso ancho inclinado, pelvis estrecha, piernas cortas y pies anchos. Brazos que descienden aproximadamente hasta los tobillos; el antebrazo de mayor volumen se ve en la derecha de la imagen. Contorno interrumpido por cables en arco sobre la espalda y laterales. Dos pantallas rectangulares inclinadas ocupan la región de hombros. Núcleo luminoso dentro de una abertura del pecho. La perspectiva muestra frente y un lateral; no permite medir directamente la altura real respecto al protagonista más cercano a cámara. Se conserva el requisito de 2–3 alturas del avatar.

## Descomposición macro → meso → micro

- Torso: jaula exterior de placas solapadas → aro interior y abertura del pecho → cantos biselados, juntas, tornillos y pequeñas marcas.
- Espalda: bastidor posterior → haces de cables negros en arcos diferenciados → conectores, abrazaderas y bandas.
- Hombros: placas asimétricas → carcasas y bisagras de las pantallas → marcos, esquinas, tornillos e inscripciones de código.
- Brazos: soportes superiores y articulaciones de codo → antebrazos de bloques desiguales → separaciones entre placas, remaches y marcas superficiales.
- Pelvis y piernas: cadera, muslos, rodillas y espinillas → pies segmentados → juntas, cantos y ranuras.
- Núcleo: alojamiento oscuro → volumen facetado ámbar y segmentos emisivos → huecos oscuros que separan los segmentos.

## Relaciones y contactos

El núcleo está encajado en el pecho, no suspendido delante. Pantallas montadas sobre los hombros, acompañando al torso. Brazos conectados mediante pivotes de hombro/codo; piernas mediante cadera/rodilla. Pies apoyados sobre el plano del suelo. Los cables conectan anclajes de espalda, torso y hombros: sus extremos deben entrar en conectores, sin piezas flotantes. Estas relaciones son inferencias constructivas a partir de contactos visibles.

## Materiales y acabado

Placas: grafito de valor medio/bajo, acabado predominantemente mate/satinado, aristas más claras y variación local de rugosidad. No copiar las sombras de la imagen como albedo. Bordes expuestos pueden mostrar respuesta metálica; pintura oscura y caucho son dieléctricos. Cables: negros, más oscuros que las placas, sección redonda y reflejo estrecho. Pantallas: caras negras con texto ámbar/rojo, marco mate separado de la cara. Núcleo: ámbar de emisión localizada; no convertir el torso entero en emisivo. La luz fría superior/lateral revela el volumen y el núcleo produce un acento cálido.

## Rasgos cuya ausencia bloquea aceptación visual

1. Masa encorvada con piernas cortas y pies pesados.
2. Brazos largos y desiguales con varias placas, no dos cubos simétricos.
3. Dos pantallas inclinadas y legibles como código.
4. Núcleo ámbar facetado encajado en el pecho.
5. Cables curvos de sección visible que rompen la silueta posterior/superior.

## Incertidumbres

Espalda completa, parte inferior y conectores ocultos no se ven; se reconstruirán de forma coherente y se identificarán como inferidos. Las pequeñas marcas no todas se leen con precisión. La iluminación impide obtener parámetros PBR exactos a simple vista. Es obligatorio revisar geometría lateral/posterior y materiales renderizados; este análisis no promete igualdad píxel a píxel.

## Contrato de revisión

El objetivo es una reconstrucción estilizada fiel a los rasgos anteriores. Bloquean la entrega: contorno de robot genérico, simetría total de brazos, núcleo fuera del pecho, cables rectos o flotantes, pies sin apoyo, brillo que borra las placas, ausencia de pantallas y fallos en vistas laterales. Comparar un render real de tres cuartos con la referencia y revisar frontal, laterales y posterior. Los tests estructurales solo validan escala, pivotes y recursos; no sustituyen esta evaluación.
