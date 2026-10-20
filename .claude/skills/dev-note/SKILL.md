---
name: dev-note
description: Escribe una nota nueva para "Notas de desarrollo" (/daily) de cacruz.com. Úsala cuando Christian pida crear, redactar o publicar una nota, entrada, post o artículo del blog. Define cómo escribir con gancho e hilo narrativo, qué gráfico SVG hacer para cada idea, el formato de bloques tipo .md y los pasos de publicación.
---

# Nota de desarrollo (entrada del blog)

Las notas de `/daily` se renderizan como un archivo `.md` abierto en un editor: numeración de línea,
marcadores markdown (`#`, `##`, `>`, `![...]`) y bloques que se revelan al hacer scroll.
El contenido es **JSON versionado en `public/content/`** — publicar no requiere tocar código ni recompilar lógica.

## Pasos para publicar (en orden)

1. Crea `public/content/blog/<slug>.json` con el contenido completo (ES y EN).
2. Agrega la entrada al inicio de `public/content/blog/index.json` (título, resumen, fecha, tags).
3. Si la nota lleva gráfico, crea `public/images/blog/<nombre>.es.svg` y `<nombre>.en.svg`.
4. Valida el JSON: `Get-Content <archivo> -Raw | ConvertFrom-Json` (o `node -e "require('./<archivo>')"`).
5. Verifica en `/daily` que aparece en el listado y abre correctamente.

**No** se escriben tests para una nota nueva: el motor de bloques ya está cubierto (R54–R56).
Si la nota necesita un **tipo de bloque nuevo**, entonces sí: spec → test en rojo → código (ver `specs/001-landing-personal/spec.md`).

## Reglas duras

- **Slug en inglés**, en kebab-case, descriptivo del beneficio: `ship-a-feature-in-hours`, no `mi-nota-1`.
- **Bilingüe siempre**: todo bloque existe en `es` y en `en`. Nunca publiques una nota a medias.
- **Fecha real** en formato `YYYY-MM-DD`, la del día en que se publica.
- **El mismo título y resumen** deben ir en `index.json` y en el archivo de la nota (se leen del índice para el listado).
- **Resumen de 360 caracteres como máximo** en cada idioma. En `/daily`, el resumen, la fecha y los `#tags` se
  despliegan en un panel con altura fija (`max-height: 8rem` en `blog-list.css`); un resumen más largo empuja la
  fila de fecha y hashtags fuera del panel y la entrada se ve distinta a las demás. Comprueba la longitud:
  `node -e "const e=require('./public/content/blog/index.json')[0];console.log(e.summary.es.length,e.summary.en.length)"`
- Los gráficos son **SVG propios y animados**, uno por idioma (el texto va dentro del SVG y no pasa por i18n).

## Estructura del archivo

```json
{
  "slug": "ship-a-feature-in-hours",
  "date": "2026-07-13",
  "title": { "es": "…", "en": "…" },
  "summary": { "es": "…", "en": "…" },
  "tags": ["chalc", "sdd", "tdd"],
  "body": {
    "es": [ /* bloques */ ],
    "en": [ /* los mismos bloques, traducidos */ ]
  }
}
```

## Bloques disponibles

| Bloque | Uso | Forma |
|---|---|---|
| `paragraph` | Texto normal. Admite enlaces `[texto](url)`. | `{ "kind": "paragraph", "text": "…" }` |
| `heading` | Sección (se muestra con `##`). | `{ "kind": "heading", "text": "Paso 1 · …" }` |
| `quote` | Frase destacada (se muestra con `>`). Con `source`/`sourceUrl` cita a su autor. | `{ "kind": "quote", "text": "…", "source": "DeMillo, Lipton y Sayward · IEEE Computer, 1978", "sourceUrl": "https://…" }` |
| `steps` | Lista numerada con entrada escalonada. | `{ "kind": "steps", "items": ["…", "…"] }` |
| `terminal` | Comandos y su salida. | `{ "kind": "terminal", "lines": ["chalc", "→ detect: angular 20"] }` |
| `image` | Gráfico con pie de foto. | `{ "kind": "image", "src": "images/blog/x.es.svg", "caption": "…" }` |

Enlaces: internos (`/projects`, `/for-companies`) navegan dentro del sitio; los que empiezan por `http`
abren en pestaña nueva automáticamente.

## Escribir como escritor, no como documentación

