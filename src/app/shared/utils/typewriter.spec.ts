import {
  INITIAL_TYPEWRITER_STATE,
  nextTypewriterState,
  TYPEWRITER_HOLD_TICKS,
  typewriterText,
  TypewriterState,
} from './typewriter';

const WORDS = ['Angular', '.NET'] as const;

function advance(state: TypewriterState, ticks: number): TypewriterState {
  let current = state;
  for (let i = 0; i < ticks; i++) {
    current = nextTypewriterState(WORDS, current);
  }
  return current;
}

describe('typewriter', () => {
  // R19 — escribe letra a letra
  it('types the current word one character per tick (R19)', () => {
    let state = INITIAL_TYPEWRITER_STATE;
    state = nextTypewriterState(WORDS, state);
    expect(typewriterText(WORDS, state)).toBe('A');
    state = nextTypewriterState(WORDS, state);
    expect(typewriterText(WORDS, state)).toBe('An');
  });

  // R19 — sostiene la palabra completa antes de borrar
  it('holds the complete word before deleting (R19)', () => {
    let state = advance(INITIAL_TYPEWRITER_STATE, WORDS[0].length);
    expect(typewriterText(WORDS, state)).toBe('Angular');

    state = advance(state, TYPEWRITER_HOLD_TICKS);
    expect(typewriterText(WORDS, state)).toBe('Angular');
    expect(state.deleting).toBeFalse();

    state = nextTypewriterState(WORDS, state);
    expect(state.deleting).toBeTrue();
  });

  // R19 — borra letra a letra
  it('deletes one character per tick once deleting (R19)', () => {
    let state = advance(INITIAL_TYPEWRITER_STATE, WORDS[0].length + TYPEWRITER_HOLD_TICKS + 1);
    state = nextTypewriterState(WORDS, state);
    expect(typewriterText(WORDS, state)).toBe('Angula');
  });

  // R19 — al vaciar pasa a la siguiente palabra
  it('moves to the next word after deleting everything (R19)', () => {
    let state = advance(
      INITIAL_TYPEWRITER_STATE,
      WORDS[0].length + TYPEWRITER_HOLD_TICKS + 1 + WORDS[0].length,
    );
    state = nextTypewriterState(WORDS, state);
    expect(state.wordIndex).toBe(1);
    expect(state.deleting).toBeFalse();
    state = nextTypewriterState(WORDS, state);
    expect(typewriterText(WORDS, state)).toBe('.');
  });

  // R19 — en bucle: vuelve a la primera palabra
  it('wraps around to the first word (R19)', () => {
    const fullCycle = (word: string) => word.length + TYPEWRITER_HOLD_TICKS + 1 + word.length + 1;
    const state = advance(INITIAL_TYPEWRITER_STATE, fullCycle(WORDS[0]) + fullCycle(WORDS[1]));
    expect(state.wordIndex).toBe(0);
  });
});
