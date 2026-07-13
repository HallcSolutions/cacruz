export function blogIndexUrl(): string {
  return 'content/blog/index.json';
}

export function blogPostUrl(slug: string): string {
  return `content/blog/${slug}.json`;
}