Una nota no es un manual: es una historia corta con una idea que el lector se lleva. Antes de escribir un solo
bloque, completa estas tres frases (no se publican, son tu brújula):

1. **La idea en una línea:** *«Después de leer esto, el lector sabrá que …»*. Si no cabe en una línea, son dos notas.
2. **El dolor:** qué le pasa hoy al lector que esta idea arregla. Empieza por ahí, no por la herramienta.
3. **El giro:** qué cree el lector que la nota va a desmentir o matizar. Sin giro no hay tensión y no se lee.

### El gancho (los dos primeros bloques deciden todo)

La gente escanea antes de leer: los dos primeros párrafos y los títulos son lo que más se mira
(NN/g, *F-Shaped Pattern*, 2006). El primer `paragraph` **nunca** es contexto ni definición; elige uno:

| Gancho | Cuándo | Ejemplo |
|---|---|---|
| **Escena** | Hay un momento concreto que el lector reconoce. | *«Son las 11 de la noche y el test pasa. El bug sigue en producción.»* |
| **Contradicción** | La nota desmiente algo que «todos saben». | *«La cobertura al 100% no prueba nada.»* |
| **Pregunta incómoda** | El lector cree saber la respuesta y no la sabe. | *«¿Tu test fallaría si el código estuviera mal?»* |
| **Antes / después** | La nota cuenta un cambio propio. | *«Antes tardaba dos días en un formulario. Hoy lo cierro en una tarde, y no por escribir más rápido.»* |

Justo después del gancho va la `quote` que resume la tesis y, si la nota tiene gráfico de resumen, la `image`
«la nota entera en una imagen». Quien solo lea esas tres piezas debe llevarse la idea.

### El hilo narrativo

Sigue la columna de una historia (la *story spine* de Kenn Adams, que equipos como Anvil usan para sus posts
técnicos): **así era → hasta que → por eso → por eso → hasta que por fin → y desde entonces**.
En una nota se traduce en: situación habitual → el problema aparece → lo que probé (y lo que falló) → lo que
funcionó → cómo se ve ahora → qué cambió de verdad. Una nota que solo lista pasos es documentación; una que
cuenta por qué hizo falta cada paso es una historia.

### Claridad (patrones de Julia Evans, *Patterns in confusing explanations*, 2021)

- **Concreto antes que abstracto:** primero el ejemplo que el lector ya conoce, luego el nombre del concepto.
- **Un concepto nuevo por sección.** Si un párrafo introduce tres siglas, se parte.
- **Ejemplos reales**, sacados de código que de verdad escribirías (de chalc, de este sitio), no `foo`/`bar`.
- **Si muestras el camino equivocado, avísalo antes:** *«Lo primero que probé (y no funcionó) fue…»*.
- **Analogías cortas:** una frase, una sola idea. Una analogía que necesita un párrafo confunde más de lo que ayuda.
- **El porqué antes que el qué**, aunque el porqué sea personal: *«lo elegí porque…»* vale más que una razón genérica.

### Ritmo y voz

- **Escribe como hablas** (Paul Graham, *Write Like You Talk*, 2015): relee cada frase y pregúntate si se la
  dirías así a un amigo. Si no, reescríbela como se la dirías. Leerla en voz alta delata las frases rígidas.
- **Frases cortas por defecto**, alguna larga para respirar. Una frase de cuatro palabras después de una larga golpea.
- **Párrafos de 1 a 4 frases**, una idea cada uno. Un muro de texto se salta.
- **Verbos activos y sujeto humano:** *«el test atrapa el error»*, no *«el error es atrapado»*.

### Títulos de sección que se leen solos

Quien escanea lee solo los `heading` (patrón *layer-cake*, NN/g, Kara Pernice, 2019). Por eso:

- Cada `heading` dice **la conclusión de la sección**, no el tema: *«TDD: la prueba que demuestra que se cumplió»*,
  no *«Sobre TDD»*.
- **Palabras informativas primero** y cortos; nunca más amplios que su contenido.
- Prueba: lee solo el título de la nota y los `heading` en orden. Si la historia no se entiende, reescríbelos.

### Cierre

Termina con **lo que cambió de verdad** (en primera persona, concreto) y una invitación con enlace interno
(`/projects`, `/for-companies`). Nunca termines en un resumen que repite la nota: el lector ya la leyó.

## Cómo escribir (tono de Christian)

