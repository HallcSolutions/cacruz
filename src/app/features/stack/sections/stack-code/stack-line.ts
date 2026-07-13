export type StackLineKind = 'open' | 'key' | 'item' | 'close' | 'end';

export interface StackLine {
  text: string;
  indent: number;
  kind: StackLineKind;
}
