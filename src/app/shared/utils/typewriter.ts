export interface TypewriterState {
  wordIndex: number;
  length: number;
  holdTicks: number;
  deleting: boolean;
}

export const TYPEWRITER_HOLD_TICKS = 14;

export const INITIAL_TYPEWRITER_STATE: TypewriterState = {
  wordIndex: 0,
  length: 0,
  holdTicks: 0,
  deleting: false,
};

export function typewriterText(words: readonly string[], state: TypewriterState): string {
  return words[state.wordIndex].slice(0, state.length);
}

export function nextTypewriterState(
  words: readonly string[],
  state: TypewriterState,
): TypewriterState {
  const word = words[state.wordIndex];

  if (state.deleting) {
    if (state.length > 0) {
      return { ...state, length: state.length - 1 };
    }
    return {
      wordIndex: (state.wordIndex + 1) % words.length,
      length: 0,
      holdTicks: 0,
      deleting: false,
    };
  }

  if (state.length < word.length) {
    return { ...state, length: state.length + 1 };
  }

  if (state.holdTicks < TYPEWRITER_HOLD_TICKS) {
    return { ...state, holdTicks: state.holdTicks + 1 };
  }

  return { ...state, holdTicks: 0, deleting: true };
}
