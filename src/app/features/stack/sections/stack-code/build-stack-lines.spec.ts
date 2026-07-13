import { buildStackLines } from './build-stack-lines';

describe('buildStackLines', () => {
  // R39 — el stack se representa como código TypeScript línea a línea
  it('builds an editor-ready TypeScript object from the categories (R39)', () => {
    const lines = buildStackLines([
      { name: 'Frontend', icon: '🖥️', items: ['Angular', 'TypeScript'] },
      { name: 'Backend', icon: '⚙️', items: ['.NET'] },
    ]);

    expect(lines.map((l) => l.text)).toEqual([
      'const stack = {',
      "'Frontend': [",
      "'Angular',",
      "'TypeScript',",
      '],',
      "'Backend': [",
      "'.NET',",
      '],',
      '};',
    ]);
  });

  it('indents keys and items like a real editor (R39)', () => {
    const lines = buildStackLines([{ name: 'Frontend', icon: '🖥️', items: ['Angular'] }]);
    expect(lines.map((l) => l.indent)).toEqual([0, 1, 2, 1, 0]);
    expect(lines.map((l) => l.kind)).toEqual(['open', 'key', 'item', 'close', 'end']);
  });

  it('handles an empty stack with just the object shell (R39)', () => {
    expect(buildStackLines([]).map((l) => l.text)).toEqual(['const stack = {', '};']);
  });
});
