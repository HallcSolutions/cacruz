import { PrivacyPolicy } from '../privacy-policy';

export const ES: PrivacyPolicy = {
  languageName: 'Español',
  title: 'Política de privacidad de Chranta',
  updated: 'Última actualización: 12 de octubre de 2026',
  intro:
    'Chranta es una app de finanzas personales para iPhone, iPad y Android. Está diseñada para que tu información financiera nunca salga de tu dispositivo. Esta política explica qué información maneja la app, dónde se guarda y qué no hacemos con ella.',
  sections: [
    {
      heading: 'Resumen',
      paragraphs: [
        'No recolectamos, recibimos, guardamos, vendemos ni compartimos tus datos personales. Todo lo que registras en Chranta se queda en tu dispositivo, cifrado.',
      ],
      bullets: [
        'No necesitas crear una cuenta ni registrarte.',
        'Sin servidores: no tenemos ningún backend que reciba tus datos.',
        'Sin publicidad, analítica, reportes de fallos ni herramientas de rastreo.',
        'El asistente de IA funciona por completo en tu dispositivo y no envía tus datos a ningún servicio de IA de terceros.',
      ],
    },
    {
      heading: 'Quiénes somos',
      paragraphs: [
        'Chranta es desarrollada por Christian Cruz Arango, desarrollador independiente (cacruz.com). En esta política, «nosotros» se refiere al desarrollador.',
      ],
    },
    {
      heading: 'Información que registras en la app',
      paragraphs: [
        'Para funcionar, Chranta guarda la información que tú decides registrar. Se almacena solo en tu dispositivo, en una base de datos cifrada con SQLCipher (AES-256). La clave de cifrado se guarda en el Llavero de iOS o en el Keystore de Android. Nosotros no podemos ver ni acceder a esta información.',
      ],
      bullets: [
        'País, idioma, moneda y saldo inicial.',
        'Ingresos, gastos, categorías y presupuestos.',
        'Deudas, cuotas y pagos fijos (por ejemplo arriendo, luz o internet).',
        'Metas de ahorro y dinero reservado.',
        'Tus preferencias, como la hora de los recordatorios y si se muestran los montos.',
      ],
    },
    {
      heading: 'Asistente de IA (en el dispositivo)',
      paragraphs: [
        'El asistente usa un modelo de lenguaje de código abierto, Qwen3-0.6B (licencia Apache-2.0), que viene incluido dentro de la app y se ejecuta localmente en tu dispositivo con LiteRT, de Google. El modelo nunca se descarga ni se consulta en un servidor remoto.',
        'Lo que le escribes al asistente, y los registros financieros que lee para responderte, se procesan solo en tu dispositivo. Nada se envía a OpenAI, Google, Anthropic ni a ningún otro servicio de IA de terceros, ni a nosotros. Las conversaciones no se guardan, y el asistente nunca guarda un registro hasta que lo revisas y lo confirmas. El asistente funciona sin conexión a internet.',
      ],
    },
    {
      heading: 'Face ID, Touch ID y código del dispositivo',
      paragraphs: [
        'Puedes bloquear Chranta con Face ID, Touch ID, huella o el código de tu dispositivo. La autenticación la hace el sistema operativo: la app solo sabe si fue exitosa y nunca tiene acceso a tus datos biométricos.',
      ],
    },
    {
      heading: 'Recordatorios de pago',
      paragraphs: [
        'Los recordatorios son opcionales y vienen desactivados. Cuando los activas, el sistema de notificaciones de tu dispositivo los programa localmente; no interviene ningún servicio push ni servidor. Tú decides si los nombres y montos aparecen en la pantalla de bloqueo.',
      ],
    },
    {
      heading: 'Copias de seguridad',
      paragraphs: [
        'Puedes exportar una copia de seguridad cifrada con una frase de contraseña que tú eliges, e importarla después. Tú decides dónde guardar o compartir el archivo (por ejemplo Archivos, iCloud Drive o correo) desde el menú de compartir de tu dispositivo; ese destino maneja el archivo según su propia política. Sin tu frase de contraseña nadie, ni siquiera nosotros, puede abrirla.',
        'Las copias de seguridad de tu propio dispositivo (como iCloud o la copia de Google) pueden incluir los datos de la app según tu configuración; esos datos siguen cifrados.',
      ],
    },
    {
      heading: 'Conexión a internet y terceros',
      paragraphs: [
        'Chranta no necesita conexión a internet y no transmite tus datos. No incluye SDK de terceros de analítica, publicidad, atribución ni reportes de fallos, y no te rastrea entre apps o sitios web.',
        'La única acción que usa internet es un enlace opcional a cacruz.com, que se abre en tu navegador. Apple y Google pueden recolectar información cuando descargas la app, según sus propias políticas de privacidad.',
      ],
    },
    {
      heading: 'Permisos',
      paragraphs: [
        'Chranta pide solo los permisos que necesita, y solo cuando usas la función relacionada:',
      ],
      bullets: [
        'Face ID / biometría: para desbloquear la app.',
        'Notificaciones: solo si activas los recordatorios de pago.',
        'Acceso a archivos: solo cuando eliges una copia de seguridad para importar.',
      ],
    },
    {
      heading: 'Conservación y eliminación de datos',
      paragraphs: [
        'Tu información permanece en tu dispositivo hasta que la borras. Puedes eliminar cualquier registro dentro de la app, y al desinstalar Chranta se borran sus datos de tu dispositivo. Como no guardamos ninguno de tus datos, no hay nada que eliminar de nuestro lado.',
      ],
    },
    {
      heading: 'Menores de edad',
      paragraphs: [
        'Chranta no está dirigida a menores de 13 años. No recolectamos información de nadie, incluidos los menores.',
      ],
    },
    {
      heading: 'Tus derechos',
      paragraphs: [
        'Como tus datos viven solo en tu dispositivo, tienes el control total en todo momento: puedes verlos, corregirlos, exportarlos (con una copia de seguridad) y borrarlos directamente en la app. Esto aplica donde vivas, incluso bajo el RGPD, la CCPA y las leyes de protección de datos de Latinoamérica, como la Ley 1581 de 2012 de Colombia.',
      ],
    },
    {
      heading: 'Cambios a esta política',
      paragraphs: [
        'Si cambia la forma en que Chranta maneja la información, actualizaremos esta página y su fecha antes de que el cambio llegue a la app. Si algún día la app necesitara enviar datos fuera de tu dispositivo, te explicará qué se envía y a quién, y te pedirá permiso antes.',
      ],
    },
    {
      heading: 'Contacto',
      paragraphs: [
        'Para preguntas sobre esta política o sobre Chranta, usa el formulario de contacto en cacruz.com/for-companies.',
      ],
    },
  ],
};