- **Primera persona, para un lector final**, no para un experto: explica el término antes de usarlo.
- Cada sección responde **por qué importa** antes del **cómo se hace**. Sin el porqué, la nota no se publica.
- **Nada de palabrería corporativa.** En vez de "mejora la mantenibilidad", escribe la consecuencia concreta:
  *"un componente se corrige una sola vez y todos los proyectos lo reciben"*.
- **Sin cifras que no se puedan sustentar** en una entrevista. Si no la puedes defender, no la escribas.
- **Cita a quien lo dijo.** Toda afirmación de autoridad (una técnica, una hipótesis, una frase célebre) lleva
  `source` con autor y año, y `sourceUrl` a la referencia original. **Verifica la fuente antes de escribirla**
  (búsqueda web); nunca atribuyas de memoria.
- Títulos que digan **por qué leer la nota**: *"Cómo entrego un feature completo en horas"*, no *"De la carpeta vacía"*.
- Estructura recomendada: gancho → cita que resume la idea → secciones (`heading` + `paragraph` + `steps`/`terminal`)
  → gráfico que lo explique visualmente → qué mejora de verdad → cierre con enlaces al sitio
  → **sección final "Para leer más" / "Further reading"** con un `steps` de enlaces a la documentación y las fuentes
  citadas (repositorio, paper original, docs de la herramienta). Cada punto: `[título](url)` + una frase de por qué vale la pena.
- **Sin límite de longitud.** Una nota dura lo que tenga que durar: manda el contenido, no un número de bloques.
  Nunca propongas partirla ni recortarla por tamaño; hazlo solo si Christian lo pide.

## Ortografía y puntuación (innegociable)

La nota se publica **sin una sola falta**. Antes de dar una nota por terminada, revísala entera en los dos
idiomas — no a ojo: pasa una comprobación bloque a bloque.

- **Tildes**: repasa diacríticas (`él/el`, `tú/tu`, `sí/si`, `más/mas`, `qué/que`, `cómo/como`, `sé/se`,
  `aún/aun`, `dé/de`) y `por qué` / `porque` / `porqué` / `por que`. También `sino` vs `si no`.
- **Signos dobles en español**: toda `?` lleva su `¿` y toda `!` su `¡`.
- **Comillas**: en español, angulares «…»; en inglés, rectas `"…"` (escapadas en el JSON). Nunca mezcles.
- **Raya (—)**: en español va en pareja para incisos (`—así—`) y pegada al texto que encierra; una raya suelta
  a mitad de frase casi siempre debe ser una coma o dos puntos. En inglés sí es correcta la raya sola
  (`… reasonable — which is almost never …`). Se admite raya sola como separador en la bibliografía de ambos
  idiomas (`[título](url) — autor, año: …`).
- **Concordancia y tiempos verbales**: sujeto/verbo y género/número; cuidado al reescribir a medias
  (`el que firma… eres tú`, no `sigues siendo tú`). Nada de enumerar tres «mitades» de un mismo grupo.
- **Porcentajes sin espacio** (`48%`), para no romper línea y por coherencia con las notas ya publicadas.
- **Español neutro**: evita regionalismos fuertes (`coger`, `de una tacada`, `ordenador` frente a
  `computador`) y monedas que no encajen con la fuente citada.
- **Sin espacios dobles, sin espacio antes de coma o punto**, sin `...` (usa `…` solo si hace falta).
- **Los dos idiomas en paralelo**: si corriges algo en `es`, aplica el equivalente en `en`. La secuencia de
  bloques debe ser idéntica en ambos.
- Comprobación rápida antes de publicar (valida JSON y detecta rayas/comillas descuadradas):
  ```bash
  node -e "const j=require('./public/content/blog/<slug>.json');const k=l=>j.body[l].map(b=>b.kind[0]).join('');console.log(k('es')===k('en'))"
  ```

## Gráficos SVG (uno por idioma)

### Qué gráfico hacer

Un gráfico se gana su lugar cuando muestra algo que el texto cuenta peor: una relación, un flujo, una
comparación. **Nunca** es decoración. Elige la forma por lo que quieres que el lector vea:

| Lo que el lector debe ver | Forma | Ejemplo en el blog |
|---|---|---|
| La nota entera de un vistazo | Tarjetas en paralelo, una por idea | `dd-four-questions` |
| Un proceso o ciclo | Flujo con flechas animadas | `spec-flow`, `tdd-cycle` |
| Dos formas de hacer lo mismo | Lado a lado, mismo contenido en cada columna | `ears-vs-gherkin` |
| Una transformación | Antes → después | `story-to-spec` |
| Capas que se apilan | Pila vertical con el hilo que las une | `dd-story-layers` |
| Cuándo usar qué | Matriz o árbol de decisión | `dd-when-to-use` |

