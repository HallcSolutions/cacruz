export type BlogBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'quote'; text: string; source?: string; sourceUrl?: string }
  | { kind: 'steps'; items: string[] }
  | { kind: 'terminal'; lines: string[] }
  | { kind: 'image'; src: string; caption: string };
