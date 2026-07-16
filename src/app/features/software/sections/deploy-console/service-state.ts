import { ServiceStatus } from './service-status';

/** Estado visible de un producto en la consola: su fase, los logs tecleados y si el detalle está plegado. */
export interface ServiceState {
  status: ServiceStatus;
  lines: string[];
  collapsed: boolean;
}

/** Estado con el que arranca todo servicio antes de su primer despliegue. */
export const OFFLINE_STATE: ServiceState = { status: 'offline', lines: [], collapsed: false };
