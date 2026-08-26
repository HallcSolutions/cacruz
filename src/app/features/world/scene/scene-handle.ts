import { Vector2 } from '../model/vector2';

/** Lo único que Angular puede pedirle a la escena. Todo lo demás vive dentro de three.js. */
export interface SceneHandle {
  setDirection(direction: Vector2): void;
  /** Salta si está en el suelo (R89). */
  jump(): void;
  /** Recoloca la cámara detrás del personaje al instante (R90). */
  recenter(): void;
  /** Ejecuta un comando de IA: lanza un agente a la máquina con bugs más cercana. */
  runCommand(): void;
  /** Arma el audio tras el primer gesto del usuario. */
  armAudio(): void;
  sit(): void;
  stand(): void;
  dispose(): void;
}
