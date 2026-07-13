import { BlogPostMeta } from '../models/blog-post-meta';

export function sortPostsByDateDesc(posts: BlogPostMeta[]): BlogPostMeta[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
