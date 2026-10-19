/** Referencias del README de Chalc; este recorrido explica el método, no ejecuta comandos. */
export const CHALC_WORKFLOW_STEPS = [
  { id: 'context', reference: 'chalc init' },
  { id: 'spec', reference: 'spec.md · plan.md · tasks.md' },
  { id: 'red', reference: 'Red → Green → Refactor' },
  { id: 'agents', reference: 'chalc-cli · /plan' },
  { id: 'gate', reference: 'node .chalc/gate.mjs' },
  { id: 'review', reference: '.chalc/review.md' },
  { id: 'memory', reference: 'node .chalc/memory.mjs capture' },
] as const;