Cuántos: uno de resumen tras el gancho y uno por cada sección cuyo punto central sea una relación o un flujo.
Si una sección se entiende igual sin gráfico, no lo lleva.

### Cómo hacer que se entienda (principios de Richard Mayer, *Multimedia Learning*)

- **Un gráfico, un mensaje.** El título del SVG es **la conclusión**, no el tema: *«No son rivales: son cuatro
  preguntas»*, no *«Las cuatro técnicas»*. El subtítulo dice qué mirar.
- **Coherencia:** quita todo lo que no ayude a ese mensaje (iconos de relleno, texto repetido, adornos).
- **Señalización:** el violeta `#a78bfa` marca **lo único** que importa; el resto en tonos apagados.
  Verde = correcto, rojo = falla, nunca como decoración.
- **Etiquetas pegadas a lo que nombran**, dentro del SVG, no en una leyenda aparte.
- **La animación sigue el orden de lectura** (izquierda → derecha, arriba → abajo, con `animation-delay`
  escalonado): guía el ojo, no compite con él.
- **Texto legible en móvil:** nada por debajo de `13px` en el `viewBox` de 1000 de ancho; máx. ~6 palabras por etiqueta.
- **Ubicación:** la `image` va **justo después** del párrafo que la anuncia. El `caption` es de una o dos frases y
  dice qué concluir, no describe lo que ya se ve.

### Estilo

- Fondo `#0d0b16 → #181329`, acento violeta `#a78bfa`, texto `#ece7fb`, secundario `#8a7fb0`,
  verde `#34d399` para lo correcto, rojo `#fb7185` para lo que falla.
- `viewBox="0 0 1000 460"` aprox., tipografías: `Georgia, serif` para el título, `ui-monospace` para el resto.
- **Siempre animados** (líneas de flujo con `stroke-dasharray`, pulsos, órbitas) y **sin** `prefers-reduced-motion`
  (el dueño quiere las animaciones siempre activas — R38).
- Referencias vivas: `public/images/blog/spec-flow.es.svg` y `tdd-cycle.es.svg`.

## Prueba de atención (antes de publicar)

Además de la ortografía, la nota pasa estas cinco preguntas. Si alguna falla, se reescribe esa parte:

1. ¿El primer párrafo es un gancho (escena, contradicción, pregunta o antes/después) y no contexto?
2. ¿Gancho + cita + gráfico de resumen bastan para llevarse la idea?
3. ¿Leyendo solo el título y los `heading` se entiende la historia?
4. ¿Cada gráfico tiene un título que es conclusión y un caption que dice qué concluir?
5. ¿Hay al menos un ejemplo concreto y real por cada concepto nuevo?

## Ejemplo mínimo completo

```json
{
  "slug": "why-i-review-with-mutants",
  "date": "2026-07-20",
  "title": { "es": "Por qué reviso con mutantes", "en": "Why I review with mutants" },
  "summary": { "es": "Un test que pasa no prueba nada.", "en": "A passing test proves nothing." },
  "tags": ["testing", "calidad"],
  "body": {
    "es": [
      { "kind": "paragraph", "text": "La cobertura al 100% con tests débiles es un número bonito." },
      { "kind": "heading", "text": "Qué es un mutante" },
      { "kind": "quote", "text": "¿Este test detectaría el error si el código estuviera mal?" },
      { "kind": "terminal", "lines": ["npm run test:mutation", "→ mutation score: 96.2%"] },
      { "kind": "image", "src": "images/blog/tdd-cycle.es.svg", "caption": "El ciclo completo." },
      { "kind": "paragraph", "text": "Más en [mis proyectos](/projects)." }
    ],
    "en": [
      { "kind": "paragraph", "text": "100% coverage with weak tests is a pretty number." },
      { "kind": "heading", "text": "What a mutant is" },
      { "kind": "quote", "text": "Would this test catch the bug if the code were wrong?" },
      { "kind": "terminal", "lines": ["npm run test:mutation", "→ mutation score: 96.2%"] },
      { "kind": "image", "src": "images/blog/tdd-cycle.en.svg", "caption": "The full cycle." },
      { "kind": "paragraph", "text": "More in [my projects](/projects)." }
    ]
  }
}
```
