import { Language } from '../../../core/i18n/language.model';
import { BlogBlock } from './blog-block';
import { BlogPostMeta } from './blog-post-meta';

export interface BlogPost extends BlogPostMeta {
  body: Record<Language, BlogBlock[]>;
}
