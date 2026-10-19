import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../../core/i18n/translation.service';
import { Product } from './product';
import { SoftwareContentService } from './software-content.service';

const FAKE_PRODUCTS: Product[] = [
  {
    id: 'craftiva',
    name: 'Craftiva',
    tagline: 'ERP con IA',
    description: 'Plataforma de gestión empresarial.',
    highlights: ['Bot de WhatsApp'],
    stack: ['Angular 20', 'NestJS 11'],
    logo: 'images/software/craftiva.png',
    url: 'https://appcraftiva.com',
  },
];

describe('SoftwareContentService', () => {
  beforeEach(() => {
    localStorage.removeItem('cacruz.language');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.removeItem('cacruz.language'));

  // R62 — el contenido de los productos vive versionado y es bilingüe
  it('loads the products for the active language (R62)', async () => {
    const service = TestBed.inject(SoftwareContentService);
    const http = TestBed.inject(HttpTestingController);

    TestBed.tick();
    http.expectOne('content/software.es.json?v=2').flush(FAKE_PRODUCTS);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.products.value()).toEqual(FAKE_PRODUCTS);
  });

  it('reloads the products when the language changes (R62, R13)', async () => {
    const service = TestBed.inject(SoftwareContentService);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();
    http.expectOne('content/software.es.json?v=2').flush(FAKE_PRODUCTS);
    await TestBed.inject(ApplicationRef).whenStable();

    TestBed.inject(TranslationService).setLanguage('en');
    TestBed.tick();

    http.expectOne('content/software.en.json?v=2').flush(FAKE_PRODUCTS);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(service.products.value()).toEqual(FAKE_PRODUCTS);
  });
});

describe('Published Chranta content (professional-home R19)', () => {
  for (const [language, tagline, localAi, confirmedDraft, encrypted] of [
    ['es', 'Finanzas personales con IA local', /dispositivo/, /confirm/, /cifrad/],
    ['en', 'Personal finance with on-device AI', /device/, /confirm/, /encrypt/],
  ] as const) {
    it(`publishes the verified Chranta catalogue in ${language} (R19)`, async () => {
      const response = await fetch(`/content/software.${language}.json`);
      expect(response.ok).toBeTrue();
      const products = await response.json() as Product[];
      const matches = products.filter((product) => product.id === 'chranta');
      expect(matches.length).toBe(1);
      const chranta = matches[0];
      if (!chranta) return;

      expect(chranta.name).toBe('Chranta');
      expect(chranta.tagline).toBe(tagline);
      expect(chranta.description).toMatch(localAi);
      expect(chranta.description).toMatch(confirmedDraft);
      expect(chranta.description).toMatch(encrypted);
      expect(chranta.highlights.length).toBe(4);
      expect(chranta.stack).toEqual(['Flutter', 'Dart', 'Qwen3-0.6B', 'SQLCipher']);
      expect(chranta.logo).toBe('images/software/chranta.png');
      expect(chranta.appStoreUrl).toBe('https://apps.apple.com/co/app/chranta/id6819862051');
      expect(chranta.url).toBeUndefined();
      expect(chranta.playStoreUrl).toBeUndefined();
    });
  }

  it('serves the original Chranta icon as a PNG (R19)', async () => {
    const response = await fetch('/images/software/chranta.png');
    expect(response.ok).toBeTrue();
    expect(response.headers.get('content-type')).toContain('image/png');
  });
});
