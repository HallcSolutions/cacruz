import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BlogPostMeta } from '../models/blog-post-meta';
import { BlogService } from './blog.service';

function meta(slug: string, date: string): BlogPostMeta {
  return {
    slug,
    date,
    title: { es: `${slug} es`, en: `${slug} en` },
    summary: { es: '', en: '' },
    tags: ['tag'],
  };
}

describe('BlogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  // R9, R11 — lista publicada desde el índice, ordenada desc
  it('lists posts from the content index, newest first (R9, R11)', async () => {
    const service = TestBed.inject(BlogService);
    const http = TestBed.inject(HttpTestingController);

    TestBed.tick();
    http
      .expectOne('content/blog/index.json?v=2')
      .flush([meta('viejo', '2024-05-01'), meta('nuevo', '2026-07-13')]);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.posts().map((p) => p.slug)).toEqual(['nuevo', 'viejo']);
  });

  // R10 — detalle por slug
  it('loads a post detail by slug (R10)', async () => {
    const service = TestBed.inject(BlogService);
    const http = TestBed.inject(HttpTestingController);

    const post = service.postResource(() => 'mi-entrada');
    TestBed.tick();
    http.expectOne('content/blog/index.json?v=2').flush([]);
    http.expectOne('content/blog/mi-entrada.json?v=2').flush({
      ...meta('mi-entrada', '2026-07-13'),
      body: {
        es: [{ kind: 'paragraph', text: 'hola' }],
        en: [{ kind: 'paragraph', text: 'hello' }],
      },
    });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(post.value()?.slug).toBe('mi-entrada');
    expect(post.value()?.body.es).toEqual([{ kind: 'paragraph', text: 'hola' }]);
  });

  // R12 — entrada inexistente → error expuesto
  it('exposes an error state when the post does not exist (R12)', async () => {
    const service = TestBed.inject(BlogService);
    const http = TestBed.inject(HttpTestingController);

    const post = service.postResource(() => 'no-existe');
    TestBed.tick();
    http.expectOne('content/blog/index.json?v=2').flush([]);
    http
      .expectOne('content/blog/no-existe.json?v=2')
      .flush('not found', { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(post.error()).toBeTruthy();
    expect(post.hasValue()).toBeFalse();
  });
});
