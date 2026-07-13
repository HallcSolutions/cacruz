import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlogPostPage } from './blog-post';

const POST = {
  slug: 'mi-entrada',
  date: '2026-07-13',
  title: { es: 'Mi entrada', en: 'My post' },
  summary: { es: 'Resumen', en: 'Summary' },
  tags: ['sdd'],
  body: {
    es: [
      { kind: 'paragraph', text: 'Primer párrafo con [chalc](https://github.com/x/chalc).' },
      { kind: 'heading', text: 'Un subtítulo' },
      { kind: 'steps', items: ['Paso uno', 'Paso dos'] },
      { kind: 'terminal', lines: ['chalc init'] },
      { kind: 'image', src: 'images/blog/spec-flow.es.svg', caption: 'El flujo' },
      {
        kind: 'quote',
        text: 'Una cita.',
        source: 'DeMillo, Lipton y Sayward (1978)',
        sourceUrl: 'https://ieeexplore.ieee.org/document/1646911',
      },
    ],
    en: [{ kind: 'paragraph', text: 'First paragraph.' }],
  },
};

describe('BlogPostPage', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      imports: [BlogPostPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  function create(slug: string): ComponentFixture<BlogPostPage> {
    const fixture = TestBed.createComponent(BlogPostPage);
    fixture.componentRef.setInput('slug', slug);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('content/blog/index.json').flush([]);
    return fixture;
  }

  // R10 — detalle completo en el idioma activo
  it('renders the full post in the active language (R10)', async () => {
    const fixture = create('mi-entrada');
    TestBed.inject(HttpTestingController).expectOne('content/blog/mi-entrada.json').flush(POST);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Mi entrada');
    expect(host.textContent).toContain('Primer párrafo con chalc.');
    expect(host.textContent).toContain('13 de julio de 2026');
  });

  // R54 — la entrada renderiza todos los tipos de bloque
  it('renders headings, steps, terminal blocks, images and quotes (R54)', async () => {
    const fixture = create('mi-entrada');
    TestBed.inject(HttpTestingController).expectOne('content/blog/mi-entrada.json').flush(POST);
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.post__heading')?.textContent).toContain('Un subtítulo');
    expect(host.querySelectorAll('.post__step').length).toBe(2);
    expect(host.querySelector('.post__terminal-line')?.textContent).toContain('chalc init');
    expect(host.querySelector('.post__figure img')?.getAttribute('src')).toBe(
      'images/blog/spec-flow.es.svg',
    );
    expect(host.querySelector('.post__figure figcaption')?.textContent).toContain('El flujo');
    expect(host.querySelector('.post__quote')?.textContent).toContain('Una cita.');
  });

  // R58 — la cita muestra su autoría, enlazada a la referencia original
  it('shows the attribution of a quote, linked to its source (R58)', async () => {
    const fixture = create('mi-entrada');
    TestBed.inject(HttpTestingController).expectOne('content/blog/mi-entrada.json').flush(POST);
    await fixture.whenStable();
    fixture.detectChanges();

    const cite = (fixture.nativeElement as HTMLElement).querySelector('.post__cite')!;
    expect(cite.textContent).toContain('DeMillo, Lipton y Sayward (1978)');
    const link = cite.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('https://ieeexplore.ieee.org/document/1646911');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  // R55 — los enlaces del texto se renderizan y los externos abren en pestaña nueva
  it('renders inline links, opening external ones in a new tab (R55)', async () => {
    const fixture = create('mi-entrada');
    TestBed.inject(HttpTestingController).expectOne('content/blog/mi-entrada.json').flush(POST);
    await fixture.whenStable();
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
      '.post__paragraph a',
    )!;
    expect(link.getAttribute('href')).toBe('https://github.com/x/chalc');
    expect(link.textContent?.trim()).toBe('chalc');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  // R12 — no encontrada → estado con enlace de vuelta
  it('shows a not-found state with a way back for missing posts (R12)', async () => {
    const fixture = create('no-existe');
    TestBed.inject(HttpTestingController)
      .expectOne('content/blog/no-existe.json')
      .flush('nope', { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Entrada no encontrada');
    const back = Array.from(host.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(back).toContain('/daily');
  });
});
