import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, Injector } from '@angular/core';
import { BlogPost } from '../models/blog-post';
import { BlogPostMeta } from '../models/blog-post-meta';
import { blogIndexUrl, blogPostUrl } from './blog-content-urls';
import { sortPostsByDateDesc } from './sort-posts';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly injector = inject(Injector);
  private readonly index = httpResource<BlogPostMeta[]>(() => blogIndexUrl());

  readonly posts = computed(() => sortPostsByDateDesc(this.index.value() ?? []));
  readonly isLoading = computed(() => this.index.isLoading());

  postResource(slug: () => string | undefined): HttpResourceRef<BlogPost | undefined> {
    return httpResource<BlogPost>(
      () => {
        const currentSlug = slug();
        return currentSlug ? blogPostUrl(currentSlug) : undefined;
      },
      { injector: this.injector },
    );
  }
}
