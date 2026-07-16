/**
 * El servidor mandó `max-age=31536000` para todo el contenido durante un tiempo, así que los
 * navegadores que ya visitaron el sitio lo tienen congelado hasta 2027 y ni siquiera preguntan.
 * Cambiar la URL los obliga a pedirlo de nuevo, y esa respuesta ya viaja con `no-cache`.
 *
 * Por eso el número no sube en cada despliegue: basta con que sea distinto de "sin query" una vez.
 */
const CONTENT_VERSION = 2;

export function withContentVersion(url: string): string {
  return `${url}?v=${CONTENT_VERSION}`;
}
