export type ConsoleLineKind = 'command' | 'echo' | 'ready' | 'waiting';

export interface ConsoleLine {
  kind: ConsoleLineKind;
  text: string;
}
