/** Ciclo de vida de un servicio en la consola: apagado → desplegando → en línea. */
export type ServiceStatus = 'offline' | 'deploying' | 'online';
