export const ES_TRANSLATIONS: Record<string, string> = {
  'nav.home': 'Inicio',
  'nav.experience': 'Trayectoria',
  'nav.stack': 'Stack',
  'nav.projects': 'Proyectos',
  'nav.blog': 'Notas',
  'nav.value': 'Impacto',
  'hero.kicker': 'Hola, soy',
  'hero.role': 'Senior Full-Stack Developer · AI Engineer',
  'hero.degree': 'Ingeniería de Sistemas — UNAD',
  'hero.stats.years': 'años de experiencia',
  'hero.stats.repos': 'repos open source',
  'hero.stats.masters': 'maestrías en IA',
  'hero.location': 'Cali, Colombia',
  'experience.title': 'Trayectoria',
  'experience.subtitle': 'Dónde he trabajado',
  'education.title': 'Formación',
  'education.subtitle': 'Ingeniería y maestrías',
  'education.courses': 'Cursos complementarios',
  'tech.title': 'Mi Stack',
  'tech.subtitle': '12+ años construyendo software',
  'projects.title': 'Proyectos',
  'projects.subtitle': 'Código abierto en GitHub',
  'projects.viewRepo': 'Ver repositorio',
  'projects.viewAll': 'Ver todos los repositorios en GitHub',
  'blog.title': 'Notas de desarrollo',
  'blog.subtitle': 'Lo que aprendo construyendo software, cada día',
  'blog.count': 'entradas publicadas',
  'blog.read': 'Leer entrada',
  'blog.back': 'Volver a las notas',
  'blog.loading': 'Cargando…',
  'blog.notFound.title': 'Entrada no encontrada',
  'blog.notFound.body': 'La entrada que buscas no existe o fue movida.',
  'a11y.changeLanguage': 'Cambiar idioma',
  'contact.title': 'Escríbeme',
  'contact.section.title': 'Contáctame',
  'contact.section.body': '¿Tienes un proyecto o una vacante? Hablemos.',
  'contact.section.cta': 'Abrir formulario',
  'contact.command': './contactar --a christian',
  'contact.hint': 'Cuéntame quién eres y en qué te puedo ayudar.',
  'contact.name': 'nombre',
  'contact.email': 'correo',
  'contact.message': 'mensaje',
  'contact.send': 'enviar',
  'contact.error.required': 'Este campo es obligatorio.',
  'contact.error.email': 'Escribe un correo válido.',
  'contact.error.send': 'No se pudo enviar. Intenta de nuevo.',
  'contact.sending': 'Enviando mensajero',
  'contact.sent': '¡Entregado! Christian te responderá pronto.',
  'contact.done': 'cerrar',
  'value.title': 'Cómo te puedo ayudar',
  'value.pitch':
    'Llevo 12 años escribiendo software en plataformas de energía, transporte y seguridad, entre Colombia y España. Si algo aprendí en el camino es que un feature no empieza en el código: empieza en la prueba. Las pruebas unitarias son las que dicen si algo funciona de verdad. También son la red que deja volver a ese código meses después, cambiar lo que haga falta y saber en segundos si algo se rompió. Cada proyecto me enseña algo nuevo, y esa curiosidad es lo que más disfruto de este oficio. Ojalá el próximo sea con ustedes.',
  'value.proof': 'Dónde',
  'value.result': 'Resultado',

  'value.stats.years': 'años en producción',
  'value.stats.companies': 'empresas y consultoras',
  'value.stats.countries': 'países: Colombia y España',
  'value.stats.sectors': 'sectores críticos: energía, transporte y seguridad',

  'value.arch.title': 'Librerías y microfrontends que evitan reescribir',
  'value.arch.body':
    'Desarrollé librerías Angular propias que centralizan componentes, utilidades y lógica compartida, e implementé microfrontends con Angular Elements, Web Components y Module Federation para que varios equipos trabajen sobre la misma base.',
  'value.arch.result':
    'Un componente se corrige una sola vez y todos los proyectos lo reciben: se acabó copiar y pegar el mismo código en cada repositorio.',
  'value.arch.proof': 'Indra (Minsait) · SG Tech · Raddar Studios',

  'value.delivery.title': 'Sistemas configurables sin tocar el código',
  'value.delivery.body':
    'Diseñé sistemas gobernados por archivos JSON y microservicios .NET desacoplados, integrados con Angular, con procedimientos almacenados y transacciones optimizadas en SQL Server.',
  'value.delivery.result':
    'Cambiar un campo, una validación o una regla dejó de ser un desarrollo con despliegue: hoy se edita un archivo de configuración y queda listo el mismo día.',
  'value.delivery.proof': 'Indra · MinTransporte (Datatools)',

  'value.domain.title': 'Migraciones y modernización sin frenar el negocio',
  'value.domain.body':
    'Ejecuté migraciones de Angular v5 a v19 asegurando compatibilidad y actualización de dependencias, y automaticé los despliegues con pipelines en Jenkins, GitLab y Azure DevOps.',
  'value.domain.result':
    'Aplicaciones que estaban 14 versiones atrás quedaron soportadas y al día, y el despliegue pasó de ser un proceso manual a un pipeline que corre solo.',
  'value.domain.proof': 'Indra (Minsait) · Datatools · Raddar Studios',

  'value.ai.title': 'IA gobernada por especificación',
  'value.ai.body':
    'Integré LLMs, MCP y agentes al ciclo real de desarrollo con Spec-Driven Development: la especificación gobierna la implementación, cada requisito (R#) queda trazado y el gasto en tokens se mide por comando.',
  'value.ai.result':
    'La IA deja de improvisar: implementa contra una especificación aprobada y cada cambio queda documentado y auditable en el repositorio.',
  'value.ai.proof': 'Think Us · Raddar Studios',

  'value.quality.title': 'Defectos atrapados antes del usuario',
  'value.quality.body':
    'Establecí TDD, mutation testing y pruebas E2E con Playwright dentro del CI/CD: ningún código entra sin un test que primero falle, y los propios tests se verifican introduciendo mutantes.',
  'value.quality.result':
    'Los tests dejan de ser decorativos: si un mutante sobrevive, el test era débil y se refuerza. El error aparece en el pipeline, no en la llamada del cliente.',
  'value.quality.proof': 'Think Us · Raddar Studios · Datatools',

  'value.lead.title': 'Equipos que entregan y aprenden',
  'value.lead.body':
    'Lideré equipos de desarrollo gestionando tareas, tiempos y calidad del código; seleccioné la tecnología adecuada para cada proyecto y llevé funcionalidades desde la especificación hasta producción.',
  'value.lead.result':
    'El equipo sabe qué construye y por qué: cada tarea apunta a un requisito y el avance se mide con evidencia, no con estimaciones optimistas.',
  'value.lead.proof': 'Raddar Studios · Andina de Seguridad del Valle',

  'value.cta.title': 'Construyamos algo juntos',
  'value.cta.body': 'Estoy abierto a nuevos retos.',
  'value.cta.email': 'Escríbeme',
};
