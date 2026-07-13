import { formatPostDate } from './format-post-date';

describe('formatPostDate', () => {
  it('formats the date in Spanish (R13)', () => {
    expect(formatPostDate('2026-07-13', 'es')).toBe('13 de julio de 2026');
  });

  it('formats the date in English (R13)', () => {
    expect(formatPostDate('2026-07-13', 'en')).toBe('July 13, 2026');
  });
});
