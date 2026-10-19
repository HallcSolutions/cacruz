/** Objetos y actores del relato; no son resultados de una ejecución real. */
export const CHALC_AGENT_SCENES = [
  { id: 'context', agent: 'tool', input: 'need', output: 'context' },
  { id: 'spec', agent: 'leader', input: 'need', output: 'spec' },
  { id: 'red', agent: 'developer', input: 'spec', output: 'test' },
  { id: 'agents', agent: 'developer', input: 'test', output: 'change' },
  { id: 'gate', agent: 'tool', input: 'change', output: 'evidence' },
  { id: 'review', agent: 'reviewer', input: 'change', output: 'finding' },
  { id: 'memory', agent: 'human', input: 'evidence', output: 'memory' },
] as const;
