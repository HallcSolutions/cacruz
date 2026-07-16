import { withContentVersion } from '../../../core/content/content-version';

export function blogIndexUrl(): string {
  return withContentVersion('content/blog/index.json');
}

export function blogPostUrl(slug: string): string {
  return withContentVersion(`content/blog/${slug}.json`);
}
