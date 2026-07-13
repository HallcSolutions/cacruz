import { LocalizedText } from './localized-text';

export interface BlogPostMeta {
  slug: string;
  date: string;
  title: LocalizedText;
  summary: LocalizedText;
  tags: string[];
}
