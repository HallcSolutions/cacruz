import { BlogPostMeta } from '../models/blog-post-meta';
import { sortPostsByDateDesc } from './sort-posts';

function post(slug: string, date: string): BlogPostMeta {
  return { slug, date, title: { es: slug, en: slug }, summary: { es: '', en: '' }, tags: [] };
}

describe('sortPostsByDateDesc', () => {
  // R9 — de más reciente a más antigua
  it('orders posts from newest to oldest (R9)', () => {
    const sorted = sortPostsByDateDesc([
      post('viejo', '2024-01-10'),
      post('nuevo', '2026-07-13'),
      post('medio', '2025-06-01'),
    ]);
    expect(sorted.map((p) => p.slug)).toEqual(['nuevo', 'medio', 'viejo']);
  });

  it('does not mutate the original list', () => {
    const original = [post('a', '2024-01-01'), post('b', '2025-01-01')];
    sortPostsByDateDesc(original);
    expect(original.map((p) => p.slug)).toEqual(['a', 'b']);
  });

  it('returns an empty list untouched', () => {
    expect(sortPostsByDateDesc([])).toEqual([]);
  });
});
