import { BUGS_PER_MACHINE } from '../model/arena-state';

/**
 * Arreglar una máquina es un flujo de git: rama → commit → merge. Cada "vida" de la máquina
 * es un paso; el comando que se ejecuta depende de los bugs que le quedan.
 */
export interface GitStep {
  /** Lo que teclea la terminal al lanzar el agente. */
  readonly command: string;
  /** Lo que muestra el holograma de la máquina. */
  readonly badge: string;
  readonly color: string;
}

export function gitStepFor(machineId: string, bugsLeft: number): GitStep {
  const branch = `fix/${machineId}`;
  switch (Math.min(bugsLeft, BUGS_PER_MACHINE)) {
    case 3:
      return { command: `git checkout -b ${branch}`, badge: '🐛 bug', color: '#ff4d4d' };
    case 2:
      return { command: `git commit -m "fix(${machineId}): patch"`, badge: `⎇ ${branch}`, color: '#ffb347' };
    case 1:
      return { command: `git push -u origin ${branch} && gh pr create`, badge: '✔ commit', color: '#4fe3ff' };
    default:
      return { command: '', badge: `⇄ PR #${prNumber(machineId)} abierto`, color: '#34d399' };
  }
}

/** Número de PR determinista a partir del id: el mismo en cada partida. */
export function prNumber(machineId: string): number {
  return 100 + (parseInt(commitHash(machineId), 16) % 900);
}

/** Hash corto y determinista a partir del id: el mismo "commit" en cada partida. */
export function commitHash(machineId: string): string {
  let h = 2166136261;
  for (const ch of machineId) {
    h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0').slice(0, 7);
}
