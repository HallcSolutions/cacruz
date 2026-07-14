---
name: dev-note
description: Escribe una nota nueva para "Notas de desarrollo" (/daily) de cacruz.com. Úsala cuando Christian pida crear, redactar o publicar una nota, entrada, post o artículo del blog. Define el formato de bloques tipo .md, el tono, los gráficos SVG y los pasos de publicación.
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
- Longitud sana: 15–30 bloques. Si crece más, parte en dos notas.

## Gráficos SVG (uno por idioma)

- Fondo `#0d0b16 → #181329`, acento violeta `#a78bfa`, texto `#ece7fb`, secundario `#8a7fb0`,
  verde `#34d399` para lo correcto, rojo `#fb7185` para lo que falla.
- `viewBox="0 0 1000 460"` aprox., tipografías: `Georgia, serif` para el título, `ui-monospace` para el resto.
- **Siempre animados** (líneas de flujo con `stroke-dasharray`, pulsos, órbitas) y **sin** `prefers-reduced-motion`
  (el dueño quiere las animaciones siempre activas — R38).
- Referencias vivas: `public/images/blog/spec-flow.es.svg` y `tdd-cycle.es.svg`.

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
