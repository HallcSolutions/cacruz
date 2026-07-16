import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslationService } from '../../../../core/i18n/translation.service';
import { BlogListPage } from './blog-list';

const INDEX = [
  {
    slug: 'entrada-vieja',
    date: '2024-02-01',
    title: { es: 'Entrada vieja', en: 'Old post' },
    summary: { es: 'Resumen viejo', en: 'Old summary' },
    tags: ['tdd'],
  },
  {
    slug: 'entrada-nueva',
    date: '2026-07-13',
    title: { es: 'Entrada nueva', en: 'New post' },
    summary: { es: 'Resumen nuevo', en: 'New summary' },
    tags: ['sdd'],
  },
];

describe('BlogListPage', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      imports: [BlogListPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  async function render() {
    const fixture = TestBed.createComponent(BlogListPage);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('content/blog/index.json?v=2').flush(INDEX);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  // R9 — listado con título, fecha, resumen y etiquetas, orden desc
  it('lists posts newest first with title, date, summary and tags (R9)', async () => {
    const host = (await render()).nativeElement as HTMLElement;
    const titles = Array.from(host.querySelectorAll('.entry__title')).map((h) =>
      h.textContent?.trim(),
    );
    expect(titles).toEqual(['Entrada nueva', 'Entrada vieja']);
    expect(host.textContent).toContain('Resumen nuevo');
    expect(host.textContent).toContain('13 de julio de 2026');
    expect(host.textContent).toContain('#sdd');
  });

  // R10 — cada entrada navega a su detalle
  it('links every post to its detail route (R10)', async () => {
    const host = (await render()).nativeElement as HTMLElement;
    const links = Array.from(host.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(links).toContain('/daily/entrada-nueva');
  });

  // R13 — el listado cambia de idioma sin recarga
  it('renders titles in the active language (R13)', async () => {
    const fixture = await render();
    TestBed.inject(TranslationService).setLanguage('en');
    fixture.detectChanges();
    const titles = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.entry__title'),
    ).map((h) => h.textContent?.trim());
    expect(titles).toEqual(['New post', 'Old post']);
  });
});
